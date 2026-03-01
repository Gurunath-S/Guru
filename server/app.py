import os
import requests
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS so the React app can make requests to this backend
CORS(app)

EMAILJS_SERVICE_ID = os.getenv("EMAILJS_SERVICE_ID")
EMAILJS_TEMPLATE_ID = os.getenv("EMAILJS_TEMPLATE_ID")
EMAILJS_PUBLIC_KEY = os.getenv("EMAILJS_PUBLIC_KEY")
EMAILJS_PRIVATE_KEY = os.getenv("EMAILJS_PRIVATE_KEY")

def send_email_background(payload, headers):
    try:
        # We send the request securely from the backend to the EmailJS API in the background
        requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            json=payload,
            headers=headers
        )
    except Exception as e:
        print(f"Background email failed: {str(e)}")

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    
    if not data or not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({"error": "Missing required fields"}), 400

    # Prepare the payload for EmailJS REST API
    payload = {
        "service_id": EMAILJS_SERVICE_ID,
        "template_id": EMAILJS_TEMPLATE_ID,
        "user_id": EMAILJS_PUBLIC_KEY,
        "accessToken": EMAILJS_PRIVATE_KEY,
        "template_params": {
            "name": data.get("name"),
            "email": data.get("email"),
            "message": data.get("message")
        }
    }

    headers = {
        'Content-Type': 'application/json'
    }

    # Dispatch the actual email sending to a background thread
    email_thread = threading.Thread(target=send_email_background, args=(payload, headers))
    email_thread.start()

    # Immediately return success to the frontend to eliminate loading times
    return jsonify({"message": "Email request received!"}), 200

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
    # Run the server on port 5000
    app.run(debug=True, port=5000)
