import os

from pathlib import Path
from fastapi import HTTPException
from utils import battery_status, monitor_status , files_status
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

@app.get("/api/files/stats")
def file_stats():
    total, used, free = files_status.get_storage_info()
    
    data = {
        "storage_total" : files_status.get_size( total ) if total else None,
        "storage_used" : files_status.get_size(used) if used else None, 
        "storage_free" : files_status.get_size(free) if free else None,
        "raw_used" : used if used else None,
        "raw_free" : free if free else None,
    }
    
    return data

@app.get("/api/files/explore")
def explore_files(path: str = None):
    SAFE_ROOT = Path.home() 
    
    try:
        requested_path = SAFE_ROOT if path is None else Path(path).resolve()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid path format")

    if not requested_path.is_relative_to(SAFE_ROOT):
        raise HTTPException(status_code=403, detail="Access denied: Cannot leave safe root directory")
   
    if not requested_path.exists() or not requested_path.is_dir():
        raise HTTPException(status_code=404, detail="Directory not found")

    try:
        items = []
        for item in requested_path.iterdir():
            if not item.name.startswith("."):
                items.append({
                    "name": item.name,
                    "is_dir": item.is_dir(),
                    "path": str(item.absolute())
                })
        
        return {
            "current_path": str(requested_path),
            "parent": str(requested_path.parent) if requested_path != SAFE_ROOT else None,
            "items": sorted(items, key=lambda x: (not x["is_dir"], x["name"].lower()))
        }
    except PermissionError:
        raise HTTPException(status_code=403, detail="Permission denied")
