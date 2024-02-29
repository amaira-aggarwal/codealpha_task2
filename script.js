document.addEventListener("DOMContentLoaded", function () {
  const expenseForm = document.getElementById("add-expense-form");
  const expensesList = document.getElementById("expenses");
  const totalExpenses = document.getElementById("total-expenses");

  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const expenseNameInput = document.getElementById("expense-name");
    const expensePriceInput = document.getElementById("expense-price");

    const expenseName = expenseNameInput.value.trim();
    const expensePrice = parseFloat(expensePriceInput.value.trim());

    if (expenseName === "" || isNaN(expensePrice) || expensePrice <= 0) {
      alert("Please enter a valid expense name and price.");
      return;
    }

    addExpense(expenseName, expensePrice);
    expenseForm.reset();
    updateTotalExpenses();
  });

  function addExpense(name, price) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${name}</td>
          <td>$${price.toFixed(2)}</td>
          <td>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
          </td>
      `;
    expensesList.appendChild(row);

    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    let expenses = [];
    const rows = expensesList.querySelectorAll("tr");
    rows.forEach((row) => {
      const name = row.children[0].innerText;
      const price = parseFloat(row.children[1].innerText.slice(1));
      expenses.push({ name, price });
    });
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function loadFromLocalStorage() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.forEach((expense) => {
      addExpense(expense.name, expense.price);
    });
  }

  function updateTotalExpenses() {
    let total = 0;
    const rows = expensesList.querySelectorAll("tr");
    rows.forEach((row) => {
      const price = parseFloat(row.children[1].innerText.slice(1));
      total += price;
    });
    totalExpenses.textContent = `Total Expenses: $${total.toFixed(2)}`;
  }

  loadFromLocalStorage();
  updateTotalExpenses();

  expensesList.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("delete-btn")) {
      const row = target.parentElement.parentElement;
      row.remove();
      saveToLocalStorage();
      updateTotalExpenses();
    } else if (target.classList.contains("edit-btn")) {
      const row = target.parentElement.parentElement;
      const name = row.children[0].innerText;
      const price = parseFloat(row.children[1].innerText.slice(1));

      const newName = prompt("Enter new name", name);
      const newPrice = parseFloat(prompt("Enter new price", price));

      if (newName && newPrice && newPrice > 0) {
        row.remove();
        addExpense(newName, newPrice);
        saveToLocalStorage();
        updateTotalExpenses();
      } else {
        alert(
          "Invalid input. Name and price must be provided and price must be a positive number."
        );
      }
    }
  });
});
