from pathlib import Path
import shutil

def get_storage_info():
    return shutil.disk_usage("/") #total used free
    
def get_size(bytes = 0, suffix="B"):
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f} {unit}{suffix}"
        bytes /= factor
        

    