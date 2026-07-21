/* ==========================================================================
   CONFIG — pas dit bestand aan met jullie eigen gegevens.
   Dit is het enige bestand waar je "instellingen" aanpast; de rest van de
   pagina's lezen deze waarden uit.
   ========================================================================== */

const SITE_CONFIG = {
  // Wachtwoord voor de site. LET OP: dit is geen echte beveiliging (iedereen
  // die de broncode bekijkt kan het wachtwoord zien) — het is puur bedoeld
  // om te voorkomen dat vreemden of zoekmachines toevallig binnenlopen.
  password: "onzedag2027",

  // Trouwdatum, gebruikt voor de countdown op de homepage.
  // Formaat: "JJJJ-MM-DDTUU:MM:00"
  weddingDateISO: "2027-06-25T12:00:00",

  names: "Puk & Jonathan",
};

/* --------------------------------------------------------------------------
   Hieronder geen instellingen meer, maar de logica. Die hoef je niet aan te
   passen, tenzij je weet wat je doet.
   -------------------------------------------------------------------------- */

const GATE_SESSION_KEY = "bw_unlocked";
const GUEST_TYPE_KEY = "bw_guest_type"; // "dag" | "avond"

function isUnlocked() {
  return sessionStorage.getItem(GATE_SESSION_KEY) === "true";
}

function unlock() {
  sessionStorage.setItem(GATE_SESSION_KEY, "true");
}

function getGuestType() {
  return sessionStorage.getItem(GUEST_TYPE_KEY) || null;
}

function setGuestType(type) {
  sessionStorage.setItem(GUEST_TYPE_KEY, type);
}

// Beveiligt een pagina: stuurt door naar index.html als er nog geen
// wachtwoord is ingevoerd deze sessie.
function requireUnlock() {
  if (!isUnlocked()) {
    window.location.href = "index.html";
  }
}

// Past de zichtbaarheid van [data-guest="dag"] / [data-guest="avond"] /
// [data-guest="allebei"] elementen aan op basis van het gekozen gastentype.
function applyGuestVisibility() {
  const type = getGuestType();
  document.querySelectorAll("[data-guest]").forEach((el) => {
    const target = el.getAttribute("data-guest");
    const visible = target === "allebei" || target === type || !type;
    el.classList.toggle("is-visible", visible);
  });
}

// Eenvoudige countdown, verwacht een element met id="countdown".
function startCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const target = new Date(SITE_CONFIG.weddingDateISO).getTime();

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.textContent = "Vandaag is de dag!";
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    el.textContent = `nog ${days}d ${hours}u ${mins}m`;
  }

  tick();
  setInterval(tick, 60 * 1000);
}