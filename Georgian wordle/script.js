'use strict'

// keys that change when user presses shift
const kw = document.getElementById('kw');
const kr = document.getElementById('kr');
const kt = document.getElementById('kt');
const ks = document.getElementById('ks');
const kj = document.getElementById('kj');
const kz = document.getElementById('kz');
const kc = document.getElementById('kc');
const keysPressed = {};

// cells in which user types in
const d11 = document.getElementById('d11');
const d12 = document.getElementById('d12');
const d13 = document.getElementById('d13');
const d14 = document.getElementById('d14');
const d15 = document.getElementById('d15');

const d21 = document.getElementById('d21');
const d22 = document.getElementById('d22');
const d23 = document.getElementById('d23');
const d24 = document.getElementById('d24');
const d25 = document.getElementById('d25');

const d31 = document.getElementById('d31');
const d32 = document.getElementById('d32');
const d33 = document.getElementById('d33');
const d34 = document.getElementById('d34');
const d35 = document.getElementById('d35');

const d41 = document.getElementById('d41');
const d42 = document.getElementById('d42');
const d43 = document.getElementById('d43');
const d44 = document.getElementById('d44');
const d45 = document.getElementById('d45');

const d51 = document.getElementById('d51');
const d52 = document.getElementById('d52');
const d53 = document.getElementById('d53');
const d54 = document.getElementById('d54');
const d55 = document.getElementById('d55');

const d61 = document.getElementById('d61');
const d62 = document.getElementById('d62');
const d63 = document.getElementById('d63');
const d64 = document.getElementById('d64');
const d65 = document.getElementById('d65');

// variables to create a graph
const oy = document.getElementById('oy');
const ox = document.getElementById('ox');

const l1 = document.getElementById('firstLine');
const l2 = document.getElementById('secondLine');
const l3 = document.getElementById('thirdLine');
const l4 = document.getElementById('fourthLine');
const l5 = document.getElementById('fifthLine');
const l6 = document.getElementById('sixthLine');

const t1 = document.getElementById('firstText');
const t2 = document.getElementById('secondText');
const t3 = document.getElementById('thirdText');
const t4 = document.getElementById('fourthText');
const t5 = document.getElementById('fifthText');
const t6 = document.getElementById('sixthText');

// modal window
let span = document.getElementsByClassName("close")[0];
let modal = document.getElementById('myModal');

// Tracks which user is on now
let currentRow = 1; 

// element that appears when user tries to input other language letters or invalid input
let notInGeoEl = document.getElementById('notInGeo');

if(localStorage.getItem("winsIn1") === undefined){
    localStorage.setItem("winsIn1", 0)
}
if(localStorage.getItem("winsIn2") === undefined){
    localStorage.setItem("winsIn2", 0)
}
if(localStorage.getItem("winsIn3") === undefined){
    localStorage.setItem("winsIn3", 0)
}
if(localStorage.getItem("winsIn4") === undefined){
    localStorage.setItem("winsIn4", 0)
}
if(localStorage.getItem("winsIn5") === undefined){
    localStorage.setItem("winsIn5", 0)
}
if(localStorage.getItem("winsIn6") === undefined){
    localStorage.setItem("winsIn6", 0)
}

function resetScore(){
    localStorage.setItem("winsIn1", 0);
    localStorage.setItem("winsIn2", 0);
    localStorage.setItem("winsIn3", 0);
    localStorage.setItem("winsIn4", 0);
    localStorage.setItem("winsIn5", 0);
    localStorage.setItem("winsIn6", 0);
    generateXYGraph();
}

function lineAndTextGenerator(winsinx, l, t){
    l.style.height = localStorage.getItem(winsinx) * 5 + "px";
    l.style.top = `calc(464px - ${localStorage.getItem(winsinx) * 5}px)`;
    t.style.top = 470 + "px";
}

function newGame(){
    document.querySelectorAll(`td`).forEach(td => {
        changeCell(td, "white", "2px solid grey", "black")
        td.textContent = "";
        currentRow = 1;
    });
    randomNum = Math.random(); 
    index = Math.floor(randomNum * georgianWords.length);
    chosenWord = georgianWords[index];
    document.getElementById("ansv").innerHTML = chosenWord;
    document.getElementById("ansv").style.visibility = "hidden";
    document.getElementById("hint").style.visibility = "hidden";
    modal.style.display = "none";
}

// creates a graph
function generateXYGraph() {
    lineAndTextGenerator("winsIn1", l1, t1);
    lineAndTextGenerator("winsIn2", l2, t2);
    lineAndTextGenerator("winsIn3", l3, t3);
    lineAndTextGenerator("winsIn4", l4, t4);
    lineAndTextGenerator("winsIn5", l5, t5);
    lineAndTextGenerator("winsIn6", l6, t6);
}

