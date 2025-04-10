from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Request, Response
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()

class AskPayLoad(BaseModel):
    prompt : str
    code : str
    path : str

def call_llm(context: str) -> str:
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not set.")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
    model="gemini-2.0-flash", contents=context
)
    return response.text

def run_your_agent(prompt:str, code:str, path:str) -> str:
    # This function should contain the logic to run your agent.
    # For demonstration purposes, we'll just return a simple response.
    context =  f'''
    The user is working on a file located at path: {path}
    
    code in the file is as follows:
    ```python 
    {code}, 
    ```
    Task for the assistant:
    {prompt}
    
    Note: Return the response in markdown format.'''
    
    response = call_llm(context)
    return response

@app.post("/ask")
async def ask_agent(payload: AskPayLoad):
    # You can now send this to your LLM agent
    result = run_your_agent(payload.prompt, payload.code, payload.path)
    return {"result": result}