const state = {
  currentChapterIndex: Number(localStorage.getItem("currentChapterIndex")) || 0,
  musicEnabled: false
};

const chapterContainer = document.getElementById("chapterContainer");
const chapterCounter = document.getElementById("chapterCounter");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const resetButton = document.getElementById("resetButton");
const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");

function normalizeCode(value) {
  return value
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

function saveProgress() {
  localStorage.setItem("currentChapterIndex", state.currentChapterIndex);
}

function updateProgress() {
  const chapter = chapters[state.currentChapterIndex];
  const percent = Math.round(((chapter.number - 1) / (chapters.length - 1)) * 100);

  chapterCounter.textContent = `Capítulo ${chapter.number} de ${chapters.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function renderChapter() {
  const chapter = chapters[state.currentChapterIndex];

  updateProgress();

  chapterContainer.className = `chapter-card background-${chapter.background}`;
  chapterContainer.innerHTML = `
    <div class="parallax-layer"></div>

    <div class="chapter-content fade-in">
      <p class="chapter-subtitle">${chapter.subtitle}</p>
      <h2>${chapter.title}</h2>

      <p id="typewriterText" class="typewriter-text"></p>

      <div class="chapter-body">
        ${chapter.body.map(paragraph => `<p>${paragraph}</p>`).join("")}
      </div>

      ${
        chapter.final
          ? renderFinalBlock()
          : renderUnlockBlock(chapter)
      }
    </div>
  `;

  runTypewriter(chapter.typewriter);

  if (chapter.final) {
    prepareFinalAnimation();
  }
}

function renderUnlockBlock(chapter) {
  return `
    <div class="unlock-panel">
      <label for="codeInput">${chapter.codeQuestion}</label>

      <div class="code-row">
        <input
          id="codeInput"
          type="text"
          autocomplete="off"
          placeholder="Introduce el código"
        />
        <button id="unlockButton">Desbloquear</button>
      </div>

      <p id="feedbackMessage" class="feedback-message"></p>
    </div>
  `;
}

function renderFinalBlock() {
  return `
    <div class="final-panel">
      <button id="finalButton" class="primary-button">
        Continuar
      </button>

      <div id="proposalReveal" class="proposal-reveal hidden">
        <p>Solo me queda una pregunta.</p>
        <h3>¿Te quieres casar conmigo?</h3>
      </div>
    </div>
  `;
}

function runTypewriter(text) {
  const element = document.getElementById("typewriterText");
  let index = 0;

  element.textContent = "";

  const interval = setInterval(() => {
    element.textContent += text.charAt(index);
    index++;

    if (index >= text.length) {
      clearInterval(interval);
    }
  }, 28);
}

function bindEvents() {
  document.addEventListener("click", event => {
    if (event.target.id === "unlockButton") {
      unlockCurrentChapter();
    }

    if (event.target.id === "finalButton") {
      showProposal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Enter" && document.activeElement.id === "codeInput") {
      unlockCurrentChapter();
    }
  });

  resetButton.addEventListener("click", () => {
    const confirmed = confirm("¿Seguro que quieres reiniciar la experiencia?");
    if (!confirmed) return;

    localStorage.removeItem("currentChapterIndex");
    state.currentChapterIndex = 0;
    renderChapter();
  });

  musicToggle.addEventListener("click", toggleMusic);
}

function unlockCurrentChapter() {
  const chapter = chapters[state.currentChapterIndex];
  const input = document.getElementById("codeInput");
  const feedback = document.getElementById("feedbackMessage");

  const typedCode = normalizeCode(input.value);
  const expectedCode = normalizeCode(chapter.code);

  if (typedCode === expectedCode) {
    feedback.textContent = chapter.successMessage;
    feedback.className = "feedback-message success";

    setTimeout(() => {
      state.currentChapterIndex++;
      saveProgress();
      renderChapter();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  } else {
    feedback.textContent = "Todavía no. Mira bien la pista.";
    feedback.className = "feedback-message error";
  }
}

function prepareFinalAnimation() {
  const finalButton = document.getElementById("finalButton");
  if (!finalButton) return;

  finalButton.classList.add("pulse");
}

function showProposal() {
  const reveal = document.getElementById("proposalReveal");
  const button = document.getElementById("finalButton");

  button.classList.add("hidden");

  setTimeout(() => {
    reveal.classList.remove("hidden");
    reveal.classList.add("proposal-animation");
  }, 500);
}

function toggleMusic() {
  state.musicEnabled = !state.musicEnabled;

  if (state.musicEnabled) {
    backgroundMusic.volume = 0.25;
    backgroundMusic.play().catch(() => {
      state.musicEnabled = false;
    });
    musicToggle.classList.add("active");
  } else {
    backgroundMusic.pause();
    musicToggle.classList.remove("active");
  }
}

bindEvents();
renderChapter();
