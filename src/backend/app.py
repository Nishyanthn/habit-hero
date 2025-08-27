import os
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity, unset_jwt_cookies, set_access_cookies
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# --- Configuration ---
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
# This is where the JWT is expected to be in the request. For http-only cookies, this is the right setting.
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

# --- Initialize Extensions ---
mongo = PyMongo(app)
jwt = JWTManager(app)
# Allow requests from your React frontend (e.g., http://localhost:3000)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Reference to the 'users' collection in MongoDB
users_collection = mongo.db.users

# --- API Routes ---

@app.route('/api/signup', methods=['POST'])
def signup():
    """
    Registers a new user.
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not email or not password or not name:
        return jsonify({"msg": "Name, email, and password are required"}), 400

    # Check if user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({"msg": "Email already exists"}), 409

    # Hash the password for security
    hashed_password = generate_password_hash(password)

    # Insert new user into the database
    users_collection.insert_one({
        'name': name,
        'email': email,
        'password': hashed_password
    })

    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    """
    Authenticates a user and returns a JWT in an http-only cookie.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = users_collection.find_one({'email': email})

    # Check if user exists and password is correct
    if user and check_password_hash(user['password'], password):
        # Create the JWT
        access_token = create_access_token(identity=email)
        
        # Create a response and set the JWT in an http-only cookie
        response = jsonify({"msg": "Login successful", "user": {"name": user['name'], "email": user['email']}})
        set_access_cookies(response, access_token)
        
        return response, 200
    
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    """
    Logs out the user by clearing the JWT cookie.
    """
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200


@app.route('/api/profile', methods=['GET'])
@jwt_required() # This decorator protects the route
def profile():
    """
    An example of a protected route.
    """
    # get_jwt_identity() retrieves the identity of the current user from the JWT
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({'email': current_user_email})

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "name": user['name'],
        "email": user['email']
    }), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
