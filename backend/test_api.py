import subprocess
import time
import requests
import sys

def test_backend():
    print("Starting backend...")
    process = subprocess.Popen(
        ["venv/bin/uvicorn", "main:app", "--port", "8001"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(8) # wait for server to start

    try:
        print("Testing /api/v1/ocr/extract...")
        with open("sample_receipt.jpg", "rb") as f:
            files = {"file": ("sample_receipt.jpg", f, "image/jpeg")}
            res = requests.post("http://127.0.0.1:8001/api/v1/ocr/extract", files=files)
            print("OCR Status:", res.status_code)
            print("OCR Response:", res.json())

            if res.status_code != 200:
                print("OCR Test Failed!")
                return False

        print("\nTesting /api/v1/transactions/parse...")
        payload = {
            "raw_text": "Cơm rang dưa bò 50k",
            "user_id": "123e4567-e89b-12d3-a456-426614174000"
        }
        res = requests.post("http://127.0.0.1:8001/api/v1/transactions/parse", json=payload)
        print("Parse Status:", res.status_code)
        print("Parse Response:", res.json())

        if res.status_code != 200:
            print("Parse Test Failed!")
            return False

        return True
    except Exception as e:
        print(f"Error occurred: {e}")
        return False
    finally:
        process.terminate()
        process.wait()

if __name__ == "__main__":
    success = test_backend()
    sys.exit(0 if success else 1)
