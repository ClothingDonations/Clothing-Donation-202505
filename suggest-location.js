const deliveryLocations = [
  { name: "Location 1", lat: 12.9716, lon: 77.5946 },
  { name: "Location 2", lat: 13.0358, lon: 77.5970 },
  { name: "Location 3", lat: 12.9250, lon: 77.5938 },
  { name: "Location 4", lat: 13.0204, lon: 77.5905 },
  { name: "Location 5", lat: 12.9762, lon: 77.6033 },
  { name: "Location 6", lat: 12.9416, lon: 77.5668 },
  { name: "Location 7", lat: 12.9141, lon: 77.6387 },
  { name: "Location 8", lat: 12.9970, lon: 77.5600 },
  { name: "Location 9", lat: 13.0438, lon: 77.6215 },
  { name: "Location 10", lat: 13.0287, lon: 77.5933 },
  { name: "Location 11", lat: 12.9712, lon: 77.6410 },
  { name: "Location 12", lat: 12.9188, lon: 77.6101 }
];

const addressInput = document.querySelector("textarea[name='address']");
const suggestionBox = document.createElement("input");
suggestionBox.type = "text";
suggestionBox.readOnly = true;
suggestionBox.placeholder = "Nearest location will appear here";
suggestionBox.style.marginTop = "10px";
suggestionBox.style.background = "#f0f0f0";
suggestionBox.style.padding = "10px";
suggestionBox.style.borderRadius = "8px";
suggestionBox.style.border = "1px solid #ccc";
addressInput.insertAdjacentElement("afterend", suggestionBox);

addressInput.addEventListener("blur", async () => {
  const address = addressInput.value.trim();
  if (!address) return;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { "User-Agent": "ClothesDonationApp/1.0" } });
    const data = await res.json();

    if (!data[0]) {
      suggestionBox.value = "Could not locate address.";
      return;
    }

    const userLat = parseFloat(data[0].lat);
    const userLon = parseFloat(data[0].lon);
    const nearest = findClosestLocation(userLat, userLon);
    suggestionBox.value = nearest.name;
  } catch (err) {
    console.error("Geocoding failed:", err);
    suggestionBox.value = "Error finding location.";
  }
});

function findClosestLocation(lat, lon) {
  let closest = deliveryLocations[0];
  let minDist = getDistance(lat, lon, closest.lat, closest.lon);
  for (const loc of deliveryLocations) {
    const dist = getDistance(lat, lon, loc.lat, loc.lon);
    if (dist < minDist) {
      minDist = dist;
      closest = loc;
    }
  }
  return closest;
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * Math.PI / 180;
}