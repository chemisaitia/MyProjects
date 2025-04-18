"use strict";

let colors = ["Red", "Yellow", "Green", "Blue"];
let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let specials = ["Skip", "Reverse", "Draw2"];
let wilds = ["Draw4", "Wild"];
let allCards = [];
let tempN = 0;
let tempS = 0;
let tempW = 0;

for (let c = 0; c < colors.length; c++, tempN = 0, tempS = 0) {
  for (let n = 0; n < numbers.length; n++) {
    allCards.push({ color: colors[c], type: numbers[n] });
    if (n === numbers.length - 1 && !tempN) {
      n = 0;
      tempN++;
    }
  }
  for (let s = 0; s < specials.length; s++) {
    allCards.push({ color: colors[c], type: specials[s] });
    if (s === specials.length - 1 && !tempS) {
      s = -1;
      tempS++;
    }
  }
}

for (let w = 0; w < wilds.length; w++, tempW = 0) {
  for (let i = 0; i < 4; i++) {
    allCards.push({ color: "", type: wilds[w] });
  }
}

let allCardsStarter = structuredClone(allCards);
let message = document.getElementById("message");
let ball1 = document.getElementById("ball1");
let ball2 = document.getElementById("ball2");
let peer, conn;
let yourHand = [];
let opponentHandSize = 7;
let discardPile = [];
let isMyTurn = false;
let drawnCards = [];

// Get random card from deck
function getRandomCard() {
  if (allCards.length === 0) {
    message.innerText = "No cards left in the deck!";
    return null;
  }

  const randomIndex = Math.floor(Math.random() * allCards.length);
  const card = allCards[randomIndex];

  allCards.splice(randomIndex, 1);
  drawnCards.push(card);

  return card;
}

// Check if the card is playable based on the current discard pile
function isCardPlayable(card) {
  if (
    discardPile.length === 0 ||
    discardPile[discardPile.length - 1].type === "Draw4"
  ) {
    return true;
  } else {
    const topCard = discardPile[discardPile.length - 1];
    return (
      card.color === topCard.color ||
      card.type === topCard.type ||
      card.type === "Wild" ||
      card.type === "Draw4"
    );
  }
}

// Display the hand of cards
function displayHand() {
  const handContainer = document.getElementById("your-hand");
  handContainer.innerHTML = "";
  for (let i = 0; i < yourHand.length; i++) {
    let card = yourHand[i];
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    let img = document.createElement("img");
    if (card.type === "Wild" || card.type === "Draw4") {
      img.alt = `${card.type}`;
      img.src = `cards/${card.type}.png`;
    } else {
      img.alt = `${card.color}-${card.type}`;
      img.src = `cards/${card.color}-${card.type}.png`;
    }
    img.onclick = () => playCard(card);

    cardDiv.appendChild(img);
    handContainer.appendChild(cardDiv);
  }
}

// Play the selected card
function playCard(card) {
  if (isMyTurn) {
    if (!isCardPlayable(card)) {
      message.innerHTML = "This card is not playable.";
      return;
    }

    // Handle Wild card color selection
    if (card.type === "Wild") {
      const wildMenu = document.getElementById("wildMenu");
      wildMenu.style.visibility = "visible";
      isMyTurn = false;
      processCardPlay(card);
    } else if (card.type === "Draw2") {
      isMyTurn = false;
      processCardPlay(card);
    } else if (
      card.type === "Skip" ||
      card.type === "Reverse" ||
      card.type === "Draw4"
    ) {
      isMyTurn = true;
      processCardPlay(card);

      for (let i = 0; i < yourHand.length; i++) {
        if (!isCardPlayable(yourHand[i])) {
          [...document.querySelectorAll(".card")]
            .slice(0, -4)
            [i + 1].classList.add("disabled");
        }
      }
    } else {
      isMyTurn = false;
      for (let i = 0; i < yourHand.length; i++) {
        if (!isCardPlayable(yourHand[i])) {
          [...document.querySelectorAll(".card")]
            .slice(0, -4)
            [i + 1].classList.remove("disabled");
        }
      }
      processCardPlay(card);
    }
  }
}

function newGame() {
  window.location = "#";
}

function InitRematch() {
  allCards = structuredClone(allCardsStarter);
  yourHand = [];
  opponentHandSize = 7;
  discardPile = [];
  isMyTurn = true;
  drawnCards = [];

  document.getElementById("your-hand").innerHTML = `
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>`;

  document.getElementById("top-card").style.backgroundImage = `none`;
  document.getElementById(
    "top-card"
  ).style.background = `linear-gradient(145deg, #ffffff, #d1d1d1)`;

  ball1.style.backgroundColor = "grey";
  ball2.style.backgroundColor = "grey";
  drawCard(true, 7);
}

function rematch() {
  if (getComputedStyle(ball2).backgroundColor === "green") {
    ball1.style.backgroundColor = "red";
  } else {
    ball1.style.backgroundColor = "green";
    message.innerText = "I want to play again";
  }
  if (conn && conn.open) {
    conn.send({
      type: "rematch",
    });
  }

  if (
    getComputedStyle(ball1).backgroundColor === "rgb(0, 128, 0)" &&
    getComputedStyle(ball2).backgroundColor === "rgb(0, 128, 0)"
  ) {
    if (conn && conn.open) {
      conn.send({
        type: "startRematch",
      });

      InitRematch();
    }
  }
}

