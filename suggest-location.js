const deliveryLocations = [
  { name: "Location 1", lat: 15.4580, lon: 75.0078 },
  { name: "Location 2", lat: 15.3694, lon: 75.1239 },
  { name: "Location 3", lat: 15.3647, lon: 75.1239 },
  { name: "Location 4", lat: 15.39288, lon: 75.0815 },
  { name: "Location 5", lat: 15.3639, lon: 75.1145 },
  { name: "Location 6", lat: 15.3653, lon: 75.1245 },
  { name: "Location 7", lat: 15.3494, lon: 75.1103 },
  { name: "Location 8", lat: 15.3518, lon: 75.1147 },
  { name: "Location 9", lat: 15.3325, lon: 75.1251 },
  { name: "Location 10", lat: 15.3497, lon: 75.1334 },
  { name: "Location 11", lat: 15.3647, lon: 75.1239 },
  { name: "Location 12", lat: 15.4603, lon: 75.0103 }
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