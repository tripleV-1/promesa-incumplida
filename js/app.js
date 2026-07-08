const STORAGE_KEY = "dosAnysTriantNos.currentChapterIndex";
const LEGACY_STORAGE_KEYS = [
  "promesaIncomplerta.currentChapterIndex",
  "promesaIncumplida.currentChapterIndex",
  "currentChapterIndex"
];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  currentChapterIndex: getInitialChapterIndex(),
  musicEnabled: false,
  typewriterTimer: null
};

const chapterContainer = document.getElementById("chapterContainer");
const chapterCounter = document.getElementById("chapterCounter");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const resetButton = document.getElementById("resetButton");
const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");

function getInitialChapterIndex() {
  const savedValue = localStorage.getItem(STORAGE_KEY) ?? LEGACY_STORAGE_KEYS
    .map(key => localStorage.getItem(key))
    .find(value => value !== null);
  const parsedValue = Number(savedValue);

  if (!Number.isInteger(parsedValue)) {
    return 0;
  }

  return clampChapterIndex(parsedValue);
}

function clampChapterIndex(index) {
  return Math.min(Math.max(index, 0), chapters.length - 1);
}

function normalizeCode(value) {
  return value
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "");
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, state.currentChapterIndex);
  LEGACY_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
}

function updateProgress() {
  const chapter = chapters[state.currentChapterIndex];
  const percent = Math.round(((chapter.number - 1) / (chapters.length - 1)) * 100);

  chapterCounter.textContent = `Capítol ${chapter.number} de ${chapters.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function renderChapter() {
  const chapter = chapters[state.currentChapterIndex];

  clearTypewriter();
  updateProgress();
  saveProgress();

  chapterContainer.className = `chapter-card background-${chapter.background}`;
  chapterContainer.classList.toggle("has-photo", Boolean(chapter.image));
  chapterContainer.style.removeProperty("--chapter-photo");

  if (chapter.image) {
    chapterContainer.style.setProperty("--chapter-photo", `url("${chapter.image}")`);
  }

  chapterContainer.innerHTML = `
    <div class="media-layer" aria-hidden="true"></div>

    <div class="chapter-content fade-in">
      <div class="chapter-topline">
        <span>Capítol ${chapter.number}</span>
        <span>${chapter.kicker}</span>
      </div>

      <p class="chapter-subtitle">${chapter.subtitle}</p>
      <h2>${chapter.title}</h2>

      <p id="typewriterText" class="typewriter-text"></p>

      <div class="chapter-body">
        ${chapter.body.map(paragraph => `<p>${paragraph}</p>`).join("")}
      </div>

      ${renderMemoryBlock(chapter)}
      ${chapter.final ? renderFinalBlock() : renderUnlockBlock(chapter)}
    </div>
  `;

  updateUrlHash(chapter.id);
  runTypewriter(chapter.typewriter);

  if (chapter.final) {
    prepareFinalAnimation();
  }

  chapterContainer.focus({ preventScroll: true });
}

function renderMemoryBlock(chapter) {
  if (!chapter.memory) {
    return "";
  }

  return `
    <aside class="memory-strip">
      <span>${chapter.memoryLabel}</span>
      <p>${chapter.memory}</p>
    </aside>
  `;
}

function renderUnlockBlock(chapter) {
  return `
    <section class="unlock-panel" aria-label="Desbloqueig del capítol">
      <p class="challenge-eyebrow">${chapter.challengeTitle}</p>
      <label for="codeInput">${chapter.codeQuestion}</label>

      <div class="code-row">
        <input
          id="codeInput"
          type="text"
          autocomplete="off"
          inputmode="text"
          spellcheck="false"
          placeholder="Codi"
        />
        <button id="unlockButton" type="button">Desbloquejar</button>
      </div>

      <button id="hintButton" class="hint-button" type="button" aria-expanded="false" aria-controls="hintText">
        Veure pista
      </button>
      <p id="hintText" class="hint-text" hidden>${chapter.clue}</p>

      <p id="feedbackMessage" class="feedback-message" role="status"></p>
    </section>
  `;
}

function renderFinalBlock() {
  return `
    <section class="final-panel" aria-label="Final de l'experiència">
      <button id="finalButton" class="primary-button" type="button">
        Obrir el record d'aniversari
      </button>

      <div id="celebrationReveal" class="celebration-reveal" hidden>
        <p>Avui la pista era senzilla.</p>
        <h3>Feliços dos anys, amor.</h3>
        <p class="celebration-note">El que més celebro és haver-te trobat i seguir triant-te cada dia. Ens queda el Share per davant.</p>
      </div>
    </section>
  `;
}

function runTypewriter(text) {
  const element = document.getElementById("typewriterText");

  if (!element) {
    return;
  }

  if (prefersReducedMotion) {
    element.textContent = text;
    return;
  }

  let index = 0;
  element.textContent = "";

  state.typewriterTimer = setInterval(() => {
    element.textContent += text.charAt(index);
    index += 1;

    if (index >= text.length) {
      clearTypewriter();
    }
  }, 24);
}

function clearTypewriter() {
  if (state.typewriterTimer) {
    clearInterval(state.typewriterTimer);
    state.typewriterTimer = null;
  }
}

function bindEvents() {
  document.addEventListener("click", event => {
    if (event.target.id === "unlockButton") {
      unlockCurrentChapter();
    }

    if (event.target.id === "hintButton") {
      toggleHint(event.target);
    }

    if (event.target.id === "finalButton") {
      showCelebration();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Enter" && document.activeElement.id === "codeInput") {
      unlockCurrentChapter();
    }
  });

  resetButton.addEventListener("click", () => {
    const confirmed = confirm("Segur que vols reiniciar l'experiència?");
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    LEGACY_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
    state.currentChapterIndex = 0;
    renderChapter();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  musicToggle.addEventListener("click", toggleMusic);
}

function toggleHint(button) {
  const hint = document.getElementById("hintText");
  const expanded = button.getAttribute("aria-expanded") === "true";

  button.setAttribute("aria-expanded", String(!expanded));
  button.textContent = expanded ? "Veure pista" : "Amagar pista";
  hint.hidden = expanded;
}

function unlockCurrentChapter() {
  const chapter = chapters[state.currentChapterIndex];
  const input = document.getElementById("codeInput");
  const feedback = document.getElementById("feedbackMessage");

  if (!input || !feedback) {
    return;
  }

  const typedCode = normalizeCode(input.value);
  const expectedCode = normalizeCode(chapter.code);

  if (typedCode === expectedCode) {
    feedback.textContent = chapter.successMessage;
    feedback.className = "feedback-message success";
    input.setAttribute("aria-invalid", "false");

    setTimeout(() => {
      state.currentChapterIndex = clampChapterIndex(state.currentChapterIndex + 1);
      renderChapter();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }, prefersReducedMotion ? 300 : 950);
  } else {
    feedback.textContent = "Encara no. Mira bé la pista.";
    feedback.className = "feedback-message error";
    input.setAttribute("aria-invalid", "true");
    input.select();
  }
}

function prepareFinalAnimation() {
  const finalButton = document.getElementById("finalButton");
  if (!finalButton) return;

  finalButton.classList.add("pulse");
}

function showCelebration() {
  const reveal = document.getElementById("celebrationReveal");
  const button = document.getElementById("finalButton");

  button.classList.add("is-fading");

  setTimeout(() => {
    button.hidden = true;
    reveal.hidden = false;
    reveal.classList.add("celebration-animation");
  }, prefersReducedMotion ? 0 : 420);
}

function setupMusic() {
  const musicSrc = experienceAssets.musicSrc;

  if (!musicSrc) {
    musicToggle.hidden = true;
    return;
  }

  backgroundMusic.src = musicSrc;
  musicToggle.hidden = false;
}

function toggleMusic() {
  state.musicEnabled = !state.musicEnabled;

  if (state.musicEnabled) {
    backgroundMusic.volume = 0.28;
    backgroundMusic.play().catch(() => {
      state.musicEnabled = false;
      musicToggle.classList.remove("active");
    });
    musicToggle.classList.add("active");
    musicToggle.setAttribute("aria-label", "Pausar música");
  } else {
    backgroundMusic.pause();
    musicToggle.classList.remove("active");
    musicToggle.setAttribute("aria-label", "Activar música");
  }
}

function updateUrlHash(id) {
  if (!id) {
    return;
  }

  const nextHash = `#${id}`;
  if (window.location.hash !== nextHash) {
    history.replaceState(null, "", nextHash);
  }
}

setupMusic();
bindEvents();
renderChapter();
