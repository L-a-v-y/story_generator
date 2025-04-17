from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)

db = client["storygen_db"]

# Collections
users_collection = db["users"]
stories_collection = db["stories"]
arcs_collection = db["arcs"]
episodes_collection = db["episodes"]

# create indexes
# await users_collection.create_index([("username", ASCENDING)], unique=True)
# await stories_collection.create_index([("user_id", ASCENDING)])