function setColor(color) {
  // Update the color of the last card in the discard pile
  discardPile[discardPile.length - 1].color = color;

  // Send the selected color to the opponent
  if (conn && conn.open) {
    conn.send({
      type: "wildColor",
      color: color,
    });
  }

  // Check if the card is playable after the color selection
  if (!isCardPlayable(discardPile[discardPile.length - 1])) {
    message.innerText = "Wild card is not playable after color selection!";
    return; // Prevent playing the card if it's not valid
  }

  // Update the top card display
  updateTopCard();

  // Hide the wild menu and proceed with the card play
  wildMenu.style.visibility = "hidden";
}

function processCardPlay(card) {
  // Remove the card from hand and add to discard pile
  yourHand = yourHand.filter((c) => c !== card);
  discardPile.push(card);

  displayHand();
  updateTopCard();

  // Send the move to the opponent
  if (conn && conn.open) {
    conn.send({ type: "move", card });
  }

  updateOpponentMoveDisplay(`You played: ${card.color} ${card.type}`);
  checkForWin();
}

// Update the top card display
function updateTopCard() {
  const top = discardPile[discardPile.length - 1];
  const el = document.getElementById("top-card");
  if (top.type === "Wild" || top.type === "Draw4") {
    el.style.backgroundImage = `url('cards/${top.type}.png')`;
  } else {
    el.style.backgroundImage = `url('cards/${top.color}-${top.type}.png')`;
  }
  el.style.backgroundSize = "cover";
}

// Update opponent's move display
function updateOpponentMoveDisplay(text) {
  document.getElementById("opponent-move").textContent = text;
}

// Draw a card
function drawCard(sentFromDrawCardorNewGame, amount) {
  if (sentFromDrawCardorNewGame) {
    for (let i = 0; i < amount; i++) {
      const card = getRandomCard();
      yourHand.push(card);
    }
    displayHand();
  } else {
    if (!isMyTurn) return;
    const card = getRandomCard();
    yourHand.push(card);
    displayHand();

    if (!isCardPlayable(card) && conn && conn.open) {
      conn.send({ type: "draw" });
      updateOpponentMoveDisplay("You drew a card.");
      isMyTurn = false;
    }
  }
}

// Check for win condition
function checkForWin() {
  if (yourHand.length === 0) {
    alert("🎉 You won!");
    if (conn && conn.open) conn.send({ type: "win" });
  }
}

// ==== INIT ====
// Create the peer connection
const customId = generateShortId(4);
peer = new Peer(customId); // Pass it in here!

function generateShortId(length = 4) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

peer.on("open", (id) => {
  document.getElementById("peer-id").textContent = id;
});

peer.on("connection", (incoming) => {
  conn = incoming;
  setupConnectionEvents();
  isMyTurn = false;
});

// Connect to the opponent via their ID
function connect() {
  const otherId = document.getElementById("connect-id").value;
  conn = peer.connect(otherId);
  isMyTurn = false;
  setupConnectionEvents();
}

// Set up the connection events (handling moves, draws, etc.)
function setupConnectionEvents() {
  conn.on("open", () => {
    message.innerText = "Connected to opponent!";
    conn.send({ type: "handshake", handSize: yourHand.length });
    isMyTurn = true;

    // Start the game by dealing 7 cards and putting one on the discard pile
    for (let i = 0; i < 7; i++) {
      yourHand.push(getRandomCard());
    }

    displayHand();
  });

  conn.on("data", (data) => {
    if (data.type === "move") {
      isMyTurn = true;

      discardPile.push(data.card);
      updateTopCard();
      opponentHandSize--;
      updateOpponentMoveDisplay(
        `Opponent played: ${data.card.color} ${data.card.type}`
      );

      if (data.card.type === "Draw4") {
        drawCard(true, 4);
        isMyTurn = false;
      } else if (data.card.type === "Draw2") {
        drawCard(true, 4);
        isMyTurn = true;
      } else if (data.card.type === "Skip" || data.card.type === "Reverse") {
        isMyTurn = false;
      }

      if (isMyTurn && data.card.type !== "Wild") {
        for (let i = 0; i < yourHand.length; i++) {
          if (!isCardPlayable(yourHand[i])) {
            [...document.querySelectorAll(".card")]
              .slice(0, -4)
              [i + 1].classList.add("disabled");
          }
        }
      }
    } else if (data.type === "handshake") {
      opponentHandSize = data.handSize;
      isMyTurn = true;
    } else if (data.type === "draw") {
      opponentHandSize++;
      updateOpponentMoveDisplay("Opponent drew a card.");
      isMyTurn = true;
      for (let i = 0; i < yourHand.length; i++) {
        if (!isCardPlayable(yourHand[i])) {
          [...document.querySelectorAll(".card")][i + 1].classList.add(
            "disabled"
          );
        }
      }
    } else if (data.type === "wildColor") {
      // Opponent has selected a color for the Wild card
      discardPile[discardPile.length - 1].color = data.color;
      updateTopCard();

      // Check if the Wild card is playable after the color is selected
      if (!isCardPlayable(discardPile[discardPile.length - 1])) {
        message.innerText = "Wild card is not playable after color selection!";
        isMyTurn = true; // Allow the opponent to choose another action
        return;
      }
      isMyTurn = true;

      for (let i = 0; i < yourHand.length; i++) {
        if (!isCardPlayable(yourHand[i])) {
          [...document.querySelectorAll(".card")]
            .slice(0, -4)
            [i + 1].classList.add("disabled");
        }
      }
    } else if (data.type === "win") {
      message.innerText = "you lost";
    } else if (data.type === "rematch") {
      let ball2 = document.getElementById("ball2");
      if (getComputedStyle(ball2).backgroundColor === "green") {
        ball2.style.backgroundColor = "red";
      } else {
        ball2.style.backgroundColor = "green";
        message.innerText = "opponent wants to play again";
      }
    } else if (data.type === "startRematch") {
      InitRematch();
    }
  });
}
