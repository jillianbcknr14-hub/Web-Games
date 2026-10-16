// 1. Core items & game state variables
const items = ['🍎', '🍌', '🍇', '🍓', '🥑', '🥦', '🥕', '🌽'];
let cardsArray = [...items, ...items]; // Create pairs
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

// DOM Elements
const gridContainer = document.getElementById('game-grid');
const movesDisplay = document.getElementById('moves-count');
const restartBtn = document.getElementById('restart-btn');

// 2. Shuffle cards array using Fisher-Yates Algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 3. Dynamically generate card elements in DOM
function generateGrid() {
  gridContainer.innerHTML = '';
  const shuffledCards = shuffle(cardsArray);

  shuffledCards.forEach(item => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.name = item; // Store identity for matching logic

    cardElement.innerHTML = `
      <div class="card-back">?</div>
      <div class="card-front">${item}</div>
    `;

    cardElement.addEventListener('click', flipCard);
    gridContainer.appendChild(cardElement);
  });
}

// 4. Handle card flip mechanics
function flipCard() {
  if (lockBoard) return; // Prevent clicking during comparison window
  if (this === firstCard) return; // Prevent double clicking the same card

  this.classList.add('flipped');

  if (!firstCard) {
    // First card selected
    firstCard = this;
    return;
  }

  // Second card selected
  secondCard = this;
  updateMoves();
  checkForMatch();
}

// 5. Comparison Logic
function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

// If they match, lock them open and clean selection state
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetSelection();
}

// If they don't match, flip them back after a delay
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetSelection();
  }, 1000); // 1-second delay so player can memorize
}

// Reset tracker variables
function resetSelection() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Track and update player moves
function updateMoves() {
  moves++;
  movesDisplay.textContent = moves;
}

// 6. Reset Game state completely
function restartGame() {
  moves = 0;
  movesDisplay.textContent = moves;
  resetSelection();
  generateGrid();
}

// Initialize game on load
restartBtn.addEventListener('click', restartGame);
generateGrid();
