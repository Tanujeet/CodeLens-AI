from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()



llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)


prompt = ChatPromptTemplate.from_template("""
You are an expert senior software engineer reviewing a GitHub Pull Request.

Filename: {filename}
Code Changes (diff format):
{patch}

Review the changes and provide structured feedback on:
1. Bugs or logical errors
2. Security vulnerabilities  
3. Code quality & readability
4. Performance issues
5. Suggestions for improvement

Be specific, mention line numbers where possible. Keep feedback concise and actionable.
""")

chain = prompt | llm


def review_chunk(chunk:dict):
    result = chain.invoke({
        "filename":chunk["filename"],
        "patch":chunk["patch"]
    })


    return {
        "filename":chunk["filename"],
        "review":result.content

    }