//Fetching and processing the battery data from server and feeding it into main.js file

export async function fetchBatteryData() {
  try {
    const response = await fetch("/api/battery/stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching battery data:", error);
  }
}

export function updateBatteryLevel(data) {
  if (data.battery_percent < 100) {
    document.getElementById("batt-percent").textContent =
      Math.round(data.battery_percent * 100) / 100;
  } else {
    document.getElementById("batt-percent").textContent = data.battery_percent;
  }
}

export function updateBatteryStatus(data) {
  if (data.charging) {
    document.getElementById("batt-charging").textContent = "Plugged In ⚡";
  } else if (!data.charging && data.battery_percent === 100) {
    document.getElementById("batt-charging").textContent = "Fully Charged 🔌";
  } else {
    document.getElementById("batt-charging").textContent = "On Battery 🔋";
  }
}

export function updateBatteryTime(data) {
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
}

export function updateBattery(data) {
  document.getElementById("health-text").textContent =
    data.battery_health + "%";
  const battery = data.battery_percent;
  const battery_bottom = data.battery_health;
  const bar = document.getElementById("battery-level");
  const btmBar = document.getElementById("health-level");
  bar.style.height = battery + "%";
  btmBar.style.width = battery_bottom + "%";
}

export function updateBatteryPage(data) {
  if (!data) return;
  updateBatteryLevel(data);
  updateBatteryStatus(data);
  updateBatteryTime(data);
  updateBattery(data);
}

export async function updateBatteryIcon(btnBattery) {
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
