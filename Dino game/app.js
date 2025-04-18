let dino = document.getElementById('dino');
let isJumping = false;

// Record highest score
let record = parseInt(localStorage.getItem("record")) || 0;

if (dino.src == 'dinosneak-Recovered.png') {
    isJumping = false;
    dino.style.animation = '';
}

// jumping event listener
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isJumping) {
        isJumping = true;
        dino.style.animation = '';
        void dino.offsetWidth;
        dino.style.animation = 'jump 0.6s linear';
        
        setTimeout(function() {
            isJumping = false;
        }, 600);
    }

    // this is event listener that will change dinosaur's photo to sneaking when arrowdown key is pressed
    if (event.code === 'ArrowDown') {
        isJumping = true;
        dino.style.animation = '';
        void dino.offsetWidth;
        dino.src = 'dinosneak-Recovered.png';
        dino.style.position = 'absolute'
        dino.style.width = '25vw'
        dino.style.left = '1vw'
        dino.style.top = '71vh';
        dino.style.width = '18vw';
        
        setTimeout(function() {
            isJumping = false;
        }, 600);
    }

    // this changes dino back to normal when you stop pressing arrowdown key
    if (event.code === 'ArrowDown') {
        isJumping = false;
        dino.style.animation = '';
        void dino.offsetWidth;
        dino.src = 'Dino.png';
        dino.style.position = 'absolute'
        dino.style.width = '25vw'
        dino.style.left = '2vw'
        dino.style.top = '65vh';
        dino.style.width = '12vw';
        
        setTimeout(function() {
            isJumping = false;
        }, 600);
    }
});

// this creates cactus
function createSmallCactus() {
    let cactus = document.createElement('img');
    cactus.src = 'flowerscactus.png';
    cactus.className = 'cactus';
    document.body.appendChild(cactus);
}

// this checks if dinosaur has colided with cactus
function checkCollision() {
    let cactuses = document.querySelectorAll('.cactus'); 
    let dinoRect = dino.getBoundingClientRect();

    cactuses.forEach(cactus => {
        let cactusRect = cactus.getBoundingClientRect();
        if (
            dinoRect.left < cactusRect.right &&
            dinoRect.right > cactusRect.left &&
            dinoRect.bottom > cactusRect.top &&
            dinoRect.top < cactusRect.bottom
        ) {
            gameOver();
        }
    });
}

// this is timer that will count how long player lasted without dying
let timeCounter = 0;
function time(){
    timeCounter++;
    document.getElementById('time-counter').innerHTML = 'score: ' + timeCounter;
}

function updateRecord() {
    if (timeCounter > record) {
        record = timeCounter;
        localStorage.setItem("record", record);
    }
    document.getElementById('record').innerHTML = 'Highest: ' + record;
}

// this is a gameover function that will change background to black and display text game over 
function gameOver() {
    clearInterval(cactusInterval); 
    clearInterval(timer);
    clearInterval(checkCollision);
    document.getElementById('mainbody').innerHTML = '<h1 id="endtext">GAME OVER!</h1> <h2 id="score">Your Score:' + timeCounter + '</h2><audio src="Gameover.mp3" id="gameover" controls></audio><button id="restartbtn" onclick="restart()">restart</button>';
    document.getElementById('mainbody').style.backgroundColor = 'black';
    document.getElementById('gameover').play();
}

// restart function
function restart(){
    location.reload()
}

// these are intervals
let cactusInterval = setInterval(createSmallCactus, 5000); 
let checkCollisionInteval = setInterval(checkCollision, 100);
let timer = setInterval(time, 100);
let recordUpdate = setInterval(updateRecord, 100)