from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
from groq import APIConnectionError, APIStatusError, APITimeoutError
from psycopg2 import Error as DatabaseError
from services.github import fetch_pr_url
from services.chunker import chunk_files
from services.reviewer import review_chunk
from db.database import save_review

router = APIRouter()


class ReviewRequest(BaseModel):
    repo_name: str = Field(pattern=r"^[A-Za-z0-9][A-Za-z0-9-]*/[A-Za-z0-9_.-]+$")
    pr_number: int = Field(gt=0, strict=True)

    @field_validator("repo_name", mode="before")
    @classmethod
    def trim_repo_name(cls, value):
        return value.strip() if isinstance(value, str) else value


@router.post("/review")
def review_pr(request_data: ReviewRequest):
    repo_name = request_data.repo_name
    pr_number = request_data.pr_number
    
    files = fetch_pr_url(repo_name, pr_number)
    chunks = chunk_files(files)
    reviews_by_file = {}
    for chunk in chunks:
        try:
            result = review_chunk(chunk)
        except APITimeoutError:
            raise HTTPException(status_code=504, detail="AI review timed out. Please try again.")
        except APIConnectionError:
            raise HTTPException(status_code=502, detail="Could not connect to the AI service.")
        except APIStatusError as exc:
            if exc.status_code == 429:
                raise HTTPException(status_code=429, detail="AI rate limit reached. Please try again later.")
            raise HTTPException(status_code=502, detail="AI review failed. Check the backend Groq API key and model configuration.")
        reviews_by_file.setdefault(result["filename"], []).append(result["review"])
    reviews = [{"filename": filename, "review": "\n\n".join(parts)} for filename, parts in reviews_by_file.items()]
    try:
        for result in reviews:
            save_review(repo_name, pr_number, result["filename"], result["review"])
    except DatabaseError:
        raise HTTPException(status_code=503, detail="Could not save reviews. Please check the database connection.")
    return {"reviews": reviews}
