from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class TextRequest(BaseModel):
    text: str

@app.post("/grammar")
def grammar_check(req: TextRequest):
    res = requests.post(
        "https://api.languagetool.org/v2/check",
        data={
            "text": req.text,
            "language": "en-US"
        }
    )

    data = res.json()

    return {
        "issues": data.get("matches", [])
    }