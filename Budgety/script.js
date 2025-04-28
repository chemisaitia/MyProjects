// DATA MODULE, handles data manipulation.
let budgetController = (function () {
  // Constructors
  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }

    calcPercentage() {
      let totalIncome = data.totals.inc;
      this.percentage =
        totalIncome > 0 ? Math.round((this.value / totalIncome) * 100) : -1; // Calculate percentage
    }

    getPercentage() {
      return this.percentage; // Returns the percentage
    }
  }

  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Data
  let data = {
    items: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  // Calculate total income or expenses
  const calculateTotal = (type) => {
    data.totals[type] = data.items[type].reduce(
      (sum, current) => sum + current.value,
      0
    );
  };

  // Public methods
  return {
    // Add new item to data structure
    addItem: function (type, description, value) {
      let newItem, ID, lastItem, itemsType;

      // Cached the items type array to be used
      itemsType = data.items[type];

      // Create new ID
      ID = itemsType.length > 0 ? itemsType[itemsType.length - 1].id + 1 : 0;

      // Create new item based on 'inc' or 'exp' type
      newItem =
        type === "exp"
          ? new Expense(ID, description, value)
          : new Income(ID, description, value);

      // Push it into the data structure
      data.items[type].push(newItem);

      return newItem;
    },

    // Delete item from data structure
    deleteItem: function (type, id) {
      let ids, index;

      // Returns item id
      ids = data.items[type].map(function (current) {
        return current.id;
      });

      // Store index of the id
      index = ids.indexOf(id);

      // Delete the item based on index
      if (index !== -1) data.items[type].splice(index, 1);
    },

    // Perform all calculations
    calculateBudget: function () {
      // Calculate total income and expenses
      calculateTotal("inc");
      calculateTotal("exp");

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that was spent
      data.percentage =
        data.totals.inc > 0 && data.totals.exp > 0
          ? Math.round((data.totals.exp / data.totals.inc) * 100)
          : -1;
    },

    // Calculate percentage of expenses
    calculatePercentage: function () {
      data.items.exp.forEach(function (current) {
        current.calcPercentage();
      });
    },

    // Returns the percentages
    getPercentages: function () {
      let allPerc = data.items.exp.map(function (current) {
        return current.getPercentage();
      });

      return allPerc;
    },

    // Returns the budget, percentage, and total incomes and expenses
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    // Test if data has been updated
    testing: function () {
      console.log(data);
    },
  };
})();

// UI MODULE, handles UI.
let UIController = (function () {
  // DOM elements, this way it's only needed to be changed here
  let DOMe = {
    inputType: document.querySelector(".add__type"),
    inputDescription: document.querySelector(".add__description"),
    inputValue: document.querySelector(".add__value"),
    inputBtn: document.querySelector(".add__btn"),
    incomeList: document.querySelector(".income__list"),
    expensesList: document.querySelector(".expenses__list"),
    fields: document.querySelectorAll(".add__description, .add__value"),
    allFields: document.querySelectorAll(
      ".add__type, .add__description, .add__value"
    ),
    budgetLabel: document.querySelector(".budget__value"),
    incomeLabel: document.querySelector(".budget__income--value"),
    expensesLabel: document.querySelector(".budget__expenses--value"),
    percentageLabel: document.querySelector(".budget__expenses--percentage"),
    container: document.querySelector(".container"),
    dateLabel: document.querySelector(".budget__title--month"),
    itemPercentage: function () {
      return document.querySelectorAll(".item__percentage");
    },
  };

  // Format number
  let formatNumber = function (number, type) {
    let numSplit, integer, decimal;

    // Add commas to numbers recursively
    function addComma(integer) {
      if (integer.length <= 3) {
        return integer;
      } else {
        return (
          addComma(integer.substring(0, integer.length - 3)) +
          "," +
          integer.substr(integer.length - 3, integer.length)
        ); // input -> 23510, output -> 23,510
      }
    }

    // Returns the absolute number
    number = Math.abs(number);

    // Generate 2 decimal points
    number = number.toFixed(2);

    // Split the number between integer and decimal
    numSplit = number.split(".");

    integer = addComma(numSplit[0]);
    decimal = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + integer + "." + decimal;
  };

  // Loops through a node list
  let nodeListForEach = function (list, callback) {
    Array.from(list).forEach((item, index) => callback(item, index));
  };

  // Public methods
  return {
    // Get input data
    getInput: function () {
      return {
        type: DOMe.inputType.value, // Will be either inc or exp
        description: DOMe.inputDescription.value,
        value: parseFloat(DOMe.inputValue.value), // Converts string to number
      };
    },

    // Display the new item
    addListItem: function (obj, type) {
      let html, newHtml, element;

      // Create HTML string with placeholder text
      if (type === "inc") {
        // Sets where the html will be added
        element = DOMe.incomeList;

        html = `<div class="item clearfix" id="inc-${obj.id}">
                  <div class="item__description">
                    ${obj.description}
                  </div>
                  <div class="right clearfix">
                    <div class="item__value">
                      ${formatNumber(obj.value, type)}
                    </div>
                    <div class="item__delete">
                      <button class="item__delete--btn">
                        <i class="ion-ios-close-outline"></i>
                      </button>
                    </div>
                  </div>
                </div>`;
      } else if (type === "exp") {
        // Sets where the html will be added
        element = DOMe.expensesList;

        html = `<div class="item clearfix" id="exp-${obj.id}">
                  <div class="item__description">
                    ${obj.description}
                  </div>
                  <div class="right clearfix">
                    <div class="item__value">
                      ${formatNumber(obj.value, type)}
                    </div>
                    <div class="item__percentage">
                      21%</div>
                      <div class="item__delete">
                        <button class="item__delete--btn">
                          <i class="ion-ios-close-outline"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>`;
      }

      // Insert the HTML into the DOM
      element.insertAdjacentHTML("beforeend", html);
    },

    // Delete item
    deleteListItem: function (selectorId) {
      // Cached element
      let el = document.getElementById(selectorId);

      // Delete element

      // ეს არის ძველი მეთოდი
      // el.parentNode.removeChild(el);

      // ახალი ES6-ით
      el.remove();
    },

    // Clear the inputs
    clearFields: function () {
      let fields, fieldsArr;

      // Cached fields
      fields = DOMe.fields;
      fieldsArr = Array.from(fields);

      // Clear the inputs
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      // Set focus to the first input
      fieldsArr[0].focus();
    },

    // Display the budget, percentage, and total incomes and expenses
    displayBudget: function (obj) {
      let type;

      type = obj.budget > 0 ? "inc" : "exp"; // Defines the type

      DOMe.budgetLabel.textContent = formatNumber(obj.budget, type);
      DOMe.incomeLabel.textContent = formatNumber(obj.totalInc, "inc");
      DOMe.expensesLabel.textContent = formatNumber(obj.totalExp, "exp");
      DOMe.percentageLabel.textContent =
        obj.percentage > 0 ? obj.percentage + "%" : "0%";
    },

    // Display the expenses percentages
    displayPercentages: function (percentages) {
      nodeListForEach(DOMe.itemPercentage(), function (current, index) {
        current.textContent =
          percentages[index] > 0 ? percentages[index] + "%" : "0%";
      });
    },

    // Display current motnh and year
    displayDate: function (params) {
      let now, month, year, formatter;

      // Current date
      now = new Date();

      // Cache all english months
      formatter = new Intl.DateTimeFormat("en", { month: "long" });

      // Current month
      month = formatter.format(now);

      // Current year
      year = now.getFullYear();

      DOMe.dateLabel.textContent = month + " " + year;
    },

    // Change the color of the inputs based on the type
    changeType: function () {
      // Change inputs color
      nodeListForEach(DOMe.allFields, function (current) {
        current.classList.toggle("red-focus");
      });

      // Change button color
      DOMe.inputBtn.classList.toggle("red");
    },

    // Expose DOMe, so other controllers can use them
    getDOMe: function () {
      return DOMe;
    },
  };
})();

