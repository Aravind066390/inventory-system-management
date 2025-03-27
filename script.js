document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const chatToggleBtn = document.getElementById("chatToggleBtn");
    const toggleFormButton = document.getElementById("toggleFormButton");
    const formPanel = document.getElementById("formPanel");
    const inventoryForm = document.getElementById("inventoryForm");
    const inventoryTable = document.querySelector("#inventoryTable tbody");
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("searchButton");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const closeChatButton = document.getElementById("closeChatButton");
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const resetButton = document.getElementById("resetButton");

    let inventory = [];

    // Theme Toggle Functionality
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });

    // Chatbot Toggle
    chatToggleBtn.addEventListener("click", () => {
        chatbotContainer.classList.toggle("visible");
    });

    closeChatButton.addEventListener("click", () => {
        chatbotContainer.classList.remove("visible");
    });

    // Add New Item Form Toggle
    toggleFormButton.addEventListener("click", () => {
        formPanel.classList.toggle("visible");
    });

    // Handle Add Item Submission
    inventoryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const name = document.getElementById("item-name").value;
        const quantity = parseInt(document.getElementById("item-quantity").value);
        const price = parseFloat(document.getElementById("item-price").value);
        const date = document.getElementById("item-date").value;
        const description = document.getElementById("item-description").value;
        const image = document.getElementById("item-image").value || "placeholder.jpg";

        if (name && quantity >= 0 && price >= 0 && date) {
            const newItem = { id: Date.now(), name, quantity, price, date, description, image };
            inventory.push(newItem);
            updateInventoryTable();
            inventoryForm.reset();
        } else {
            alert("Please fill in all required fields correctly.");
        }
    });

    // Update Inventory Table
    function updateInventoryTable() {
        inventoryTable.innerHTML = "";
        inventory.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.date}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="viewItem(${item.id})">View</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                </td>
            `;
            inventoryTable.appendChild(row);
        });
    }

    // View Item Details
    window.viewItem = function (id) {
        const item = inventory.find(i => i.id === id);
        if (item) {
            document.getElementById("detail-title").innerText = item.name;
            document.getElementById("detail-description").innerText = item.description;
            document.getElementById("detail-price").innerText = `$${item.price.toFixed(2)}`;
            document.getElementById("detail-date").innerText = item.date;
            document.getElementById("detail-quantity").value = item.quantity;
            document.getElementById("detail-total").innerText = `$${(item.price * item.quantity).toFixed(2)}`;
            document.getElementById("detail-image").src = item.image;
            
            document.getElementById("detailPanel").classList.add("visible");
        }
    };

    // Delete Item
    window.deleteItem = function (id) {
        inventory = inventory.filter(item => item.id !== id);
        updateInventoryTable();
    };

    // Search Functionality
    searchButton.addEventListener("click", () => {
        const query = searchBar.value.toLowerCase();
        inventoryTable.innerHTML = "";
        inventory
            .filter(item => item.name.toLowerCase().includes(query))
            .forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.date}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button onclick="viewItem(${item.id})">View</button>
                        <button onclick="deleteItem(${item.id})">Delete</button>
                    </td>
                `;
                inventoryTable.appendChild(row);
            });
    });

    // Chatbot Interaction
    sendMessageButton.addEventListener("click", () => {
        const message = chatInput.value.trim();
        if (message) {
            const userMessage = `<div class="user-message">${message}</div>`;
            chatbotMessages.innerHTML += userMessage;
            chatInput.value = "";

            setTimeout(() => {
                const botReply = `<div class="bot-message">I'm still learning! Try asking about inventory management.</div>`;
                chatbotMessages.innerHTML += botReply;
            }, 1000);
        }
    });

    // Quantity Control in Item Detail View
    document.getElementById("increase-quantity").addEventListener("click", () => {
        const quantityField = document.getElementById("detail-quantity");
        quantityField.value = parseInt(quantityField.value) + 1;
        updateTotalValue();
    });

    document.getElementById("decrease-quantity").addEventListener("click", () => {
        const quantityField = document.getElementById("detail-quantity");
        if (parseInt(quantityField.value) > 0) {
            quantityField.value = parseInt(quantityField.value) - 1;
            updateTotalValue();
        }
    });

    function updateTotalValue() {
        const quantity = parseInt(document.getElementById("detail-quantity").value);
        const price = parseFloat(document.getElementById("detail-price").innerText.replace("$", ""));
        document.getElementById("detail-total").innerText = `$${(quantity * price).toFixed(2)}`;
    }

    // Reset Inventory
    resetButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset the inventory?")) {
            inventory = [];
            updateInventoryTable();
        }
    });
});
