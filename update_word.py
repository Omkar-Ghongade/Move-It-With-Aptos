import sys
from docx import Document

def main():
    # Ensure a commit message argument is provided
    if len(sys.argv) < 2:
        print("Usage: python update_word.py 'commit message'")
        sys.exit(1)
    
    commit_message = sys.argv[1]
    doc_path = "demo.docx"  # Update if your docx is located elsewhere

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
