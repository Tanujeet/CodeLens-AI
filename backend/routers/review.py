from fastapi import APIRouter
from pydantic import BaseModel
from services.github import fetch_pr_url
from services.chunker import chunk_files
from services.reviewer import review_chunk
from db.database import save_review

router = APIRouter()

# 1. Ek Request Body Schema banayein
class ReviewRequest(BaseModel):
    repo_name: str
    pr_number: int

# 2. Route mein parameters ki jagah is body ko accept karein
@router.post("/review")
async def review_pr(request_data: ReviewRequest):
    repo_name = request_data.repo_name
    pr_number = request_data.pr_number
    
    files = fetch_pr_url(repo_name, pr_number)
    chunks = chunk_files(files)
    reviews = []
    for chunk in chunks:
        result = review_chunk(chunk)
        save_review(repo_name, pr_number, result["filename"], result["review"])
        reviews.append(result)
    return {"reviews": reviews}