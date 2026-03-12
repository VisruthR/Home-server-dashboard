let systemChart;
const MAX_POINTS = 50;

export function initialiseChart() {
  const contextOfGraph = document
    .getElementById("systemChart")
    .getContext("2d");

  systemChart = new Chart(contextOfGraph, {
    type: "line",
    data: {
      labels: Array(MAX_POINTS).fill(""), // Blank labels for the X-axis
      datasets: [
        {
          label: "CPU Usage (%)",
          borderColor: "cyan",
          data: Array(MAX_POINTS).fill(0),
          tension: 0.4, // Adds a curve to the line
          pointRadius: 0, // Hides the dots on each data point for a cleaner look
        },
        {
          label: "RAM Usage (%)",
          borderColor: "skyBlue",
          data: Array(MAX_POINTS).fill(0),
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        y: {
          min: 0,
          max: 100, // Lock Y-axis from 0 to 100%
        },
      },
    },
  });
}

export function updateChartData(cpu, ram) {
  if (!systemChart) return;

  // Push new data to the right side
  systemChart.data.datasets[0].data.push(cpu);
  systemChart.data.datasets[1].data.push(ram);

  // Remove oldest data from the left side
  systemChart.data.datasets[0].data.shift();
  systemChart.data.datasets[1].data.shift();

  systemChart.update();
}

export async function fetchMonitorData() {
  try {
    const response = await fetch("/api/monitor/stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching monitor data:", error);
  }
}

export function updateCpuPercent(data) {
  document.getElementById("cpu-usage").textContent = data.cpu_usage + "%";
}

export function updateRamPercent(data) {
  document.getElementById("ram-percent").textContent = data.ram_percent + "%";
}

export function updateRamUsage(data) {
  document.getElementById("ram-usage").textContent =
    `(${Math.round(data.ram_used * 100) / 100}Gb / ${Math.round(data.ram_total * 100) / 100}Gb)`;
}

export function updateTemperature(data) {
  document.getElementById("cpu-temp").textContent =
    data.cpu_temperature !== null ? 
    Math.round(data.cpu_temperature * 100) / 100 + " Celsius" : "N/A";

  document.getElementById("motherboard-temp").textContent =
    data.motherboard_temperature !== null ?
    Math.round(data.motherboard_temperature * 100) / 100 + " Celsius" : "N/A";
}

export function updateMonitorPage(data) {
  if (!data) return;
  updateCpuPercent(data);
  updateRamPercent(data);
  updateRamUsage(data);
  updateChartData(data.cpu_usage, data.ram_percent);
  updateTemperature(data);
}
