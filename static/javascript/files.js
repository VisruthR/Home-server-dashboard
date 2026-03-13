export async function fetchFilesData() {
  try {
    const response = await fetch("/api/files/stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching files data:", error);
  }
}

function updateFilesStats(data){
    document.getElementById("storage-total").textContent  = data.storage_total;
    document.getElementById("storage-used").textContent  = data.storage_used;
    document.getElementById("storage-free").textContent  = data.storage_free;
}

function updateFIleMeter(data) {
  const totalUsableBytes = data.raw_used + data.raw_free;
  const rawPercentage = (data.raw_used / totalUsableBytes) * 100;
  const fileMeter = Math.round(rawPercentage * 100) / 100;
  const bar = document.getElementById("file-level");
  bar.style.height = fileMeter + "%";
  document.getElementById("file-percent-text").textContent =
    fileMeter + "%";
}

export function updateFilesPage(data) {
  if (!data) return;
  updateFilesStats(data)
  updateFIleMeter(data)
}
