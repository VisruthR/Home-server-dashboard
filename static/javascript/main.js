import * as battery from "./battery.js";
import * as monitor from "./monitor.js";
import * as files from "./files.js";

const btnHome = document.getElementById("home-btn");
const btnBattery = document.getElementById("battery-btn");
const btnMonitor = document.getElementById("monitor-btn");
const btnFiles = document.getElementById("files-btn");

const viewHome = document.getElementById("view-home");
const viewBattery = document.getElementById("view-battery");
const viewMonitor = document.getElementById("view-monitor");
const viewFiles = document.getElementById("view-files");

document.addEventListener("DOMContentLoaded", () => {
  battery.updateBatteryIcon(btnBattery);
  monitor.initialiseChart();
});

const buttons = [btnHome, btnBattery, btnMonitor, btnFiles];
const views = [viewHome, viewBattery, viewMonitor, viewFiles];

let activeIntervals = [];

function clearIntervals() {
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];
}

function switchPage(viewToshow, pressedBtn) {
  clearIntervals();

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

btnMonitor.addEventListener("click", async () => {
  switchPage(viewMonitor, btnMonitor);

  const monitorFetchData = await monitor.fetchMonitorData();
  monitor.updateMonitorPage(monitorFetchData);

  const intervalId = setInterval(async () => {
    const data = await monitor.fetchMonitorData();
    monitor.updateMonitorPage(data);
  }, 1000);

  activeIntervals.push(intervalId);
});

btnFiles.addEventListener("click" , async () => {
  switchPage(viewFiles, btnFiles);

  const filesFetchData = await files.fetchFilesData();
  files.updateFilesPage(filesFetchData);

  const intervalId = setInterval(async () => {
    const  data = await files.fetchFilesData();
    files.updateFilesPage(data);
  }, 7000);

  activeIntervals.push(intervalId);

})
