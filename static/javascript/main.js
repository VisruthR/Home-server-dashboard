import * as battery from "./battery.js";

const btnHome = document.getElementById("home-btn");
const btnBattery = document.getElementById("battery-btn");
document.addEventListener("DOMContentLoaded", battery.updateBatteryIcon(btnBattery));
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

btnBattery.addEventListener("click", async () => {
  viewSelector(viewBattery);
  const batteryFetchData = await battery.fetchBatteryData(); //To get the data as soon as the  button is clicked
  battery.updateBatteryPage(batteryFetchData);
});

setInterval(async () => {
  if (viewBattery.style.display === "block") {
    const data = await battery.fetchBatteryData();
    battery.updateBatteryPage(data);
  }
}, 5000);
