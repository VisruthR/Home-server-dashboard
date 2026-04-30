import psutil
import time

def monitor_system():
    cpu_usage = psutil.cpu_percent(interval=None)
    ram = psutil.virtual_memory()
    return cpu_usage, ram

def format_speed(bytes_per_sec):
    if bytes_per_sec < 1024:
        return f"{bytes_per_sec:.2f} B/s"
    elif bytes_per_sec < (1024 * 1024):
        return f"{(bytes_per_sec / 1024):.2f} KB/s"
    else:
        return f"{(bytes_per_sec / (1024 * 1024)):.2f} MB/s"

def monitor_network():
    net_start = psutil.net_io_counters()
    time.sleep(1) 
    net_end = psutil.net_io_counters()

    raw_sent = net_end.bytes_sent - net_start.bytes_sent
    raw_recv = net_end.bytes_recv - net_start.bytes_recv

    up_speed = format_speed(raw_sent)
    down_speed = format_speed(raw_recv)

    return up_speed, down_speed