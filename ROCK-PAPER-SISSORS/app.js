const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');
const winDisplay = document.getElementById('wins');
const lossDisplay = document.getElementById('losses');
const tieDisplay = document.getElementById('ties');
const restartBtn = document.getElementById('restart-btn');

// Sound effects
const winSound = new Audio('win.mp3');
const loseSound = new Audio('lose.mp3');
const tieSound = new Audio('tie.wav');

// Game variables
let userChoice;
let computerChoice;
let result;
let wins = 0;
let losses = 0;
let ties = 0;

// Buttons for user choice
const possibleChoices = document.querySelectorAll('button');

// Event listener for user choices
possibleChoices.forEach(choice =>
    choice.addEventListener('click', (e) => {
        userChoice = e.target.id;
        if (userChoice === 'restart-btn') return; // Skip restart button
        userChoiceDisplay.innerHTML = userChoice;
        generateComputerChoice();
        getResult();
        updateScore();
    })
);

// Generate computer's choice
function generateComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    computerChoice = choices[Math.floor(Math.random() * choices.length)];
    computerChoiceDisplay.innerHTML = computerChoice;
}

// Determine the result
function getResult() {
    if (userChoice === computerChoice) {
        result = "It's a tie!";
        tieSound.play();
        ties++;
    } else if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'scissors' && computerChoice === 'paper') ||
        (userChoice === 'paper' && computerChoice === 'rock')
    ) {
        result = "You win!";
        winSound.play();
        wins++;
    } else {
        result = "You lose!";
        loseSound.play();
        losses++;
    }
    resultDisplay.innerHTML = result;
}

// Update the score on the UI
function updateScore() {
    winDisplay.innerHTML = `Wins: ${wins}`;
    lossDisplay.innerHTML = `Losses: ${losses}`;
    tieDisplay.innerHTML = `Ties: ${ties}`;
}

// Restart the game
restartBtn.addEventListener('click', () => {
    wins = 0;
    losses = 0;
    ties = 0;
    userChoice = '';
    computerChoice = '';
    result = 'Start Playing!';
    
    // Reset UI
    userChoiceDisplay.innerHTML = 'None';
    computerChoiceDisplay.innerHTML = 'None';
    resultDisplay.innerHTML = result;
    winDisplay.innerHTML = `Wins: ${wins}`;
    lossDisplay.innerHTML = `Losses: ${losses}`;
    tieDisplay.innerHTML = `Ties: ${ties}`;
});
