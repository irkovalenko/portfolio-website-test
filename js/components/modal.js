const dialog = document.createElement("dialog");
dialog.className = "banner-modal";
dialog.innerHTML = `
  <iframe class="banner-modal-frame" hidden></iframe>
<div class="banner-modal-video-wrap" hidden>
    <video class="banner-modal-video" playsinline loop></video>
    <button
  class="banner-modal-mute"
  type="button"
  aria-label="Unmute video"
  aria-pressed="true"
  hidden
>
  <svg class="banner-modal-mute-icon banner-modal-mute-icon--muted" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm16.09 3 2.7-2.71-1.41-1.41L17.67 11.6l-2.71-2.72-1.41 1.42 2.71 2.7-2.71 2.72 1.41 1.41 2.71-2.71 2.71 2.71 1.41-1.41-2.7-2.72z" />
  </svg>
  <svg class="banner-modal-mute-icon banner-modal-mute-icon--unmuted" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
</button>
  </div>


  <img class="banner-modal-image" alt="" hidden>
`;
document.body.append(dialog);

const frame = dialog.querySelector(".banner-modal-frame");
const videoWrap = dialog.querySelector(".banner-modal-video-wrap");
const video = dialog.querySelector(".banner-modal-video");
const image = dialog.querySelector(".banner-modal-image");
const muteButton = dialog.querySelector(".banner-modal-mute");

muteButton.addEventListener("click", () => {
  video.muted = !video.muted;

  if (video.muted) {
    muteButton.setAttribute("aria-label", "Unmute video");
    muteButton.setAttribute("aria-pressed", "true");
  } else {
    muteButton.setAttribute("aria-label", "Mute video");
    muteButton.setAttribute("aria-pressed", "false");
  }
});

export function openMedia({
  type = "iframe",
  src,
  title: name = "",
  width,
  height,
  showreel = false,
}) {
  frame.hidden = videoWrap.hidden = image.hidden = true;
  muteButton.hidden = true;

  if (type === "image") {
    image.alt = name;
    image.src = src;
    image.hidden = false;
  } else if (type === "video") {
    video.title = name;
    video.src = src;
    videoWrap.hidden = false;

    if (showreel) {
      muteButton.hidden = false;
      video.muted = true;

      muteButton.setAttribute("aria-label", "Unmute video");
      muteButton.setAttribute("aria-pressed", "true");
    }

    video.play().catch(() => {});
  } else {
    frame.title = `${name} interactive banner`;
    frame.width = width;
    frame.height = height;
    frame.src = src;
    frame.hidden = false;
  }

  document.body.style.overflow = "hidden";
  dialog.showModal();
}

dialog.addEventListener("click", (e) => {
  if (e.target === dialog || e.target === image) dialog.close();
});

// runs for the X button, backdrop click AND the Escape key
dialog.addEventListener("close", () => {
  frame.src = "about:blank"; // stops the banner playing
  video.pause();
  video.muted = true;
  video.removeAttribute("src");
  muteButton.hidden = true;
  muteButton.setAttribute("aria-label", "Unmute video");
  muteButton.setAttribute("aria-pressed", "true");
  video.load(); // releases the file
  document.body.style.overflow = "";
});
