// Get Elements
const inventoryForm = document.getElementById("inventoryForm");
const inventoryTable = document.getElementById("inventoryTable").querySelector("tbody");
const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("searchButton");
const toggleFormButton = document.getElementById("toggleFormButton");
const formPanel = document.getElementById("formPanel");
const resetButton = document.getElementById("resetButton");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const chatToggleBtn = document.getElementById("chatToggleBtn");
const chatbotContainer = document.getElementById("chatbotContainer");

// Inventory Data (Stored in Local Storage)
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// Function to Render Inventory Table
function renderInventory() {
    inventoryTable.innerHTML = ""; // Clear previous entries
    inventory.forEach((item, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.date}</td>
            <td>₹${item.price}</td>
            <td>
                <button class="edit-btn" onclick="editItem(${index})">✏</button>
                <button class="delete-btn" onclick="deleteItem(${index})">🗑</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
}

// Function to Add Inventory Item
inventoryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const itemName = document.getElementById("item-name").value.trim();
    const itemQuantity = document.getElementById("item-quantity").value;
    const itemPrice = document.getElementById("item-price").value;
    const itemDate = document.getElementById("item-date").value;
    const itemDescription = document.getElementById("item-description").value;
    const itemImage = document.getElementById("item-image").value;

    if (!itemName || !itemQuantity || !itemPrice || !itemDate) {
        alert("Please fill all required fields!");
        return;
    }

    inventory.push({ name: itemName, quantity: itemQuantity, price: itemPrice, date: itemDate, description: itemDescription, image: itemImage });

    localStorage.setItem("inventory", JSON.stringify(inventory));
    renderInventory();
    inventoryForm.reset(); // Clear form fields
});

// Function to Delete Inventory Item
function deleteItem(index) {
    if (confirm("Are you sure you want to delete this item?")) {
        inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
    }
}

// Function to Edit Inventory Item
function editItem(index) {
    const item = inventory[index];
    document.getElementById("item-name").value = item.name;
    document.getElementById("item-quantity").value = item.quantity;
    document.getElementById("item-price").value = item.price;
    document.getElementById("item-date").value = item.date;
    document.getElementById("item-description").value = item.description;
    document.getElementById("item-image").value = item.image;

    inventory.splice(index, 1); // Remove item from list while editing
    localStorage.setItem("inventory", JSON.stringify(inventory));
    renderInventory();
}

// Search Functionality
searchButton.addEventListener("click", function () {
    let searchText = searchInput.value.toLowerCase();
    let filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText));

    inventoryTable.innerHTML = "";
    filteredInventory.forEach((item, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.date}</td>
            <td>₹${item.price}</td>
            <td>
                <button class="edit-btn" onclick="editItem(${index})">✏</button>
                <button class="delete-btn" onclick="deleteItem(${index})">🗑</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });
});

// Toggle Form Panel
toggleFormButton.addEventListener("click", () => {
    formPanel.style.display = formPanel.style.display === "none" ? "block" : "none";
});

// Reset Inventory
resetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the inventory?")) {
        localStorage.removeItem("inventory");
        inventory = [];
        renderInventory();
    }
});

// Theme Toggle
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Chatbot Toggle
chatToggleBtn.addEventListener("click", () => {
    chatbotContainer.classList.toggle("show-chat");
});

// Load Inventory on Page Load
renderInventory();
