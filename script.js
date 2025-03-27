document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const toggleFormButton = document.getElementById("toggleFormButton");
    const formPanel = document.getElementById("formPanel");
    const inventoryForm = document.getElementById("inventoryForm");
    const inventoryTable = document.querySelector("#inventoryTable tbody");
    const searchInput = document.getElementById("search-bar");
    const searchButton = document.getElementById("searchButton");
    const detailPanel = document.getElementById("detailPanel");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const chatToggleBtn = document.getElementById("chatToggleBtn");
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const resetButton = document.getElementById("resetButton");

    let inventory = [];

    // Toggle Add Item Form
    toggleFormButton.addEventListener("click", function () {
        formPanel.classList.toggle("active");
    });

    // Add new item to inventory
    inventoryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let itemName = document.getElementById("item-name").value;
        let itemQuantity = document.getElementById("item-quantity").value;
        let itemPrice = document.getElementById("item-price").value;
        let itemDate = document.getElementById("item-date").value;
        let itemDescription = document.getElementById("item-description").value;
        let itemImage = document.getElementById("item-image").value || "placeholder.jpg";

        let newItem = {
            id: Date.now(),
            name: itemName,
            quantity: parseInt(itemQuantity),
            price: parseFloat(itemPrice),
            date: itemDate,
            description: itemDescription,
            image: itemImage
        };

        inventory.push(newItem);
        updateInventoryTable();
        inventoryForm.reset();
        formPanel.classList.remove("active");
    });

    // Update inventory table
    function updateInventoryTable() {
        inventoryTable.innerHTML = "";
        inventory.forEach(item => {
            let row = document.createElement("tr");
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

    // View item details
    window.viewItem = function (id) {
        let item = inventory.find(i => i.id === id);
        if (item) {
            document.getElementById("detail-title").innerText = item.name;
            document.getElementById("detail-image").src = item.image;
            document.getElementById("detail-description").innerText = item.description;
            document.getElementById("detail-price").innerText = `$${item.price.toFixed(2)}`;
            document.getElementById("detail-date").innerText = item.date;
            document.getElementById("detail-quantity").value = item.quantity;
            document.getElementById("detail-total").innerText = `$${(item.price * item.quantity).toFixed(2)}`;

            detailPanel.classList.add("active");
        }
    };

    // Delete item
    window.deleteItem = function (id) {
        inventory = inventory.filter(i => i.id !== id);
        updateInventoryTable();
    };

    // Search function
    searchButton.addEventListener("click", function () {
        let query = searchInput.value.toLowerCase();
        let filtered = inventory.filter(item => item.name.toLowerCase().includes(query));
        inventoryTable.innerHTML = "";
        filtered.forEach(item => {
            let row = document.createElement("tr");
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

    // Toggle Chatbot
    chatToggleBtn.addEventListener("click", function () {
        chatbotContainer.classList.toggle("active");
    });

    // Chatbot logic
    sendMessageButton.addEventListener("click", function () {
        let userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        let userChat = document.createElement("div");
        userChat.classList.add("user-message");
        userChat.innerText = userMessage;
        chatbotMessages.appendChild(userChat);

        let botResponse = document.createElement("div");
        botResponse.classList.add("bot-message");

        if (userMessage.toLowerCase().includes("hello")) {
            botResponse.innerText = "Hello! How can I assist you with inventory today?";
        } else if (userMessage.toLowerCase().includes("add item")) {
            botResponse.innerText = "Click on 'Add New Item' and fill the form to add an item.";
        } else if (userMessage.toLowerCase().includes("delete item")) {
            botResponse.innerText = "To delete an item, click the 'Delete' button next to it in the inventory list.";
        } else if (userMessage.toLowerCase().includes("search")) {
            botResponse.innerText = "Use the search bar to find an item by name.";
        } else {
            botResponse.innerText = "I'm not sure how to respond to that. Try asking about inventory actions!";
        }

        chatbotMessages.appendChild(botResponse);
        chatInput.value = "";
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    });

    // Reset everything
    resetButton.addEventListener("click", function () {
        inventory = [];
        updateInventoryTable();
    });
}); l
