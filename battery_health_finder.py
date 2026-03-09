from pathlib import Path
def battery_health():
    power_path = Path("/sys/class/power_supply")

    battery_path = next(p for p in power_path.iterdir() if p.name.startswith("BAT"))


    with open(battery_path / "energy_full") as f:
        energy_full = int(f.read().strip())

    with open(battery_path / "energy_full_design") as f:
        energy_full_design = int(f.read().strip())

    return round(((energy_full / energy_full_design) * 100)*100)/100

