// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval; // Will store our timer for countdown
const GAME_TIME = 30; // seconds

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Reset score and timer
  document.getElementById("score").textContent = "0";
  document.getElementById("time").textContent = GAME_TIME;

  // Start countdown timer
  let timeLeft = GAME_TIME;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  const drops = document.querySelectorAll(".water-drop");
  drops.forEach(drop => drop.remove());

  // Show win message and confetti if score > 20
  const score = parseInt(document.getElementById("score").textContent, 10) || 0;
  if (score > 20) {
    showWinMessage();
  }
}

function showWinMessage() {
  const winMsg = document.getElementById("win-message");
  winMsg.style.display = "flex";
  createConfetti();
  // Hide win message after 3 seconds
  setTimeout(() => {
    winMsg.style.display = "none";
    // Remove confetti pieces
    const confettiDiv = document.querySelector("#win-message .confetti");
    confettiDiv.innerHTML = "";
  }, 3000);
}

function createConfetti() {
  const confettiColors = ["#FFC907", "#2E9DF7", "#8BD1CB", "#4FCB53", "#FF902A", "#F5402C", "#159A48", "#F16061"];
  const confettiDiv = document.querySelector("#win-message .confetti");
  confettiDiv.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = Math.random() * 20 + "vh";
    piece.style.animationDelay = (Math.random() * 0.5) + "s";
    confettiDiv.appendChild(piece);
  }
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  // Decide if this is a bad drop (20% chance)
  const isBadDrop = Math.random() < 0.2;
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // Add points when drop is clicked
  drop.addEventListener("click", () => {
    const scoreElem = document.getElementById("score");
    let score = parseInt(scoreElem.textContent, 10) || 0;
    if (isBadDrop) {
      score = Math.max(0, score - 1);
    } else {
      score += 2;
    }
    scoreElem.textContent = score;
    drop.remove(); // Remove drop after it's clicked
  });
}

document.getElementById("reset-btn").addEventListener("click", resetGame);

function resetGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  document.getElementById("score").textContent = "0";
  document.getElementById("time").textContent = GAME_TIME;
  const drops = document.querySelectorAll(".water-drop");
  drops.forEach(drop => drop.remove());
  // Hide win message if visible
  document.getElementById("win-message").style.display = "none";
  const confettiDiv = document.querySelector("#win-message .confetti");
  if (confettiDiv) confettiDiv.innerHTML = "";
}
