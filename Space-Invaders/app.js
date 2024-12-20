const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0
let level = 1;
let bossAppeared = false;

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))


const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }
}

// draw();

squares[currentShooterIndex].classList.add("shooter")

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

function moveShooter(e) {
    e.preventDefault();
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId)
    }

    if (aliensRemoved.length === alienInvaders.length) {
        level++;
        resultDisplay.innerHTML = `Level ${level} Complete!`;
        setTimeout(startNextLevel, 1000);
    }
}

function startNextLevel() {
    // Check if boss should appear
    if (level % 2 === 0 && !bossAppeared) { // Boss appears every 2 levels
        addBoss(); // Add a boss to the grid
    } else {
        alienInvaders = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39
        ];
    }

    aliensRemoved = [];
    results = level * 10; // Increase score based on level
    resultsDisplay.innerHTML = `Score: ${results} | Level: ${level}`;
    invadersId = setInterval(moveInvaders, 100);
}

invadersId = setInterval(moveInvaders, 100);

// Boss enemy (appears at the end of a level)
function addBoss() {
    bossAppeared = true;
    const bossIndex = 112; // Place boss in a fixed position (index 112)
    squares[bossIndex].classList.add('boss');
    squares[bossIndex].style.backgroundColor = 'red'; // Boss color

    // Define special boss behaviors
    let bossHealth = 5;
    function moveBoss() {
        // Example: Boss moves up and down on the screen
        let moveDirection = 1;
        let bossCurrentIndex = bossIndex;

        function move() {
            squares[bossCurrentIndex].classList.remove('boss');
            bossCurrentIndex += width * moveDirection; // Move boss vertically
            squares[bossCurrentIndex].classList.add('boss');

            // If boss hits the shooter, end game
            if (squares[bossCurrentIndex].classList.contains('shooter')) {
                resultsDisplay.innerHTML = 'GAME OVER - Boss won!';
                clearInterval(invadersId);
            }
        }

        setInterval(move, 500);
    }

    moveBoss();
}

// Shoot a laser
function shoot(e) {
    e.preventDefault(); // Prevent default behavior

    if (e.key === 'ArrowUp') {
        let laserId;
        let currentLaserIndex = currentShooterIndex;
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');

            // Check for laser hitting invader or boss
            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');
                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienRemoved);
                results += 10; // Increase score by 10 for each invader hit
                resultsDisplay.innerHTML = `Score: ${results} | Level: ${level}`;
                clearInterval(laserId);
            } else if (squares[currentLaserIndex].classList.contains('boss')) {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('boss');
                squares[currentLaserIndex].classList.add('boom');
                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);

                // Boss takes damage
                bossHealth--;
                if (bossHealth <= 0) {
                    alert('Boss defeated! Next level.');
                    bossAppeared = false;
                    setTimeout(startNextLevel, 1000); // Start the next level after defeating the boss
                }
                clearInterval(laserId);
            }
        }
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener('keydown', shoot);