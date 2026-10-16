import requests
from fastapi import HTTPException

import os 

from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Accept": "application/vnd.github.v3+json"
}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"


def parse_pr_url(pr_url:str):
    parts = pr_url.strip("/").split('/')
    owner = parts[3]
    repo = parts[4]
    pr_number = parts[6]

    return owner , repo , pr_number


def fetch_pr_url(repo_name: str, pr_number: int):
    url = f"https://api.github.com/repos/{repo_name}/pulls/{pr_number}/files"
    
    result = []
    page = 1
    while True:
        try:
            response = requests.get(url, headers=HEADERS, params={"per_page": 100, "page": page}, timeout=30)
        except requests.Timeout:
            raise HTTPException(status_code=504, detail="GitHub request timed out. Please try again.")
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Could not connect to GitHub.")
        if response.status_code != 200:
            messages = {
                401: "GitHub authentication failed. Update the backend GitHub token.",
                403: "GitHub access denied or API rate limit reached.",
                404: "Repository or pull request not found, or the GitHub token has no access.",
                429: "GitHub rate limit reached. Please try again later.",
            }
            status = response.status_code if response.status_code in messages else 502
            raise HTTPException(status_code=status, detail=messages.get(status, "GitHub could not process the request."))
        files = response.json()
        for file in files:
            result.append({
                "filename": file["filename"],
                "status": file["status"],
                "patch": file.get("patch", ""),
            })
        if "next" not in response.links:
            break
        page += 1

    return result
