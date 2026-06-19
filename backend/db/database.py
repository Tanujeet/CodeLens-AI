import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()



def get_connection():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    return conn




def create_table():
    conn = get_connection()
    cursor = conn.cursor()


    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
                   id SERIAL PRIMARY KEY,
                   repo_name VARCHAR(255),
                   pr_number INTEGER,
                   filename VARCHAR(255),
                   review  TEXT,
                   created_at TIMESTAMP DEFAULT NOW()
        )
    """)


    conn.commit()
    cursor.close()
    conn.close()




def save_review(repo_name: str, pr_number: int, filename: str, review: str):
    conn = get_connection()
    cursor = conn.cursor()



    cursor.execute("""
        INSERT INTO reviews (
                repo_name,
                pr_number,
                filename,
                review)
        VALUES(%s,%s,%s,%s)
    """,

    (repo_name,pr_number,filename,review))


    conn.commit()
    cursor.close()
    conn.close()

