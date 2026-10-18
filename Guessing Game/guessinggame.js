
let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const resetButton = document.getElementById("resetButton");

guessButton.addEventListener("click", function() {

    let guess = Number(guessInput.value);

    if (guessInput.value === "" || guess < 1 || guess > 100) {
        message.innerText = "Enter a number between 1 and 100!";
        return;
    }

    attempts++;

    if (guess === randomNumber) {
        message.innerText = "Correct! You guessed the number!";
        guessButton.disabled = true;
    } else if (guess > randomNumber) {
        message.innerText = "Too high! Try again.";
    } else {
        message.innerText = "Too low! Try again.";
    }

    attemptsDisplay.innerText = "Attempts: " + attempts;
    guessInput.value = "";
});

resetButton.addEventListener("click", function() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;

    message.innerText = "";
    attemptsDisplay.innerText = "";
    guessInput.value = "";
    guessButton.disabled = false;
});
