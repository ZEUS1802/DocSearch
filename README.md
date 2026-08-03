Document Search — Semantic Search for PDFs & DOCX

A RAG-based search tool that finds content in your documents by **meaning, not just keywords**. Upload a PDF or DOCX, ask a question in your own words, and get back the actual matching passages — even if you don't remember the exact term the document uses.

Unlike a standard Ctrl+F or Adobe-style keyword search, this uses semantic embeddings to understand *intent*, so a query like "how do I remove duplicate rows" can correctly surface a section titled `SELECT DISTINCT` with zero literal word overlap.

**v1.0** — working end to end, with known limitations documented below.

---
**🔗 Live demo:** [doc-search-peach-nine.vercel.app](https://doc-search-peach-nine.vercel.app)
**API docs:** [docsearch-2wfu.onrender.com/docs](https://docsearch-2wfu.onrender.com/docs)
---

## Features

- Upload PDF or DOCX documents
- Semantic (meaning-based) search across all uploaded documents
- Filter search results to a single document
- Clear/reset stored documents
- Light and dark mode
- "Under the hood" page documenting the architecture and current limitations

## How it works

1. **Extract** — pull raw text from uploaded PDF/DOCX files
2. **Clean** — strip repeated boilerplate before it pollutes the embeddings
3. **Chunk** — split text into overlapping word-count windows
4. **Embed** — convert each chunk into a 384-dimension vector
5. **Store** — persist embeddings and text in a local vector database
6. **Retrieve** — embed the query, return the closest chunks by cosine distance

## Tech stack

**Backend:** FastAPI · sentence-transformers · ChromaDB · pypdf · python-docx · Docker
**Frontend:** React (Vite)

## A real finding

Source documents often had repeated boilerplate text (marketing lines, footers) after nearly every section. Since embeddings compress a whole chunk into a single vector, this repeated noise diluted the actual content — results were being ranked by keyword density in the boilerplate rather than relevance to the query.

Stripping the boilerplate before chunking measurably improved retrieval:

| | Top match distance (lower = more relevant) |
|---|---|
| Before cleaning | 1.108 |
| After stripping boilerplate | 0.951 |

## Known limitations (v1)

- **Fixed-size chunking dilutes topic-dense chunks.** On short, multi-topic reference documents, several unrelated sections can end up sharing one chunk, so a query about one topic can be outranked by a chunk that mentions many topics, including the right one.
- **Embedding distance measures topical similarity, not relevance.** A keyword-dense but generic chunk (e.g. a document's intro, or a references/citations section) can outrank a chunk that specifically answers the query.
- **The embedding model is English-centric.** Mixed-language documents retrieve less precisely than English-only ones.



## Planned for v2

- **Cross-encoder reranking** over the top-k candidates, to judge relevance directly instead of relying on embedding distance alone
- **Topic-aware chunking** for structured documents, so distinct sections land in separate chunks rather than being blended together

## Running locally

### Backend
```bash
cd doc-search-rag
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd doc-search-frontend
npm install
npm run dev
```

Backend runs on `http://127.0.0.1:8000` (API docs at `/docs`), frontend on `http://localhost:5173`.

### Docker
```bash
cd doc-search-rag
docker build -t doc-search-rag .
docker run -p 8000:8000 doc-search-rag
```

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload a PDF or DOCX file |
| `GET` | `/search?query=...&top_k=5&filename=...` | Semantic search, optionally scoped to one document |
| `GET` | `/documents` | List uploaded document filenames |
| `DELETE` | `/documents` | Clear all stored documents |
