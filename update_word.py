import os
import subprocess

# Function to get new changes from the branch
def get_new_changes():
    try:
        print("In Changes")
        # Use Git to get the changes introduced by the latest commit
        changes = subprocess.check_output(f"git diff --unified=0 HEAD~ HEAD", shell=True).decode()
        
        return changes
    except subprocess.CalledProcessError as e:
        print(f"Error fetching new changes: {e}")
        return ""

# Function to read existing documentation
def read_existing_docs():
    try:
        with open("docs.md", "r") as file:
            return file.read()
    except FileNotFoundError:
        print("No existing documentation found.")
        return ""

# Function to write changes to demo.md
def write_changes_to_demo(existing_docs, changes):
    with open("demo.md", "w") as file:
        file.write(existing_docs + "\n\n### New Code Changes\n\n" + changes)

if __name__ == "__main__":
    changes = get_new_changes()
    existing_docs = read_existing_docs()
    write_changes_to_demo(existing_docs, changes)
    print("Documentation updated successfully.")