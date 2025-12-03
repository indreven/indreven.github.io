document.addEventListener("DOMContentLoaded", function () {

    // ====== 1. Surandame formą ======
    const form = document.getElementById("contact-info");

    // ====== 2. Įdedame HTML iš JavaScript ======
    form.innerHTML = `
      <div class="row gy-4 form-container">

        <div class="col-md-6">
          <label>Vardas</label>
          <input type="text" id="firstName" class="form-control" required>
          <small class="error-text" id="error-firstName"></small>
        </div>

        <div class="col-md-6">
          <label>Pavardė</label>
          <input type="text" id="lastName" class="form-control" required>
          <small class="error-text" id="error-lastName"></small>
        </div>

        <div class="col-md-6">
          <label>El. paštas</label>
          <input type="email" id="email" class="form-control" required>
          <small class="error-text" id="error-email"></small>
        </div>

        <div class="col-md-6">
          <label>Telefono numeris</label>
          <input type="text" id="phone" class="form-control" placeholder="+370 6xx xxxxx">
          <small class="error-text" id="error-phone"></small>
        </div>

        <div class="col-md-12">
          <label>Adresas</label>
          <input type="text" id="address" class="form-control" required>
          <small class="error-text" id="error-address"></small>
        </div>

        <div class="col-md-4">
          <label>Kiek įvertintumėte mano CV (1–10)</label>
          <input type="number" id="q1" class="form-control" min="1" max="10">
          <small class="error-text" id="error-q1"></small>
        </div>

        <div class="col-md-4">
          <label>Kiek įvertintumėte mano puslapį (1–10)</label>
          <input type="number" id="q2" class="form-control" min="1" max="10">
          <small class="error-text" id="error-q2"></small>
        </div>

        <div class="col-md-4">
          <label>Kiek tikėtina, kad parekomenduotumėte mus? (1–10)</label>
          <input type="number" id="q3" class="form-control" min="1" max="10">
          <small class="error-text" id="error-q3"></small>
        </div>

        <div class="col-md-12 text-center">
          <button type="submit" id="submit-btn" disabled>Submit</button>
        </div>

      </div>
    `;

    // ====== 3. Formos laukai ======
    const fields = {
      firstName: document.getElementById("firstName"),
      lastName: document.getElementById("lastName"),
      email: document.getElementById("email"),
      phone: document.getElementById("phone"),
      address: document.getElementById("address"),
      q1: document.getElementById("q1"),
      q2: document.getElementById("q2"),
      q3: document.getElementById("q3"),
    };

    const output = document.getElementById("form-output");
    const avgOutput = document.getElementById("form-average");
    const popup = document.getElementById("submit-popup");
    const submitBtn = document.getElementById("submit-btn");

    const nameRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ======= 4. Validacijos funkcijos =======
    function error(field, message) {
      field.classList.add("input-error");
      document.getElementById("error-" + field.id).textContent = message;
    }

    function ok(field) {
      field.classList.remove("input-error");
      document.getElementById("error-" + field.id).textContent = "";
    }

    function checkName(field) {
  if (!field.value.trim()) return error(field, "Privaloma"), false;
  if (!nameRegex.test(field.value.trim())) return error(field, "Tik raidės"), false;
  return ok(field), true;
}

function checkEmail(field) {
  if (!field.value.trim()) return error(field, "Privaloma"), false;
  if (!emailRegex.test(field.value.trim())) return error(field, "Neteisingas formatas"), false;
  return ok(field), true;
}

function checkAddress(field) {
  if (!field.value.trim()) return error(field, "Privaloma"), false;
  return ok(field), true;
}


    function checkScore(field) {
      const n = Number(field.value);
      if (n < 1 || n > 10) return error(field, "1–10 ribos"), false;
      return ok(field), true;
    }

    function formatPhone(input) {
  // išsaugom kursorių
  let cursorPos = input.selectionStart;

  // paimame tik skaičius po +370
  let digits = input.value.replace(/\D/g, "").slice(0, 11); // apsaugai

  // pašaliname "370", jei vartotojas bando įvesti pilną kodą
  if (digits.startsWith("370")) {
    digits = digits.slice(3);
  }

  // leidžiame tik 8 skaitmenis (pvz. 61234567)
  digits = digits.slice(0, 8);

  // sukonstruojam galutinį formatą
  let formatted = "+370";

  if (digits.length > 0) {
    formatted += " " + digits.slice(0, 3);
  }
  if (digits.length > 3) {
    formatted += " " + digits.slice(3);
  }

  // pritaikom formatą
  input.value = formatted;

  // kursorių perkeliam į pabaigą, kad nerašytų į vidurį
  input.selectionStart = input.selectionEnd = input.value.length;
}

    function checkPhone(field) {
      const digits = field.value.replace(/\D/g, "").replace(/^370/, "");

  // turi būti tiksliai 8 skaitmenys
  if (digits.length !== 8) {
    return error(field, "Turi būti 8 skaitmenys po +370");
  }

  // pirmas skaitmuo turi būti 6
  if (digits[0] !== "6") {
    return error(field, "Numeris turi prasidėti skaitmeniu 6");
  }

  return ok(field), true;
    }

    // ===== 5. Submit mygtukas aktyvuojamas tik jei nėra klaidų =====
 function validateForm() {
  const v1 = checkName(fields.firstName);
  const v2 = checkName(fields.lastName);
  const v3 = checkEmail(fields.email);
  const v4 = checkPhone(fields.phone);
  const v5 = checkAddress(fields.address);
  const v6 = checkScore(fields.q1);
  const v7 = checkScore(fields.q2);
  const v8 = checkScore(fields.q3);

  const allValid = v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8;

  submitBtn.disabled = !allValid;
  return allValid;
}

    // ====== 6. Real-time validacija ======
    Object.values(fields).forEach(field => {
      field.addEventListener("input", () => {
        if (field === fields.phone) formatPhone(field);
        validateForm();
      });
    });

    // ====== 7. Submit įvykis ======
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // surenkam duomenis
  const firstName = fields.firstName.value;
  const lastName = fields.lastName.value;
  const email = fields.email.value;
  const phone = fields.phone.value;
  const address = fields.address.value;
  const q1 = Number(fields.q1.value);
  const q2 = Number(fields.q2.value);
  const q3 = Number(fields.q3.value);

  console.log("Pateikti duomenys:", {
      firstName,
      lastName,
      email,
      phone,
      address,
      q1,
      q2,
      q3,
      average: ((q1 + q2 + q3) / 3).toFixed(1)
  });

  // išvedam duomenis
  output.innerHTML = `
    <p><strong>Vardas:</strong> ${firstName}</p>
    <p><strong>Pavardė:</strong> ${lastName}</p>
    <p><strong>El. paštas:</strong> ${email}</p>
    <p><strong>Telefonas:</strong> ${phone}</p>
    <p><strong>Adresas:</strong> ${address}</p>
    <p><strong>Q1:</strong> ${q1}</p>
    <p><strong>Q2:</strong> ${q2}</p>
    <p><strong>Q3:</strong> ${q3}</p>
  `;

  // vidurkis
  const avg = ((q1 + q2 + q3) / 3).toFixed(1);
  avgOutput.textContent = `${firstName} ${lastName}: ${avg}`;

  // popup
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
});
});

