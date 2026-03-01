import os
import requests
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

    try:
        # We send the request securely from the backend to the EmailJS API
        response = requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            json=payload,
            headers=headers
        )

        if response.status_code == 200:
            return jsonify({"message": "Email sent successfully!"}), 200
        else:
            return jsonify({"error": f"Failed to send email: {response.text}"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
