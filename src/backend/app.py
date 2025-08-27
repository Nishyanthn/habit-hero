import os
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity, unset_jwt_cookies, set_access_cookies
from flask_cors import CORS
from dotenv import load_dotenv
from bson import ObjectId # Import ObjectId to handle MongoDB's unique IDs

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# --- Configuration ---
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

# --- Initialize Extensions ---
mongo = PyMongo(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# --- MongoDB Collection References ---
try:
    users_collection = mongo.db.users
    habits_collection = mongo.db.habits # New collection for habits
    users_collection.find_one() 
except Exception as e:
    print(f"ERROR: Could not connect to MongoDB. \nDetails: {e}")
    users_collection = None
    habits_collection = None

# Helper function to convert MongoDB docs to JSON serializable format
def serialize_doc(doc):
    """Converts a MongoDB doc to a JSON serializable format."""
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# --- Authentication API Routes (Existing Code) ---

@app.route('/api/signup', methods=['POST'])
def signup():
    # ... (code remains the same)
    if users_collection is None:
        return jsonify({"msg": "Database connection failed"}), 500
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not email or not password or not name:
        return jsonify({"msg": "Name, email, and password are required"}), 400
    if users_collection.find_one({'email': email}):
        return jsonify({"msg": "Email already exists"}), 409
    hashed_password = generate_password_hash(password)
    users_collection.insert_one({'name': name, 'email': email, 'password': hashed_password})
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    # ... (code remains the same)
    if users_collection is None:
        return jsonify({"msg": "Database connection failed"}), 500
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    user = users_collection.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity=email)
        response = jsonify({"msg": "Login successful", "user": {"name": user['name'], "email": user['email']}})
        set_access_cookies(response, access_token)
        return response, 200
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    # ... (code remains the same)
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    # ... (code remains the same)
    if users_collection is None:
        return jsonify({"msg": "Database connection failed"}), 500
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({'email': current_user_email})
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({"name": user['name'], "email": user['email']}), 200

# --- NEW: Habit API Routes ---

@app.route('/api/habits', methods=['POST'])
@jwt_required()
def add_habit():
    """Creates a new habit for the logged-in user."""
    if habits_collection is None:
        return jsonify({"msg": "Database connection failed"}), 500

    current_user_email = get_jwt_identity()
    data = request.get_json()
    
    # Add the user's email to associate the habit with them
    data['user_email'] = current_user_email
    
    result = habits_collection.insert_one(data)
    new_habit = habits_collection.find_one({'_id': result.inserted_id})
    
    return jsonify(serialize_doc(new_habit)), 201

@app.route('/api/habits', methods=['GET'])
@jwt_required()
def get_habits():
    """Retrieves all habits for the logged-in user."""
    if habits_collection is None:
        return jsonify({"msg": "Database connection failed"}), 500

    current_user_email = get_jwt_identity()
    user_habits = habits_collection.find({'user_email': current_user_email})
    
    return jsonify([serialize_doc(habit) for habit in user_habits]), 200

@app.route('/api/habits/<habit_id>', methods=['DELETE'])
@jwt_required()
def delete_habit(habit_id):
    """Deletes a specific habit."""
    if habits_collection is None:
        return jsonify({"msg": "Database connection failed"}), 500

    current_user_email = get_jwt_identity()
    
    # Ensure the habit belongs to the current user before deleting
    result = habits_collection.delete_one({
        '_id': ObjectId(habit_id), 
        'user_email': current_user_email
    })

    if result.deleted_count == 1:
        return jsonify({"msg": "Habit deleted successfully"}), 200
    else:
        return jsonify({"msg": "Habit not found or user not authorized"}), 404

@app.route('/api/habits/<habit_id>', methods=['PUT'])
@jwt_required()
def update_habit(habit_id):
    """Updates a habit (e.g., marks as complete, edits details)."""
    if habits_collection is None:
        return jsonify({"msg": "Database connection failed"}), 500

    current_user_email = get_jwt_identity()
    data = request.get_json()

    # We don't want to allow changing the user email
    if 'user_email' in data:
        del data['user_email']

    result = habits_collection.update_one(
        {'_id': ObjectId(habit_id), 'user_email': current_user_email},
        {'$set': data}
    )

    if result.matched_count == 1:
        updated_habit = habits_collection.find_one({'_id': ObjectId(habit_id)})
        return jsonify(serialize_doc(updated_habit)), 200
    else:
        return jsonify({"msg": "Habit not found or user not authorized"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)
