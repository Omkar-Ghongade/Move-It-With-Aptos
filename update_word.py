import sys
import os
from docx import Document

def update_document(file_path, message):
    try:
        doc = Document(file_path)
        doc.add_paragraph(message)
        doc.save(file_path)
        print(f"Updated {file_path} with message: {message}")
    except Exception as e:
        print(f"Error opening document {file_path}: {e}")

if __name__ == "__main__":
    commit_message = sys.argv[1] if len(sys.argv) > 1 else "No commit message"
    file_path = "demo.docx"
    
    if os.path.exists(file_path):
        update_document(file_path, commit_message)
    else:
        print(f"File {file_path} does not exist.")