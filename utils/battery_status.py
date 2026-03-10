import psutil
from pathlib import Path


def battery_health():
    power_path = Path("/sys/class/power_supply")

    battery_path = next(p for p in power_path.iterdir() if p.name.startswith("BAT"))

    with open(battery_path / "energy_full") as f:
        energy_full = int(f.read().strip())

    with open(battery_path / "energy_full_design") as f:
        energy_full_design = int(f.read().strip())

    return round(((energy_full / energy_full_design) * 100) * 100) / 100


def battery_charge():
    battery = psutil.sensors_battery()
    is_plugged_in = battery.power_plugged if battery else False
    try:
        power_path = Path("/sys/class/power_supply")
        battery_path = next(p for p in power_path.iterdir() if p.name.startswith("BAT"))

        with open(battery_path / "status") as f:
            status = f.read().strip()

        # If the status is anything other than Discharging, it has external power
        if status in ["Charging", "Full", "Not charging"]:
            is_plugged_in = True
    except Exception:
        pass

    return battery, is_plugged_in
