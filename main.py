from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text
from chunker import chunk_text
from embedder import embed_chunks
from store import store_chunks, collection, list_documents, clear_all
from highlight import find_best_sentence
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://doc-search-peach-nine.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    file_bytes = await file.read()

    try:
        text = extract_text(file.filename, file_bytes)
        chunks = chunk_text(text)
        embeddings = embed_chunks(chunks)
        store_chunks(file.filename, chunks, embeddings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    return {
        "filename": file.filename,
        "character_count": len(text),
        "num_chunks": len(chunks),
        "num_embeddings": len(embeddings),
        "embedding_dimension": len(embeddings[0]) if embeddings else 0,
        "first_chunk_preview": chunks[0][:200] if chunks else "",
        "stored_in_db": True
    }

@app.get("/documents")
def get_documents():
    return {"documents": list_documents()}

@app.delete("/documents")
def clear_documents():
    clear_all()
    return {"cleared": True}

@app.get("/search")
def search_documents(query: str, top_k: int = 5, filename: str = None):
    query_embedding = embed_chunks([query])[0]

    query_kwargs = {"query_embeddings": [query_embedding], "n_results": top_k}
    if filename:
        query_kwargs["where"] = {"filename": filename}

    results = collection.query(**query_kwargs)

    matches = []
    for i in range(len(results["documents"][0])):
        chunk_text = results["documents"][0][i]
        matches.append({
            "text": chunk_text,
            "highlight": find_best_sentence(query_embedding, chunk_text),
            "filename": results["metadatas"][0][i]["filename"],
            "chunk_index": results["metadatas"][0][i]["chunk_index"],
            "distance": results["distances"][0][i]
    })

    return {"query": query, "results": matches}

@app.get("/ask")
def ask_question(query: str, top_k: int = 5, filename: str = None):
    query_embedding = embed_chunks([query])[0]

    query_kwargs = {"query_embeddings": [query_embedding], "n_results": top_k}
    if filename:
        query_kwargs["where"] = {"filename": filename}

    results = collection.query(**query_kwargs)
    context = "\n\n".join(results["documents"][0])

    response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    max_tokens=500,
    messages=[
        {"role": "system", "content": "Answer using only the provided context. If the answer isn't in the context, say so."},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
    ]
)

    return {
        "query": query,
        "answer": response.choices[0].message.content,
        "sources": [
            {"filename": results["metadatas"][0][i]["filename"], "chunk_index": results["metadatas"][0][i]["chunk_index"]}
            for i in range(len(results["documents"][0]))
        ]
    }