import os

def generate_documentation():
    # Load existing documentation from docs.md if it exists
    if os.path.exists('docs.md'):
        with open('docs.md', 'r') as file:
            existing_docs = file.read()
    else:
        existing_docs = ""

    # Use Gemini API to generate new documentation
    # This part requires actual integration with Gemini's API, which may involve authentication and specific request formats
    # For demonstration purposes, assume we have a function `generate_with_gemini()` that returns new documentation
    new_docs = generate_with_gemini()

    # Combine existing and new documentation
    combined_docs = existing_docs + "\n\n" + new_docs

    # Write the combined documentation to demo.md
    with open('demo.md', 'w') as file:
        file.write(combined_docs)

def generate_with_gemini():
    # Placeholder for actual Gemini API interaction
    # This should be replaced with the actual API call to generate documentation
    return "New documentation generated using Geminiiiiii."

if __name__ == "__main__":
    generate_documentation()
