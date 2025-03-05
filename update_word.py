import sys
import os

def update_document(file_path, message):
    try:
        print(f"Opening {file_path} to update with message: {message}")
        # Open the Markdown file in append mode with UTF-8 encoding.
        with open(file_path, "a", encoding="utf-8") as file:
            # Append a new section for the commit message.
            file.write(f"\n\n## Latest Commit Message\n{message}\n")
        print(f"Updated {file_path} with message: {message}")
    except Exception as e:
        print(f"Error updating document {file_path}: {e}")

if __name__ == "__main__":
    commit_message = sys.argv[1] if len(sys.argv) > 1 else "No commit message"
    file_path = "demo.md"  # Now using a Markdown file
    
    if os.path.exists(file_path):
        update_document(file_path, commit_message)
    else:
        print(f"File {file_path} does not exist.")
