"use strict";

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const prevOperandTextElem = document.querySelector("[data-previous-operand]");
const currOperandTextElem = document.querySelector("[data-current-operand]");
const equalsButton = document.querySelector("[data-equals]");
const plusMinusButton = document.querySelector("[data-plus-minus]");

class Calculator {
  constructor(prevOperandTextElem, currOperandTextElem) {
    this.prevOperandTextElem = prevOperandTextElem;
    this.currOperandTextElem = currOperandTextElem;
    this.readyToReset = false; // Переменная для сброса результата
    this.clearDisplay();
  }

  clearDisplay() {
    this.prevOperand = "";
    this.currOperand = "";
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currOperand = this.currOperand.slice(0, -1);
  }

  addNumber(number) {
    if (number === "." && this.currOperand.includes(".")) return;
    this.currOperand = this.currOperand.toString() + number.toString();
  }

  sqrtNumber() {
    if (this.operation === "√") {
      this.readyToReset = true;
      if (this.prevOperand < 0) return (this.currOperand = "Error");
      // двойное приведение типов к Числу
      return (this.currOperand = +Number(Math.sqrt(this.prevOperand)).toFixed(
        6
      ));
    }
  }

  negateNumber() {
    if (this.currOperand > 0) return (this.currOperand = this.currOperand * -1);
    if (this.currOperand < 0) return (this.currOperand = this.currOperand * -1);
  }

  chooseOperation(operation) {
    if (this.currOperand === "") return;
    if (this.prevOperand !== "") {
      this.calculateResult();
    }
    this.operation = operation;
    this.prevOperand = this.currOperand;
    this.currOperand = "";
    this.sqrtNumber();
  }

  calculateResult() {
    let result = 0;
    const curr = parseFloat(this.currOperand);
    const prev = parseFloat(this.prevOperand);
    if (isNaN(prev) || isNaN(curr)) return;
    switch (this.operation) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "x":
        result = prev * curr;
        break;
      case "÷":
        result = prev / curr;
        break;
      case "xy":
        result = Math.pow(prev, curr);
        break;
      default:
        return;
    }
    result = +Number(result).toFixed(6);
    this.readyToReset = true;
    this.currOperand = result;
    this.prevOperand = "";
    this.operation = undefined;
  }

  updateDisplay() {
    this.currOperandTextElem.innerText = this.currOperand;

    if (this.operation === "√") {
      this.prevOperandTextElem.innerText = `${this.operation} (${this.prevOperand})`;
    } else if (this.operation === "xy") {
      this.prevOperandTextElem.innerText = `${this.prevOperand} ^`;
    } else if (this.operation) {
      this.prevOperandTextElem.innerText = `${this.prevOperand} ${this.operation}`;
    } else {
      this.prevOperandTextElem.innerText = "";
    }
  }
}

const calculator = new Calculator(prevOperandTextElem, currOperandTextElem);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      (calculator.prevOperand !== "" || calculator.prevOperand === "") &&
      calculator.currOperand !== "" &&
      calculator.readyToReset
    ) {
      calculator.operation = undefined;
      calculator.prevOperand = "";
      calculator.currOperand = "";
      calculator.readyToReset = false;
    }
    calculator.addNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

allClearButton.addEventListener("click", () => {
  calculator.clearDisplay();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

equalsButton.addEventListener("click", () => {
  calculator.calculateResult();
  calculator.updateDisplay();
});

plusMinusButton.addEventListener("click", () => {
  calculator.negateNumber();
  calculator.updateDisplay();
});
