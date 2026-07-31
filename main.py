from fastapi import FastAPI, UploadFile, File, HTTPException
from parser import extract_text
from chunker import chunk_text
from embedder import embed_chunks
from store import store_chunks
from store import store_chunks, collection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

@app.get("/search")
def search_documents(query: str, top_k: int = 5):
    query_embedding = embed_chunks([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    matches = []
    for i in range(len(results["documents"][0])):
        matches.append({
            "text": results["documents"][0][i],
            "filename": results["metadatas"][0][i]["filename"],
            "chunk_index": results["metadatas"][0][i]["chunk_index"],
            "distance": results["distances"][0][i]
        })

    return {"query": query, "results": matches}

