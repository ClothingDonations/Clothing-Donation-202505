window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    const { latitude, longitude } = position.coords;

    fetch("http://127.0.0.1:5000/nearest-location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude, longitude }),
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("delivery_location");
        for (let option of select.options) {
          if (option.text.includes(data.name)) {
            option.selected = true;
            break;
          }
        }
      });
  }

  function error() {
    console.log("Location access denied.");
  }
};
