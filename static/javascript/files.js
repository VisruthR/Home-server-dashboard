export async function fetchFilesData() {
  try {
    const response = await fetch("/api/files/stats");
    return await response.json();
  } catch (error) {
    console.error("Error fetching files data:", error);
  }
}

function updateFilesStats(data) {
  document.getElementById("storage-total").textContent = data.storage_total;
  document.getElementById("storage-used").textContent = data.storage_used;
  document.getElementById("storage-free").textContent = data.storage_free;
}

function updateFIleMeter(data) {
  const totalUsableBytes = data.raw_used + data.raw_free;
  const rawPercentage = (data.raw_used / totalUsableBytes) * 100;
  const fileMeter = Math.round(rawPercentage * 100) / 100;
  const bar = document.getElementById("file-level");
  bar.style.height = fileMeter + "%";
  document.getElementById("file-percent-text").textContent = fileMeter + "%";
}

export async function fetchDirectory(path = null) {
  const url = path
    ? `/api/files/explore?path=${encodeURIComponent(path)}`
    : "/api/files/explore";
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Explorer Error:", error);
  }
}

export function renderExplorer(data) {
  const container = document.querySelector(".bottom-file-area");
  container.innerHTML = `
    <h1 class="section-headding">Explorer: ${data.current_path}</h1>
    <div class="explorer-list">
      ${data.parent ? `<div class="explorer-item up" data-path="${data.parent}">[..] Go Back</div>` : ""}
      ${data.items
        .map(
          (item) => `
        <div class="explorer-item ${item.is_dir ? "dir" : "file"}" data-path="${item.path}">
          ${item.is_dir ? "📁" : "📄"} ${item.name}
        </div>
      `,
        )
        .join("")}
    </div>
  `;
  
  container
    .querySelectorAll(".explorer-item.dir, .explorer-item.up")
    .forEach((el) => {
      el.onclick = async () => {
        const newData = await fetchDirectory(el.dataset.path);
        renderExplorer(newData);
      };
    });
}

export function updateFilesPage(data) {
  if (!data) return;
  updateFilesStats(data);
  updateFIleMeter(data);
}
