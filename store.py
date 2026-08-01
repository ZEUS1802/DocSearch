import chromadb

client = chromadb.PersistentClient(path="./chroma_data")
collection = client.get_or_create_collection(name="documents")

def store_chunks(filename: str, chunks: list[str], embeddings: list[list[float]]):
    ids = [f"{filename}_{i}" for i in range(len(chunks))]
    metadatas = [{"filename": filename, "chunk_index": i} for i in range(len(chunks))]

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadatas
    )

def list_documents():
    data = collection.get()
    filenames = set(m["filename"] for m in data["metadatas"])
    return sorted(filenames)

def clear_all():
    data = collection.get()
    if data["ids"]:
        collection.delete(ids=data["ids"])