from flask import Flask, request, jsonify
from math import radians, sin, cos, sqrt, atan2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows JS from HTML to access backend

locations = [
    {"name": "Zone 1", "lat": 15.4573, "lon": 75.0078},
    {"name": "Zone 2", "lat": 15.4589, "lon": 75.0085},
    {"name": "Zone 3", "lat": 15.4630, "lon": 75.0070},
    {"name": "Zone 4", "lat": 15.3763, "lon": 75.1004},
    {"name": "Zone 5", "lat": 15.3691, "lon": 75.1234},
    {"name": "Zone 6", "lat": 15.3622, "lon": 75.1387},
    {"name": "Zone 7", "lat": 15.3502, "lon": 75.1556},
    {"name": "Zone 8", "lat": 15.3535, "lon": 75.1701},
    {"name": "Zone 9", "lat": 15.3433, "lon": 75.1919},
    {"name": "Zone 10", "lat": 15.3388, "lon": 75.2000},
    {"name": "Zone 11", "lat": 15.3477, "lon": 75.2101},
    {"name": "Zone 12", "lat": 15.4635, "lon": 75.0060}
]

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dLat = radians(lat2 - lat1)
    dLon = radians(lon2 - lon1)
    a = sin(dLat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

@app.route("/nearest-location", methods=["POST"])
def nearest_location():
    data = request.get_json()
    user_lat, user_lon = data["latitude"], data["longitude"]

    nearest = min(locations, key=lambda loc: haversine(user_lat, user_lon, loc["lat"], loc["lon"]))
    return jsonify(nearest)
