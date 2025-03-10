import os
import subprocess
from google import genai

API_KEY = os.environ["API_KEY"]


def get_new_changes(existing_docs):
    try:
        client = genai.Client(api_key=API_KEY)
        changes = subprocess.check_output(f"git diff --unified=0 HEAD~ HEAD", shell=True).decode()
        if existing_docs == "No existing documentation found.":
            prompt = "Generate documentation for the new code in this repository. The documentation should include the following sections: 1. Introduction 2. Installation 3. Usage 4. Examples 5. API Reference 6. Contributing 7. License"
            prompt+= changes
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt
            )
            return response.text
        else:
            prompt = "Update the documentation for the new code in this repository. The documentation should include the following sections: 1. Introduction 2. Installation 3. Usage 4. Examples 5. API Reference 6. Contributing 7. License"
            prompt+= changes
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