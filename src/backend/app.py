from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React frontend to talk to Flask backend

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Backend is connected!"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
