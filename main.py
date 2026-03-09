import psutil
import battery_health_finder

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI

# 1. Initialize the app
app = FastAPI()

# Tell FastAPI where CSS and JS files are
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def home():
    return FileResponse("static/index.html")


@app.get("/api/battery/stats")
def battery_stats():
    battery = psutil.sensors_battery()
    battery_health = battery_health_finder.battery_health()
    
    data = {
        "battery_percent": battery.percent if battery else None,
        "charging": battery.power_plugged if battery else None,
        "seconds_left": battery.secsleft if battery else None,
        "battery_health":battery_health if battery_health else None,
    }

    return data