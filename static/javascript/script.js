const btnHome = document.getElementById("home-btn");
const btnBattery = document.getElementById("battery-btn");
document.addEventListener("DOMContentLoaded", updateBatteryIcon);

async function updateBatteryIcon() {
  // default state (if anything fails)
  btnBattery.className = "bi bi-battery";

  try {
    const response = await fetch("/api/battery/stats");
    const data = await response.json();

    const percent = data.battery_percent;
    const charging = data.charging;

    // Charging overrides everything visually
    if (charging) {
      btnBattery.className = "bi bi-battery-charging";
      return;
    }

    if (percent < 50) {
      btnBattery.className = "bi bi-battery";
    } else if (percent < 80) {
      btnBattery.className = "bi bi-battery-half";
    } else {
      btnBattery.className = "bi bi-battery-full";
    }
  } catch (err) {
    console.error("Battery fetch failed:", err);

    // fallback icon
    btnBattery.className = "bi bi-battery";
  }
}
const viewHome = document.getElementById("view-home");
const viewBattery = document.getElementById("view-battery");

// To switch views when the button is clicked
function viewSelector(viewToshow) {
  // hide evrything
  viewHome.style.display = "none";
  viewBattery.style.display = "none";

  // and only show whats wanted
  viewToshow.style.display = "block";
}

btnHome.addEventListener("click", () => {
  viewSelector(viewHome);
});

btnBattery.addEventListener("click", async() => {
  viewSelector(viewBattery);
  const fetchData = await fetchBatteryData(); //To get the data as soon as the  button is clicked
  updateBatteryPage(fetchData)
});

async function fetchBatteryData() {
  try {
    const response = await fetch("/api/battery/stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching battery data:", error);
  }
};

function updateBatteryPage(data) {
  if(!data) return;
  updateBatteryLevel(data);
  updateBatteryStatus(data);
  updateBatteryTime(data);
  updateBattery(data);
}

function updateBatteryLevel(data) {
  if (data.battery_percent < 100) {
    document.getElementById("batt-percent").textContent =
      Math.round(data.battery_percent * 100) / 100;
  } else {
    document.getElementById("batt-percent").textContent = data.battery_percent;
  }
};

function updateBatteryStatus(data){
  if (data.charging) {
    document.getElementById("batt-charging").textContent = "Plugged In ⚡";
  } else if (!data.charging && data.battery_percent === 100) {
    document.getElementById("batt-charging").textContent = "Fully Charged 🔌";
  } else {
    document.getElementById("batt-charging").textContent = "On Battery 🔋";
  }
};

function updateBatteryTime(data){
  if (data.charging || data.battery_percent === 100) {
    document.getElementById("batt-time").textContent = "Unlimited (Plugged In)";
  } else if (data.seconds_left && data.seconds_left > 0) {
    // Convert raw seconds into Hours and Minutes
    let totalMinutes = Math.floor(data.seconds_left / 60);
    let hours = Math.floor(totalMinutes / 60);
    let mins = totalMinutes % 60;

    document.getElementById("batt-time").textContent =
      `${hours}h ${mins}m remaining`;
  } else {
    document.getElementById("batt-time").textContent = "Calculating...";
  }
};

function updateBattery(data) {
  document.getElementById("health-text").textContent = data.battery_health;
  const battery = data.battery_percent;
  const battery_bottom = data.battery_health;
  const bar = document.getElementById("battery-level");
  const btmBar = document.getElementById("health-level");
  bar.style.width = battery + "%";
  btmBar.style.width = battery_bottom + "%";
};

setInterval(() => {
  if (viewBattery.style.display === "block") {
    fetchBatteryData();
  }
}, 5000);
