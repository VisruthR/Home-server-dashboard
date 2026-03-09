# Home Server Dashboard

A web application designed to study and explore the back-end processes of web development. It features a lightweight responsive front-end that communicates with a Python back-end to serve real-time system metrics.

> **Note:** This project is currently under active development. Some features may contain bugs, but they are being resolved as the project moves forward. It is currently optimized and working on Ubuntu LTS.

## 🚀 Current Features

- **Real-time Power Status:** Displays live battery percentage, current charging state, and estimated time remaining.
- **Battery Health Monitoring:** Calculates the actual battery health capacity by reading directly from Linux power supply system files (`/sys/class/power_supply`).
- **Dynamic UI:** A simple, glassmorphism-styled dashboard with intuitive navigation between 'Home' and 'Battery' views.
- **FastAPI Backend:** Utilizes FastAPI to serve the static front-end files and provide a JSON API endpoint (`/api/battery/stats`) for system data.

## 🛠️ Prerequisites

- **Operating System:** Linux (specifically tested on Ubuntu LTS) is required for the battery health feature to function correctly.
- **Python:** Python 3.x installed.

## 📦 Installation

1. **Clone the repository** (if using version control) or navigate to your project directory.
2. **Create a Virtual Environment** (Recommended):

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   Install the required Python packages using the provided requirements file:

```bash
pip install -r requirement.txt

```

## ⚙️ Running the Server

1. Ensure your virtual environment is activated.
2. Start the FastAPI server using `uvicorn` (which is included in your dependencies):

```bash
uvicorn main:app --reload

```

_The `--reload` flag enables auto-reloading, which is perfect for development._ 3. Open your web browser and navigate to:
`http://127.0.0.1:8000`
