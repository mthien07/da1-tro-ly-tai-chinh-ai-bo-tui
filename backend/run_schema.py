import os
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def main() -> None:
    database_url = os.getenv("SUPABASE_DB_URL")
    if not database_url:
        raise RuntimeError("SUPABASE_DB_URL is required to run schema.sql")

    schema_path = Path(__file__).with_name("schema.sql")
    schema_sql = schema_path.read_text(encoding="utf-8")

    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cursor:
            cursor.execute(schema_sql)
        conn.commit()

    print("Schema applied successfully")


if __name__ == "__main__":
    main()
