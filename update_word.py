import os
import subprocess
from google import genai

# Load API key from environment variable
API_KEY = "AIzaSyBVa5aFWnrXrKXREtn11bvsN0wQrMmUO-8"

# Initialize Gemini client
client = genai.Client(api_key=API_KEY)

# Function to get changes from the merge
def get_merge_changes(pr_number):
    # Use GitHub CLI to get the merge commit hash
    merge_commit_hash = subprocess.check_output(f"gh pr view {pr_number} --json mergeCommit --jq '.mergeCommit.sha'", shell=True).decode().strip()
    
    # Use Git to get the changes introduced by the merge
    changes = subprocess.check_output(f"git diff -U0 {merge_commit_hash}^ {merge_commit_hash}", shell=True).decode()
    
    return changes

# Function to generate documentation for new code
def generate_documentation(changes, pr_title, pr_body):
    # Prompt for generating documentation
    prompt = f"Generate documentation for the new code changes:\n\n{changes}\n\nBased on the existing documentation and the pull request details:\n\nTitle: {pr_title}\n\nBody: {pr_body}"
    
    # Use Gemini to generate documentation
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    
    # Save the generated documentation to demo.md
    with open("demo.md", "w") as file:
        file.write(response.text)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 3:
        pr_number = sys.argv[1]
        pr_title = sys.argv[2]
        pr_body = sys.argv[3]
        
        changes = get_merge_changes(pr_number)
        generate_documentation(changes, pr_title, pr_body)
    else:
        print("Please provide pull request number, title, and body.")
