import * as battery from "./battery.js";

const btnHome = document.getElementById("home-btn");
const btnBattery = document.getElementById("battery-btn");
const viewHome = document.getElementById("view-home");
const viewBattery = document.getElementById("view-battery");

document.addEventListener("DOMContentLoaded", () =>
  battery.updateBatteryIcon(btnBattery),
);

const buttons = [btnHome, btnBattery];
const views = [viewHome, viewBattery];

let activeIntervals = []; 

function clearIntervels(){
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];
}

function switchPage(viewToshow, pressedBtn) {
  clearIntervels()
  
  for (const view of views) {
    view.style.display = "none";
  }
  viewToshow.style.display = "block";

  for (const bttn of buttons) {
    if (bttn !== pressedBtn) {
      bttn.classList.remove("active");
    }
  }
  pressedBtn.classList.add("active");
}

btnHome.addEventListener("click", () => {
  switchPage(viewHome, btnHome);
});

btnBattery.addEventListener("click", async () => {
  switchPage(viewBattery, btnBattery);

  const batteryFetchData = await battery.fetchBatteryData();
  battery.updateBatteryPage(batteryFetchData);

  const intervalId = setInterval(async () => {
    const data = await battery.fetchBatteryData();
    battery.updateBatteryPage(data);
  }, 5000);

  activeIntervals.push(intervalId);
});