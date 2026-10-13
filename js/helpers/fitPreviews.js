function fit(box) {
  const frame = box.querySelector(".preview-frame");
  if (!frame) return;

  const w = Number(frame.getAttribute("width"));
  const h = Number(frame.getAttribute("height"));
  const scale = Math.min(box.clientWidth / w, box.clientHeight / h);

  const x = (box.clientWidth - w * scale) / 2;
  const y = (box.clientHeight - h * scale) / 2;
  frame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

const observer = new ResizeObserver((entries) => {
  entries.forEach(({ target }) => fit(target));
});

export function fitPreviews(root = document) {
  root.querySelectorAll(".preview-box").forEach((box) => observer.observe(box));
}
