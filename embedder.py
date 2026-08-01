from fastembed import TextEmbedding

model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")

def embed_chunks(chunks: list[str]) -> list[list[float]]:
    embeddings = list(model.embed(chunks))
    return [e.tolist() for e in embeddings]