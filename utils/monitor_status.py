import psutil


def monitor_system():
    cpu_usage = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory()
    return cpu_usage, ram


def get_temp():
    overall_cpu = None
    system_temp = None
    
    temps = psutil.sensors_temperatures()
    
    if not temps:
        return None, None


    # Common Linux CPU sensor names: 'coretemp' (Intel), 'k10temp' (AMD), 'cpu_thermal' (Raspberry Pi/ARM)
    cpu_sensor_names = ['coretemp', 'k10temp', 'cpu_thermal']
    for name in cpu_sensor_names:
        if name in temps:
            # The first entry in the CPU list is usually the 'Package' (overall CPU temp)
            overall_cpu = temps[name][0].current
            break

    # 'acpitz' is a common ACPI thermal zone representing ambient system temp
    if 'acpitz' in temps:
        system_temp = temps['acpitz'][0].current

    return system_temp, overall_cpu