// opens the popup when you win
function OpenPopup() {
    modal.style.display = "block";
}

// when user clicks on X modal window will disappear and new game will start
span.onclick = function() {
    modal.style.display = "none";
    newGame()
}

// when user clicks outside the modal window it will disappear and new game will start
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        newGame()
    }
}

function updateLocalStorage(a){
    let curscore = Number(localStorage.getItem(a));
    curscore += 1
    localStorage.setItem(a, curscore) 
}

// Show hint
function showHint(){
    let arra = [...chosenWord];
    document.getElementById("hint").innerHTML = arra[0] + arra[1] + "***";
}

// Function to check if the current row is full
function isCurrentRowFull() {
    switch (currentRow) {
        case 1: return d15.textContent !== "";
        case 2: return d25.textContent !== "";
        case 3: return d35.textContent !== "";
        case 4: return d45.textContent !== "";
        case 5: return d55.textContent !== "";
        case 6: return d65.textContent !== "";
        default: return true;
    }
}

function changeCell(cell, backgroundColor, border, color){
    cell.style.backgroundColor = backgroundColor;
    cell.style.border = border;
    cell.style.color = color;
}

// when user presses shift letters will change 
function changeKeyOnShift(a,b,c,d,e,f,g){
    kw.textContent = a;
    kr.textContent = b;
    kt.textContent = c;
    ks.textContent = d;
    kj.textContent = e;
    kz.textContent = f;
    kc.textContent = g;
}

// slots in an array 
let slots = [d11, d12, d13, d14, d15, 
            d21, d22, d23, d24, d25, 
            d31, d32, d33, d34, d35, 
            d41, d42, d43, d44, d45, 
            d51, d52, d53, d54, d55, 
            d61, d62, d63, d64, d65];

