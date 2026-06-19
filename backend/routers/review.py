from fastapi import APIRouter
from services.github import fetch_pr_url
from services.chunker import chunk_files
from services.reviewer import review_chunk
from db.database import save_review

router = APIRouter()

@router.post("/review")
async def review_pr(repo_name: str, pr_number: int):
    files = fetch_pr_url(repo_name, pr_number)
    chunks = chunk_files(files)
    reviews = []
    for chunk in chunks:
        result = review_chunk(chunk)
        save_review(repo_name, pr_number, result["filename"], result["review"])
        reviews.append(result)
    return {"reviews": reviews}
