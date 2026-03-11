from utils import battery_status
from utils import monitor_status
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
    battery, is_plugged_in = battery_status.battery_charge()
    battery_health = battery_status.battery_health()

    data = {
        "battery_percent": battery.percent if battery else None,
        "charging": is_plugged_in,
        "seconds_left": battery.secsleft if battery else None,
        "battery_health": battery_health if battery_health else None,
    }

    return data

@app.get("/api/monitor/stats")
def monitor_stats():
    cpu, ram = monitor_status.monitor_system()
    motherboard_temp, cpu_temp  = monitor_status.get_temp()
    
    data = {
        "cpu_usage" : cpu ,
        "ram_percent" : ram.percent,
        "ram_used" : (ram.used / (1024**3)),
        "ram_total" : (ram.total/ (1024**3)),
        "cpu_temperature" : cpu_temp if cpu_temp is not None else None,
        "motherboard_temperature" : motherboard_temp if motherboard_temp is not None else None,
    }
    return data
