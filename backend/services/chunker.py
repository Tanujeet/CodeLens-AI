def chunk_files(files:list):
    chunks = []
    for file in files:
        patch  = file.get("patch","")

        if not patch:
            continue


        for start in range(0, len(patch), 3000):
            chunks.append({
                "filename":file["filename"],
                "patch":patch[start:start + 3000]
            })
    

    return chunks
