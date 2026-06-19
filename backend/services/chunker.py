def chunk_files(files:list):
    chunks = []
    for file in files:
        patch  = file.get("patch","")

        if not patch:
            continue


        patch = patch[:3000]

     
        chunks.append({
            "filename":file["filename"],
            "patch":patch
        })
    

    return chunks