// Seleciona os elementos da tela
const historyEl = document.getElementById("history");
const resultEl = document.getElementById("result");
const keys = document.querySelectorAll(".key");

// Guarda o número/expressão que está sendo montada
let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetScreen = false;

// Atualiza o que aparece na tela
function updateDisplay() {
  // Mostra a conta anterior em cima
  historyEl.textContent = previousInput && operator ? `${previousInput} ${getOperatorSymbol(operator)}` : "";

  // Mostra o valor atual embaixo
  resultEl.textContent = currentInput;
}

// Troca o símbolo interno por um símbolo bonito na tela
function getOperatorSymbol(op) {
  switch (op) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "*":
      return "×";
    case "/":
      return "÷";
    case "%":
      return "%";
    default:
      return "";
  }
}

// Faz o cálculo
function calculate(a, op, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (Number.isNaN(numA) || Number.isNaN(numB)) return "Erro";

  switch (op) {
    case "+":
      return String(numA + numB);
    case "-":
      return String(numA - numB);
    case "*":
      return String(numA * numB);
    case "/":
      return numB === 0 ? "Erro" : String(numA / numB);
    case "%":
      return String(numA % numB);
    default:
      return b;
  }
}

// Adiciona números ao visor
function inputNumber(number) {
  // Se o número atual for 0 ou se acabou de calcular, começa um novo número
  if (currentInput === "0" || shouldResetScreen) {
    currentInput = number;
    shouldResetScreen = false;
  } else {
    currentInput += number;
  }
}

// Adiciona ponto decimal
function inputDecimal() {
  // Não deixa colocar dois pontos no mesmo número
  if (shouldResetScreen) {
    currentInput = "0.";
    shouldResetScreen = false;
    return;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

// Define a operação escolhida
function inputOperator(nextOperator) {
  // Se já existe uma operação anterior, resolve a conta primeiro
  if (operator && !shouldResetScreen) {
    currentInput = calculate(previousInput, operator, currentInput);
  }

  previousInput = currentInput;
  operator = nextOperator;
  shouldResetScreen = true;
}

// Limpa tudo
function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  shouldResetScreen = false;
}

// Apaga o último caractere
function deleteLast() {
  if (shouldResetScreen) return;

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
}

// Mostra o resultado final
function equals() {
  if (!operator || !previousInput) return;

  currentInput = calculate(previousInput, operator, currentInput);
  previousInput = "";
  operator = null;
  shouldResetScreen = true;
}

// Pequena animação ao trocar o número da tela
function animateResult() {
  resultEl.style.transform = "scale(0.98)";
  setTimeout(() => {
    resultEl.style.transform = "scale(1)";
  }, 120);
}

// Captura cliques nos botões
keys.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "number") inputNumber(value);
    if (action === "decimal") inputDecimal();
    if (action === "operator") inputOperator(value);
    if (action === "clear") clearAll();
    if (action === "delete") deleteLast();
    if (action === "equals") equals();

    updateDisplay();
    animateResult();
  });
});

// Suporte ao teclado do computador
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    inputNumber(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    inputOperator(key);
  } else if (key === "Enter" || key === "=") {
    equals();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  } else {
    return;
  }

  updateDisplay();
  animateResult();
});

// Mostra o estado inicial
updateDisplay();