import re
import numpy as np
from embedder import embed_chunks

def split_sentences(text: str) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]

def cosine_similarity(a, b) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def find_best_sentence(query_embedding, chunk_text: str) -> str:
    sentences = split_sentences(chunk_text)
    if len(sentences) <= 1:
        return chunk_text

    sentence_embeddings = embed_chunks(sentences)
    scores = [cosine_similarity(query_embedding, se) for se in sentence_embeddings]
    best_index = int(np.argmax(scores))
    return sentences[best_index]