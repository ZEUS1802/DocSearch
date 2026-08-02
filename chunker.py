import re

def chunk_text(text: str, chunk_size: int = 200, overlap: int = 30) -> list[str]:
    # Split on blank lines / paragraph breaks first — respects natural structure
    paragraphs = re.split(r'\n\s*\n', text)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    chunks = []
    current_chunk = []
    current_word_count = 0

    for para in paragraphs:
        para_words = para.split()

        # If one paragraph alone exceeds chunk_size, split it on its own
        if len(para_words) > chunk_size:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
                current_word_count = 0
            start = 0
            while start < len(para_words):
                end = start + chunk_size
                chunks.append(" ".join(para_words[start:end]))
                start += chunk_size - overlap
            continue

        # If adding this paragraph would overflow the current chunk, close it out
        if current_word_count + len(para_words) > chunk_size and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_word_count = 0

        current_chunk.extend(para_words)
        current_word_count += len(para_words)

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks