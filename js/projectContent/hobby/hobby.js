import { createMediaStage } from "../../components/mediaStage.js";
import "../../components/videoModal.js";

const studiesUrl = new URL(
  "../../../js/projectContent/hobby/",
  import.meta.url,
);
const studyUrl = (file) => new URL(file, studiesUrl).href;

export function renderHobby(container) {
  container.innerHTML = `

    <section class="stage-section">

      <div class="stage-grid">
        ${createMediaStage({
          ratio: "landscape",
          video: studyUrl("blue-box.mp4"),
          wide: true,
        })}
        ${createMediaStage({
          ratio: "portrait",
          video: studyUrl("ichigo.mp4"),
        })}
         ${createMediaStage({
           ratio: "portrait",
           video: studyUrl("rukia.mp4"),
         })}
        
      </div>
    </section>
  `;
}
