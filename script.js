document.addEventListener("DOMContentLoaded", () => {
    const inventoryForm = document.getElementById("inventoryForm");
    const inventoryTable = document.querySelector("#inventoryTable tbody");
    const toggleFormButton = document.getElementById("toggleFormButton");
    const formPanel = document.getElementById("formPanel");
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("searchButton");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const chatToggleBtn = document.getElementById("chatToggleBtn");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const closeChatButton = document.getElementById("closeChatButton");
    const resetButton = document.getElementById("resetButton");

    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    function updateLocalStorage() {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    function addInventoryItem(name, quantity, price, date, description, image) {
        const newItem = {
            id: Date.now(),
            name,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            date,
            description,
            image,
        };
        inventory.push(newItem);
        updateLocalStorage();
        renderInventory();
    }

    function renderInventory(searchQuery = "") {
        inventoryTable.innerHTML = "";
        inventory.forEach((item) => {
            if (
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.date}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="edit-btn" data-id="${item.id}">✏</button>
                        <button class="delete-btn" data-id="${item.id}">🗑</button>
                    </td>
                `;
                inventoryTable.appendChild(row);
            }
        });
    }

    inventoryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("item-name").value;
        const quantity = document.getElementById("item-quantity").value;
        const price = document.getElementById("item-price").value;
        const date = document.getElementById("item-date").value;
        const description = document.getElementById("item-description").value;
        const image = document.getElementById("item-image").value;

        addInventoryItem(name, quantity, price, date, description, image);
        inventoryForm.reset();
    });

    inventoryTable.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const itemId = parseInt(event.target.dataset.id);
            inventory = inventory.filter((item) => item.id !== itemId);
            updateLocalStorage();
            renderInventory();
        }
    });

    toggleFormButton.addEventListener("click", () => {
        formPanel.classList.toggle("hidden");
    });

    searchButton.addEventListener("click", () => {
        renderInventory(searchBar.value);
    });

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    chatToggleBtn.addEventListener("click", () => {
        chatbotContainer.classList.toggle("active");
    });

    closeChatButton.addEventListener("click", () => {
        chatbotContainer.classList.remove("active");
    });

    resetButton.addEventListener("click", () => {
        localStorage.removeItem("inventory");
        inventory = [];
        renderInventory();
    });

    renderInventory();
});