// CONTROLLER MODULE, controls the entire app and acts as a link between the other modules.
let appController = (function (dataCtrl, UICtrl) {
  // Event listeners
  let setupEventListeners = function () {
    // Get DOM elements object from UI controller
    let DOMe = UICtrl.getDOMe();

    // When add button is clicked
    DOMe.inputBtn.addEventListener("click", addItemCtrl);

    // When enter key is pressed
    document.addEventListener("keyup", function (event) {
      if (event.key === "Enter") addItemCtrl();
    });

    // When delete button is clicked
    DOMe.container.addEventListener("click", deleteItemCtrl);

    // Change the color of the inputs based on the type
    DOMe.inputType.addEventListener("change", UICtrl.changeType);
  };

  // Calculate and update the budget
  let updateBudget = function () {
    // 1. Calculate the budget
    dataCtrl.calculateBudget();

    // 2. Return the budget
    let budget = dataCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  // Calculate and update percentages
  let updatePercentages = function () {
    // 1. Calculate percentages
    dataCtrl.calculatePercentage();

    // 2. Read percentages from the budget controller
    let percentages = dataCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  // Add item
  let addItemCtrl = function () {
    let input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // 2. If it's true
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 1. Add the item to the budget controller
      newItem = dataCtrl.addItem(input.type, input.description, input.value);

      // 2. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 3. Clear the inputs
      UICtrl.clearFields();

      // 4. Calculate and update the budget
      updateBudget();

      // 5. Calculate and update percentages
      if (input.type === "exp") updatePercentages();
    }
  };

  // Delete item
  let deleteItemCtrl = function (event) {
    let itemID, splitID, type, ID, itemIDMatch;

    itemIDMatch = /exp-\d+|inc-\d+/; // Matches inc-xx or exp-xx

    // Cache the selected item id
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    // If it's a valid item with an id
    if (itemID) {
      // Cache both the type and id of the selected item, i.e. inc-1 or exp-0
      splitID = itemID.split("-"); // Split the selected item between type and id
      type = splitID[0]; // Cache the type
      ID = parseInt(splitID[1]); // Cache the id, converted to a number
      console.log(itemID, type, ID);

      // 1. Delete the item from the data structure
      dataCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      if (type === "inc") {
        updatePercentages();
      }
    }
  };

  // Public methods
  return {
    // Start app
    init: function () {
      console.log("App has started.");

      // Display date
      UICtrl.displayDate();

      // Display 0 in the budget on the UI
      UICtrl.displayBudget(dataCtrl.getBudget());

      // Setup Event listeners
      setupEventListeners();
    },
  };
})(budgetController, UIController);

// Start app
appController.init();
