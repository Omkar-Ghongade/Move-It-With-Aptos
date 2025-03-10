import os
import subprocess

# Function to get new changes from the branch
def get_new_changes():
    try:
        print("In Changes")
        # Use Git to get the changes introduced by the latest commit
        changes = subprocess.check_output(f"git diff --unified=0 HEAD~", shell=True).decode()
        
        return changes
    except subprocess.CalledProcessError as e:
        print(f"Error fetching new changes: {e}")
        return ""

# Function to write changes to demo.md
def write_changes_to_demo(changes):
    with open("demo.md", "w") as file:
        file.write(f"### New Code Changes\n\n{changes}")

if __name__ == "__main__":
    changes = get_new_changes()
    write_changes_to_demo(changes)