// =============================
// MEMORY GAME LOGIKA 
// =============================

// ---- Elementai iš HTML ----
const board = document.getElementById("gameBoard");
const startBtn = document.getElementById("startGame");
const resetBtn = document.getElementById("resetGame");
const difficultySelect = document.getElementById("gameDifficulty");
const winMessage = document.getElementById("winMessage");

const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const bestScoreText = document.getElementById("bestScore");
const timerText = document.getElementById("timer");

// ---- Žaidimo simboliai ----
const icons = ["🧊", "🎅", "🎄", "🌨️", "⛄", "🥶", "❄️", "🎁","⭐","🍷"];

// ---- Žaidimo kintamieji ----
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

// ---- Timer ----
let timerInterval = null;
let time = 0;

// ---- LocalStorage ----
let bestScoreEasy = localStorage.getItem("memory_best_easy") || null;
let bestScoreHard = localStorage.getItem("memory_best_hard") || null;


// =============================
// TIMER FUNKCIJOS
// =============================
function startTimer() {
  time = 0;
  timerText.textContent = "0.0s";

  timerInterval = setInterval(() => {
    time += 0.1;
    timerText.textContent = time.toFixed(1) + "s";
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}


// =============================
// LENTOS GENERAVIMAS
// =============================
function generateBoard() {
  board.innerHTML = "";
  winMessage.textContent = "";

  // tinklo dydis
  const size = difficultySelect.value === "easy" 
    ? { rows: 3, cols: 4 } 
    : { rows: 5, cols: 4 };

  board.style.gridTemplateColumns = `repeat(${size.cols}, 80px)`;

  // kiek ikonų reikia?
  const needed = (size.rows * size.cols) / 2;
  const selected = icons.slice(0, needed);

  // poros
  const pairSet = [...selected, ...selected].sort(() => Math.random() - 0.5);

  // kuriame korteles
  pairSet.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  resetStats();
  updateBestScoreDisplay();
}


// =============================
// KORTELIŲ ATVERTIMAS
// =============================
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  this.innerHTML = this.dataset.icon;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}


// =============================
// PATIKRINTI PORĄ
// =============================
function checkMatch() {
  moves++;
  movesText.textContent = moves;

  if (firstCard.dataset.icon === secondCard.dataset.icon) {
    // sutapo
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matches++;
    matchesText.textContent = matches;

    resetTurn();
    checkWin();
  } else {
    // nesutapo
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      firstCard.innerHTML = "";
      secondCard.innerHTML = "";

      resetTurn();
    }, 900);
  }
}


// =============================
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// =============================
function resetStats() {
  moves = 0;
  matches = 0;
  movesText.textContent = "0";
  matchesText.textContent = "0";
}


// =============================
// GERIAUSIO REZULTATO ATVAIZDAVIMAS
// =============================
function updateBestScoreDisplay() {
  if (difficultySelect.value === "easy") {
    bestScoreText.textContent = bestScoreEasy ?? "–";
  } else {
    bestScoreText.textContent = bestScoreHard ?? "–";
  }
}


// =============================
// ŽAIDIMO PABAIGA
// =============================
function checkWin() {
  const totalPairs = document.querySelectorAll(".card").length / 2;

  if (matches === totalPairs) {
    winMessage.textContent = "🎉 Laimėjote!";
    stopTimer();

    const difficulty = difficultySelect.value;

    if (difficulty === "easy") {
      if (!bestScoreEasy || moves < bestScoreEasy) {
        bestScoreEasy = moves;
        localStorage.setItem("memory_best_easy", moves);
      }
    } else {
      if (!bestScoreHard || moves < bestScoreHard) {
        bestScoreHard = moves;
        localStorage.setItem("memory_best_hard", moves);
      }
    }

    updateBestScoreDisplay();
  }
}


// =============================
// MYGTUKAI
// =============================
startBtn.addEventListener("click", () => {
  generateBoard();
  stopTimer();
  startTimer();
});

resetBtn.addEventListener("click", () => {
  generateBoard();
  stopTimer();
  startTimer();
});
