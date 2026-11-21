"""
One-shot MySQL setup for VenueVista.

Run:  .\venv\Scripts\python.exe setup_mysql.py
Does:  1) connects to MySQL using backend/.env
       2) creates the database if it does not exist
       3) runs Django migrations (creates ALL tables)
       4) seeds demo data if the database is empty
Safe to run multiple times.
"""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(BASE_DIR / '.env')
os.environ['DB_ENGINE'] = 'mysql'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'venuevista.settings')

import pymysql  # noqa: E402

pymysql.install_as_MySQLdb()

HOST = os.getenv('DB_HOST', '127.0.0.1')
PORT = int(os.getenv('DB_PORT', '3306'))
USER = os.getenv('DB_USER', 'root')
PASSWORD = os.getenv('DB_PASSWORD', '')
NAME = os.getenv('DB_NAME', 'venuevista_db')


def step(msg):
    print(f"\n==> {msg}")


def create_database():
    step(f"MySQL se connect ho raha hu ({USER}@{HOST}:{PORT})")
    try:
        conn = pymysql.connect(host=HOST, port=PORT, user=USER, password=PASSWORD,
                               connect_timeout=10)
    except pymysql.err.OperationalError as e:
        code = e.args[0] if e.args else None
        print(f"\n[ERROR] MySQL connect nahi hua: {e}")
        if code == 2003:
            print("  -> MySQL server band hai ya port galat hai. Windows 'Services' me MySQL80 ko Start karo.")
        elif code == 1045:
            print("  -> Username/password galat hai. backend/.env me DB_USER aur DB_PASSWORD check karo.")
        sys.exit(1)
    with conn.cursor() as cur:
        cur.execute(
            f"CREATE DATABASE IF NOT EXISTS `{NAME}` "
            "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
        cur.execute("SELECT VERSION()")
        print(f"   MySQL version: {cur.fetchone()[0]}")
    conn.commit()
    conn.close()
    print(f"   Database '{NAME}' ready.")


def main():
    create_database()

    import django
    django.setup()
    from django.core.management import call_command
    from django.db import connection

    step("Tables bana raha hu (migrate)")
    call_command('migrate', interactive=False)

    step("Demo data check")
    from api.models import Venue
    if Venue.objects.exists():
        print("   Data pehle se hai, seed skip kiya.")
    else:
        call_command('seed_data')

    with connection.cursor() as cur:
        cur.execute("SHOW TABLES")
        tables = [r[0] for r in cur.fetchall()]
    print(f"\n[OK] Done! '{NAME}' me {len(tables)} tables hain.")
    print("Ab server chalao:  .\\venv\\Scripts\\python.exe manage.py runserver")


if __name__ == '__main__':
    main()
