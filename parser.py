from pypdf import PdfReader
from docx import Document
import io
import re

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    text = "\n".join(paragraph.text for paragraph in doc.paragraphs)
    return text

def clean_text(text: str) -> str:
    pattern = re.compile(
        r"NIHON ICHIBAN is the largest online shop.*?www\.anything-from-japan\.com",
        re.DOTALL
    )
    cleaned = pattern.sub("", text)
    print(f"Original length: {len(text)}, Cleaned length: {len(cleaned)}")
    return cleaned

def extract_text(filename: str, file_bytes: bytes) -> str:
    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        raw_text = extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type. Only PDF and DOCX are supported.")
    return clean_text(raw_text)