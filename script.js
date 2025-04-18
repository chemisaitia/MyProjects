"use strict";

const chooseSort = document.getElementById("sort");
const gameCards = document.querySelectorAll(".gameCard");
const container = document.getElementById("container");

const calcTimePassed = function (givenTime) {
  const now = new Date();
  const [givenDate, givenMonth, givenYear] = givenTime.split("/").map(Number);
  const givenFullDate = new Date(givenYear, givenMonth - 1, givenDate);
  const diffInMs = now - givenFullDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
};

const sortArr = function (selected) {
  const sortedCards = Array.from(gameCards).sort((a, b) => {
    const aDays = calcTimePassed(a.dataset.createdin);
    const bDays = calcTimePassed(b.dataset.createdin);
    const aRating = a.dataset.rating;
    const bRating = b.dataset.rating;

    if (selected === "new to old") {
      return aDays - bDays;
    } else if (selected === "old to new") {
      return bDays - aDays;
    } else if (selected === "From Best to Worst") {
      return bRating - aRating;
    } else if (selected === "From Worst to Best") {
      return aRating - bRating;
    }

    return 0;
  });

  // Remove existing cards
  container.innerHTML = "";

  // Re-append in sorted order
  sortedCards.forEach((card) => container.appendChild(card));
};
sortArr("new to old");

chooseSort.addEventListener("input", function (e) {
  const selected = e.target.value;
  sortArr(selected);
});
