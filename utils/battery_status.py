import psutil
import subprocess
import re
import platform

from pathlib import Path



def battery_health():
    system = platform.system()

    if system == "Linux":

        try:
            power_path = Path("/sys/class/power_supply")

            battery_path = next(p for p in power_path.iterdir() if p.name.startswith("BAT"))

            with open(battery_path / "energy_full" if Path(battery_path / "energy_full").exists() else battery_path / "charge_full") as f:
                energy_full = int(f.read().strip())

            with open(battery_path / "energy_full_design" if Path(battery_path / "energy_full_design").exists() else battery_path / "charge_full_design") as f:
                energy_full_design = int(f.read().strip())
                
            return round((energy_full / energy_full_design) * 100 , 2)
        except Exception:
            return None

    elif system == "Windows":
        try:
             output = Path("battery_report.html")
             subprocess.run(
                 ["powercfg", "/batteryreport", "/output", str(output)],
                 check=True,
                 stdout=subprocess.DEVNULL,
                 stderr=subprocess.DEVNULL
             )

             html = output.read_text(encoding="utf-8", errors="ignore")
             design = re.search(r"DESIGN CAPACITY.*?(\d+,?\d*) mWh", html)
             full = re.search(r"FULL CHARGE CAPACITY.*?(\d+,?\d*) mWh", html)

             if not design or not full:
                 return None
             
             design = int(design.group(1).replace(",", ""))
             full = int(full.group(1).replace(",", ""))

             return round((full / design) * 100, 2)

        except Exception:
            return None
        
    return None


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
