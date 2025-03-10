import os
import subprocess
from google import genai

API_KEY = os.environ["API_KEY"]


def get_new_changes(existing_docs):
    try:
        client = genai.Client(api_key=API_KEY)
        changes = subprocess.check_output(f"git diff --unified=0 HEAD~ HEAD", shell=True).decode()
        if existing_docs == "No existing documentation found.":
            prompt = (
                "Generate clear and concise documentation for the new code changes in this repository.\n\n"
                "- Format the documentation in Markdown (.md) style.\n"
                "- Do **not** add unnecessary sections like installation, usage, examples, or contributing unless relevant.\n"
                "- Keep it **concise, relevant, and structured**.\n"
                "- Focus on explaining the purpose, functionality, and key details of the code changes.\n\n"
            )
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt
            )
            return response.text
        else:
            prompt = (
                "Update the existing Markdown (.md) documentation to reflect the latest code changes.\n\n"
                "- Do **not** add redundant sections like installation, usage, examples, or anything unnecessary.\n"
                "- Keep the update **concise and structured**.\n"
                "- Clearly document the new modifications, functions, or improvements without adding irrelevant content.\n\n"
                "New code changes:\n"
                f"{changes}"
            )
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt
            )
            return response.text
    except subprocess.CalledProcessError as e:
        print(f"Error fetching new changes: {e}")
        return ""

def read_existing_docs():
    try:
        with open("docs.md", "r") as file:
            return file.read()
    except FileNotFoundError:
        print("No existing documentation found.")
        return ""

def write_changes_to_demo(existing_docs, changes):
    with open("demo.md", "w") as file:
        file.write(existing_docs + "\n\n### New Code Changes\n\n" + changes)

if __name__ == "__main__":
    existing_docs = read_existing_docs()
    changes = get_new_changes(existing_docs)
    write_changes_to_demo(existing_docs, changes)
    print("Documentation updated successfully.")