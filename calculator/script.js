"use strict";

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const prevOperandTextElem = document.querySelector("[data-previous-operand]");
const currOperandTextElem = document.querySelector("[data-current-operand]");
const equalsButton = document.querySelector("[data-equals]");

class Calculator {
  constructor(prevOperandTextElem, currOperandTextElem) {
    this.prevOperandTextElem = prevOperandTextElem;
    this.currOperandTextElem = currOperandTextElem;
    this.clearDisplay();
  }

  clearDisplay() {
    this.prevOperand = "";
    this.currOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currOperand = this.currOperand.slice(0, -1); //toString()
  }

  addNumber(number) {
    if (number === "." && this.currOperand.includes(".")) return;
    this.currOperand = this.currOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currOperand === "") return;
    if (this.prevOperand !== "") {
      this.calculateResult();
    }
    this.operation = operation;
    this.prevOperand = this.currOperand;
    this.currOperand = "";

    if (operation === "x2") {
      return (this.currOperand = Math.pow(this.prevOperand, 2));
    } else if (operation === "√") {
      return (this.currOperand = Math.abs(Math.sqrt(this.prevOperand)));
    }
  }

  calculateResult() {
    let result = 0;
    const curr = parseFloat(this.currOperand);
    const prev = parseFloat(this.prevOperand);
    if (isNaN(prev) || isNaN(curr)) return;
    switch (this.operation) {
      case "+":
        result = (prev + curr).toFixed(1);
        break;
      case "-":
        result = prev - curr;
        break;
      case "x":
        result = (prev * curr).toFixed(1);
        break;
      case "÷":
        result = prev / curr;
        break;
      default:
        return;
    }
    this.currOperand = result;
    this.prevOperand = "";
    this.operation = undefined;
  }

  updateDisplay() {
    this.currOperandTextElem.innerText = this.currOperand;
    if (this.operation === "√") {
      this.prevOperandTextElem.innerText = `${this.operation} (${this.prevOperand})`;
    } else if (this.operation === "x2") {
      this.prevOperandTextElem.innerText = `sqrt(${this.prevOperand})`;
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
    calculator.addNumber(button.innerText);
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

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.calculateResult();
  calculator.updateDisplay();
});
