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

// making the butons work
btnHome.addEventListener("click", () => {
  viewSelector(viewHome);
});

btnBattery.addEventListener("click", () => {
  viewSelector(viewBattery);
  fetchBatteryData(); //To get the data as soon as the  button is clicked
});

async function fetchBatteryData() {
  try {
    const response = await fetch("/api/battery/stats");
    const data = await response.json();

    // 1. Update Battery Percentage
    if (data.battery_percent < 100) {
      document.getElementById("batt-percent").textContent = 
      Math.round(data.battery_percent * 100) / 100;
    }else{
      document.getElementById("batt-percent").textContent = data.battery_percent;
    }

    document.getElementById("health-text").textContent = data.battery_health;


    updateBattery(data.battery_percent,data.battery_health);


    // If it says it's charging, OR if it's at exactly 100%
    if (data.charging) {
      document.getElementById("batt-charging").textContent = "Plugged In ⚡";
    } else if (!data.charging && data.battery_percent === 100) {
      document.getElementById("batt-charging").textContent = "Fully Charged 🔌";
    } else {
      document.getElementById("batt-charging").textContent = "On Battery 🔋";
    }

    if (data.charging || data.battery_percent === 100) {
      document.getElementById("batt-time").textContent =
        "Unlimited (Plugged In)";
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
  } catch (error) {
    console.error("Error fetching battery data:", error);
  }
}

function updateBattery(batterypercent,batteryHealth) {
  const battery = batterypercent;
  const battery_bottom = batteryHealth;
  const bar = document.getElementById("battery-level");
  const btmBar = document.getElementById("health-level");
  bar.style.width = battery + "%";
  btmBar.style.width = battery_bottom + "%";
}

setInterval(() => {
  if (viewBattery.style.display === "block") {
    fetchBatteryData();
  }
}, 5000);
