const timeLeftDisplay = document.querySelector('#time-left')
const resultDisplay = document.querySelector('#result')
const startPauseButton = document.querySelector('#start-pause-button')
const squares = document.querySelectorAll('.grid div')
const logsLeft = document.querySelectorAll('.log-left')
const logsRight = document.querySelectorAll('.log-right')
const carsLeft = document.querySelectorAll('.car-left')
const carsRight = document.querySelectorAll('.car-right')

let currentIndex = 76
const width = 9
let timerId
let outcomeTimerId
let currentTime = 20

const logSpeeds = [500, 800, 1000];
const carSpeeds = [400, 700, 900];

const backgroundMusic = new Audio(`background-music.mp3`);
backgroundMusic.loop = true;
backgroundMusic.volume = 0.6;

function startBackgroundMusic() {
    backgroundMusic.play().catch((error) => {
        console.error('Error playing background music:', error);
    });
}

function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}
function moveFrog(e) {
    squares[currentIndex].classList.remove('frog')

    switch (e.key) {
        case 'ArrowLeft':
            if (currentIndex % width !== 0) currentIndex -= 1
            break
        case 'ArrowRight':
            if (currentIndex % width < width - 1) currentIndex += 1
            break
        case 'ArrowUp':
            if (currentIndex - width >= 0) currentIndex -= width
            break
        case 'ArrowDown':
            if (currentIndex + width < width * width) currentIndex += width
            break
    }
    squares[currentIndex].classList.add('frog')
}

function autoMoveElements() {
    currentTime--
    timeLeftDisplay.textContent = currentTime
    moveLogsAndCars(logsLeft, logSpeeds, moveLogLeft)
    moveLogsAndCars(logsRight, logSpeeds, moveLogRight)
    moveLogsAndCars(carsLeft, carSpeeds, moveCarLeft)
    moveLogsAndCars(carsRight, carSpeeds, moveCarRight)
}

let logIntervalIds = [];
let carIntervalIds = [];

function moveLogsAndCars(obstacles, speeds, moveFunction) {
    obstacles.forEach(obstacle => {
        let speed = speeds[Math.floor(Math.random() * speeds.length)]; 

        let intervalId = setInterval(() => moveFunction(obstacle), speed);       
        if (obstacle.classList.contains('log-left') || obstacle.classList.contains('log-right')) {
            logIntervalIds.push(intervalId); 
        } else {
            carIntervalIds.push(intervalId); 
        }
    });
}

function checkOutComes() {
    lose()
    win()
}

function moveLogLeft(logLeft) {
    switch (true) {
        case logLeft.classList.contains('l1'):
            logLeft.classList.remove('l1')
            logLeft.classList.add('l2')
            break
        case logLeft.classList.contains('l2'):
            logLeft.classList.remove('l2')
            logLeft.classList.add('l3')
            break
        case logLeft.classList.contains('l3'):
            logLeft.classList.remove('l3')
            logLeft.classList.add('l4')
            break
        case logLeft.classList.contains('l4'):
            logLeft.classList.remove('l4')
            logLeft.classList.add('l5')
            break
        case logLeft.classList.contains('l5'):
            logLeft.classList.remove('l5')
            logLeft.classList.add('l1')
            break
    }
}

function moveLogRight(logRight) {
    switch (true) {
        case logRight.classList.contains('l1'):
            logRight.classList.remove('l1')
            logRight.classList.add('l5')
            break
        case logRight.classList.contains('l2'):
            logRight.classList.remove('l2')
            logRight.classList.add('l1')
            break
        case logRight.classList.contains('l3'):
            logRight.classList.remove('l3')
            logRight.classList.add('l2')
            break
        case logRight.classList.contains('l4'):
            logRight.classList.remove('l4')
            logRight.classList.add('l3')
            break
        case logRight.classList.contains('l5'):
            logRight.classList.remove('l5')
            logRight.classList.add('l4')
            break
    }
}

function moveCarLeft(carLeft) {
    switch (true) {
        case carLeft.classList.contains('c1'):
            carLeft.classList.remove('c1')
            carLeft.classList.add('c2')
            break
        case carLeft.classList.contains('c2'):
            carLeft.classList.remove('c2')
            carLeft.classList.add('c3')
            break
        case carLeft.classList.contains('c3'):
            carLeft.classList.remove('c3')
            carLeft.classList.add('c1')
            break
    }
}

function moveCarRight(carRight) {
    switch (true) {
        case carRight.classList.contains('c1'):
            carRight.classList.remove('c1')
            carRight.classList.add('c3')
            break
        case carRight.classList.contains('c2'):
            carRight.classList.remove('c2')
            carRight.classList.add('c1')
            break
        case carRight.classList.contains('c3'):
            carRight.classList.remove('c3')
            carRight.classList.add('c2')
            break
    }
}

let score = 0; // Initialize score
let lives = 3; // Initialize lives

// Function to update score and lives
function updateScoreAndLives() {
    if (squares[currentIndex].classList.contains('car') || squares[currentIndex].classList.contains('log')) {
        lives--;
        if (lives <= 0) {
            resultDisplay.textContent = 'Game Over!';
            clearInterval(timerId);
            clearInterval(outcomeTimerId);
            document.removeEventListener('keyup', moveFrog);
        }
    }
    
    if (squares[currentIndex].classList.contains('ending-block')) {
        score++;
        resultDisplay.textContent = `Score: ${score} | Lives: ${lives}`;
    }
}

function lose() {
    if (
        squares[currentIndex].classList.contains('c1') ||
        squares[currentIndex].classList.contains('l4') ||
        squares[currentIndex].classList.contains('l5') ||
        currentTime <= 0
    ) {
        resultDisplay.textContent = 'You lose!'
        logIntervalIds.forEach(id => clearInterval(id)); 
        carIntervalIds.forEach(id => clearInterval(id)); 
        logIntervalIds = [];
        carIntervalIds = [];
        clearInterval(timerId)
        clearInterval(outcomeTimerId)
        squares[currentIndex].classList.remove('frog')
        document.removeEventListener('keyup', moveFrog)
        stopBackgroundMusic();
    }
}

function win() {
    if (squares[currentIndex].classList.contains('ending-block')) {
        score++;
        resultDisplay.textContent = `Score: ${score} | Lives: ${lives}`;
        goalSound.play();
        resultDisplay.textContent = 'You Win!';
        clearInterval(timerId)
        clearInterval(outcomeTimerId)
        document.removeEventListener('keyup', moveFrog)
    }
}

startPauseButton.addEventListener('click', () => {
    if (timerId) {
        logIntervalIds.forEach(id => clearInterval(id)); 
        carIntervalIds.forEach(id => clearInterval(id)); 
        logIntervalIds = []; 
        carIntervalIds = []; 
        clearInterval(timerId)
        clearInterval(outcomeTimerId)
        outcomeTimerId = null
        timerId = null
        document.removeEventListener('keyup', moveFrog)
        stopBackgroundMusic();
    } else {
        timerId = setInterval(autoMoveElements, 1000)
        outcomeTimerId = setInterval(checkOutComes, 50)
        document.addEventListener('keyup', moveFrog)
        startBackgroundMusic();
    }
})
const goalSound = new Audio('goal-sound.mp3')
const jumpSound = new Audio('jump-sound.mp3'); 
const collisionSound = new Audio('collision-sound.mp3'); 
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') { 
        jumpSound.play();
    }
});

function checkForCollisions() {
    if (squares[currentIndex].classList.contains('car') || squares[currentIndex].classList.contains('log')) {
        collisionSound.play();
    }
}