document.addEventListener('keypress', (event) => {
    let key = event.key;     

    keysPressed[event.code] = true;
    const keyElement = document.querySelector(`[data-key="${event.code}"]`);
    const isTypeAble = key === "ქ" || key === "წ" || key === "ჭ" || key === "ე" || key === "რ" || key === "ღ" || key === "ტ" || key === "თ" || key === "ყ" || key === "უ" || key === "ი" || key === "ო" || key === "პ" || key === "ა" || key === "ს" || key === "შ" || key === "დ" || key === "ფ" || key === "გ" || key === "ჰ" || key === "ჯ" || key === "ჟ" || key === "კ" || key === "ლ" || key === "ზ" || key === "ძ" || key === "ხ" || key === "ც" || key === "ჩ" || key === "ვ" || key === "ბ" || key === "ნ" || key === "მ" ? true : false;
    
    if (keyElement) {
        keyElement.classList.add('pressed');
    }

    for (let slot of slots) {
        if (slot.textContent === "" && isTypeAble && !(isCurrentRowFull())) {
            slot.textContent = key; 
            break;
        } 
        if (slot.textContent === ""  && !isTypeAble && !(isCurrentRowFull()) && key !== "Enter") {
            notInGeoEl.style.visibility = "visible";
            setTimeout(() => {
                notInGeoEl.style.visibility = "hidden";
            }, 2000);
        }
    }   
});

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && isCurrentRowFull()) {
        let submitText = ""; 
        
        for (let i = (currentRow - 1) * 5; i <= (currentRow - 1) * 5 + 4; i++) {
            submitText += slots[i].textContent;
        }

        if(submitText == chosenWord){
            document.getElementById("ansv").innerHTML = chosenWord;
            document.getElementById("ansv").style.visibility = "visible";
            OpenPopup();
            document.querySelectorAll(`table tr:nth-child(${currentRow}) td`).forEach(td => {
                changeCell(td, "rgb(63, 117, 58)", "2px solid rgb(63, 117, 58)", "white")
            });
            document.getElementById("scoreRow").innerHTML = `შენ მოიგე ${currentRow} ცდაში.`
            if(currentRow == 1){
                updateLocalStorage("winsIn1")
            } else if(currentRow == 2){
                updateLocalStorage("winsIn2")
            } else if(currentRow == 3){
                updateLocalStorage("winsIn3")
            } else if(currentRow == 4){
                updateLocalStorage("winsIn4")
            } else if(currentRow == 5){
                updateLocalStorage("winsIn5")
            } else{
                updateLocalStorage("winsIn6")
            }           
            generateXYGraph();
        } else {
            const UserArr = []; 

            for (let i = (currentRow - 1) * 5; i < (currentRow - 1) * 5 + 5; i++) {
                UserArr.push(slots[i].textContent);
            }

            let AnswerArr = [...chosenWord]

            if(currentRow <= 6){
                currentRow++;                
            }

            if(currentRow > 3){
                document.getElementById("hint").style.visibility = "visible";
            }
            
            // user lost
            if(currentRow > 6 && georgianWords.indexOf(submitText) !== -1){
                document.getElementById("ansv").innerHTML = chosenWord;
                document.getElementById("ansv").style.visibility = "visible";
                OpenPopup();
                generateXYGraph()
                document.getElementById("scoreRow").innerHTML = `წააგე!`
            }

            if (georgianWords.indexOf(submitText) === -1) {
                const notInList = document.getElementById('notInWordsList');
                if (notInList) { 
                    notInList.style.visibility = "visible";
                }
                setTimeout(() => {
                    notInList.style.visibility = "hidden";
                }, 2000);
                currentRow--;
            } else {
                for (let i = 0; i < 6; i++) {
                    let row = document.querySelector(`table tr:nth-child(${currentRow - 1})`);
                    if (UserArr[i] === AnswerArr[i] || AnswerArr.includes(UserArr[i])) {
                        let cell = row.querySelector(`td:nth-child(${i + 1})`);        
                        if (UserArr[i] === AnswerArr[i]) {
                            changeCell(cell, "rgb(63, 117, 58)", "2px solid rgb(63, 117, 58)", "white");
                        } else {
                            changeCell(cell, "rgb(201, 180, 88)", "2px solid rgb(201, 180, 88)", "white")
                        }
                    } else if (AnswerArr.includes(UserArr[i])) {
                        changeCell(cell, "rgb(201, 180, 88)", "2px solid rgb(201, 180, 88)", "white");
                    } else if (!AnswerArr.includes(UserArr[i])) {
                        let cell = row.querySelector(`td:nth-child(${i + 1})`);
                        changeCell(cell, "#787c7e", "2px solid #787c7e", "white");
                    }
                }
            }                  
        }
    } else if (event.key === "Backspace") {
        let backs = document.querySelector(`[data-key="${event.key}"]`);
        backs.classList.add('pressed');
 
        // deletes letters when user presses backspace
        for (let i = slots.length - 1; i >= (currentRow - 1) * 5; i--) {
            if (slots[i].textContent !== "") {
                slots[i].textContent = "";
                break;
            }
        }
    }

    // Change text when ShiftLeft is pressed
    if (event.key === "Shift") {
        changeKeyOnShift("ჭ", "ღ", "თ", "შ", "ჟ", "ძ", "ჩ");
    }
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.code];
    const keyElement = document.querySelector(`[data-key="${event.code}"]`);
    
    if (keyElement) {
        keyElement.classList.remove('pressed');
    }

    // Reset text when ShiftLeft is released
    if (event.code === 'ShiftLeft') {
        changeKeyOnShift("წ", "რ", "ტ", "ს", "ჯ", "ზ", "ც");
    }
});

const georgianWords = [
    "თვალი", "სახლი", "წყალი", "ხმალი", "მტერი", "მხარი", "ბზარი", "ბრაზი", "ნდობა", "ტალღა",
    "ტორტი", "ზვავი", "წვერი", "ტყუპი", "სუსტი", "დარდი", "დროშა", "მყარი", "ფრენა", "სავსე",
    "ფიფქი", "ბურთი", "თევზი", "ცურვა", "კოვზი", "სუფრა", "სარკე", "კიტრი", "სკამი", "ლობიო",
    "დაცლა", "ჭრელი", "ბუჩქი", "მატლი", "თეთრი", "დრონი", "სვეტი", "წვეთი", "ბლოკი", "ტახტი",
    "ვარდი", "კარგი", "ბევრი", "რეკვა", "მწარე", "დაფნა", "სრული", "დაჭრა", "ფიქრი", "კვერი",
    "ჭრილი", "კალთა", "გამგე", "რგოლი", "ღვინო", "ხურდა", "ტყავი", "ლურჯი", "სწორი", "ბოჭკა", 
    "სიცხე", "ნარდი", "შვიდი", "ჭურვი", "საიტი", "მწირი", "ბუნტი", "ფარდა", "საათი", "ბანქო",  
    "ცარცი", "კრავი", "კასრი", "კადრი", "არაყი", "ბრიზი", "ზებრა", "კოალა", "პანდა", "მატლი",
    "თოვლი", "წვიმა", "ძაღლი"
];

let randomNum = Math.random(); 
let index = Math.floor(randomNum * georgianWords.length);
let chosenWord = georgianWords[index];