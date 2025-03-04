import sys
import os
import io
from docx import Document

def update_document(file_path, message):
    try:
        print(f"Opening {file_path} in binary mode.")
        # Open the file in binary mode and wrap in BytesIO
        with open(file_path, 'rb') as file:
            file_stream = io.BytesIO(file.read())
        print(file_stream)
        # Load the document from the binary stream
        doc = Document(file_stream)
        doc.add_paragraph(message)
        # Save the document back to the same file
        doc.save(file_path)
        print(f"Updated {file_path} with message: {message}")
    except Exception as e:
        print(f"Error updating document {file_path}: {e}")

if __name__ == "__main__":
    commit_message = sys.argv[1] if len(sys.argv) > 1 else "No commit message"
    file_path = "demo.docx"
    
    if os.path.exists(file_path):
        update_document(file_path, commit_message)
    else:
        print(f"File {file_path} does not exist.")
