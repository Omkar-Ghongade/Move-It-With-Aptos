import sys
import os
from docx import Document

def main():
    # Debug: Print working directory and list files
    print("Current working directory:", os.getcwd())
    print("Files in working directory:", os.listdir('.'))
    
    # Ensure a commit message argument is provided
    if len(sys.argv) < 2:
        print("Usage: python update_word.py 'commit message'")
        sys.exit(1)
    
    commit_message = sys.argv[1]
    doc_path = "./demo.docx"  # explicitly use relative path

    # Check if the file exists and print its size
    if not os.path.exists(doc_path):
        print(f"Error: File {doc_path} not found. Please ensure it exists in the repository.")
        sys.exit(1)
    else:
        print(f"Found {doc_path} with size {os.path.getsize(doc_path)} bytes")

    try:
        # Open the existing Word document
        document = Document(doc_path)
    except Exception as e:
        print(f"Error opening document {doc_path}: {e}")
        sys.exit(1)

    # Append a new paragraph with the commit message
    document.add_paragraph(f"Latest commit message: {commit_message}")

    try:
        # Save the updated document back to the same path
        document.save(doc_path)
        print("Document updated successfully.")
    except Exception as e:
        print(f"Error saving document {doc_path}: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
