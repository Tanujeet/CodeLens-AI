import requests

import os 

from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}


def parse_pr_url(pr_url:str):
    parts = pr_url.strip("/").split('/')
    owner = parts[3]
    repo = parts[4]
    pr_number = parts[6]

    return owner , repo , pr_number


def fetch_pr_url(repo_name: str, pr_number: int):
    url = f"https://api.github.com/repos/{repo_name}/pulls/{pr_number}/files"
    
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code != 200:
        raise Exception(f"Github API Error: {response.status_code}")
    
    files = response.json()
    result = []
    
    for file in files:
        result.append({
            "filename": file["filename"],
            "status": file["status"],
            "patch": file.get("patch", ""),
        })
    
    return result
    