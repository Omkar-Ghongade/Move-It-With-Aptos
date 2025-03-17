import os
import subprocess
from google import genai

# API_KEY = os.environ["API_KEY"]

def getExistingDocs():
    try:
        with open("docs.md", "r") as file:
            print(file.read())
            return file.read()
    except FileNotFoundError:
        print("No existing documentation found.")
        return ""
    return existing_docs

if __name__ == "__main__":
    existing_docs = getExistingDocs()