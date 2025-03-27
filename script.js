// Inventory Management System JavaScript

// Inventory Items Storage
let inventoryItems = [];

// DOM Elements
const addItemBtn = document.getElementById('add-item-btn');
const addItemModal = document.getElementById('add-item-modal');
const closeModalBtn = document.querySelector('.close-btn');
const addItemForm = document.getElementById('add-item-form');
const inventoryList = document.getElementById('inventory-list');

// Chatbot Elements
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotPanel = document.getElementById('chatbot-panel');
const closeChatbotBtn = document.getElementById('close-chatbot');
const userInput = document.getElementById('user-input');
const sendMessageBtn = document.getElementById('send-message');
const chatbotMessages = document.getElementById('chatbot-messages');

// Event Listeners
addItemBtn.addEventListener('click', () => {
    addItemModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    addItemModal.style.display = 'none';
});

addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewItem();
});

// Chatbot Icon and Panel
chatbotIcon.addEventListener('click', () => {
    chatbotPanel.style.display = 'flex';
});

closeChatbotBtn.addEventListener('click', () => {
    chatbotPanel.style.display = 'none';
});

sendMessageBtn.addEventListener('click', handleChatbotMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChatbotMessage();
    }
});

// Add New Item Function
function addNewItem() {
    const itemName = document.getElementById('item-name').value;
    const itemDate = document.getElementById('item-date').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);
    const itemImageInput = document.getElementById('item-image');

    // Read image file
    const reader = new FileReader();
    reader.onload = function(event) {
        const newItem = {
            id: Date.now(),
            name: itemName,
            date: itemDate,
            price: itemPrice,
            quantity: itemQuantity,
            image: event.target.result
        };

        inventoryItems.push(newItem);
        renderInventoryList();
        addItemModal.style.display = 'none';
        addItemForm.reset();
    };

    if (itemImageInput.files.length > 0) {
        reader.readAsDataURL(itemImageInput.files[0]);
    } else {
        const newItem = {
            id: Date.now(),
            name: itemName,
            date: itemDate,
            price: itemPrice,
            quantity: itemQuantity,
            image: null
        };

        inventoryItems.push(newItem);
        renderInventoryList();
        addItemModal.style.display = 'none';
        addItemForm.reset();
    }
}

// Render Inventory List
function renderInventoryList() {
    inventoryList.innerHTML = '';
    inventoryItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}" class="item-image">` : 
                    'No Image'
                }
            </td>
            <td>${item.name}</td>
            <td>${item.date}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>
                <button onclick="editItem(${item.id})" class="primary-btn">Edit</button>
                <button onclick="deleteItem(${item.id})" class="primary-btn" style="background-color: #e74c3c;">Delete</button>
            </td>
        `;
        inventoryList.appendChild(row);
    });
}

// Edit Item Function
function editItem(id) {
    const item = inventoryItems.find(i => i.id === id);
    if (item) {
        // Populate form with existing item details
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-date').value = item.date;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-quantity').value = item.quantity;
        
        // Remove the existing item
        inventoryItems = inventoryItems.filter(i => i.id !== id);
        
        // Show modal
        addItemModal.style.display = 'block';
    }
}

// Delete Item Function
function deleteItem(id) {
    inventoryItems = inventoryItems.filter(item => item.id !== id);
    renderInventoryList();
}

// Chatbot Functionality
const chatbotResponses = {
    inventory: "This is an inventory management system where you can add, edit, and delete items.",
    add: "To add an item, click the 'Add New Item' button and fill out the form with item details.",
    edit: "You can edit an item by clicking the 'Edit' button next to the item in the list.",
    delete: "To remove an item, click the 'Delete' button next to the item you want to remove.",
    help: "I can help you with adding, editing, or deleting inventory items. What would you like to know?"
};

function handleChatbotMessage() {
    const userMessage = userInput.value.toLowerCase().trim();
    const messageElement = document.createElement('div');
    
    // User message
    messageElement.innerHTML = `<strong>You:</strong> ${userInput.value}`;
    chatbotMessages.appendChild(messageElement);

    // Find appropriate response
    let botResponse = "I'm not sure about that. Try asking about inventory, add, edit, or delete.";
    for (let key in chatbotResponses) {
        if (userMessage.includes(key)) {
            botResponse = chatbotResponses[key];
            break;
        }
    }

    // Bot response
    const botMessageElement = document.createElement('div');
    botMessageElement.innerHTML = `<strong>Inventory Assistant:</strong> ${botResponse}`;
    chatbotMessages.appendChild(botMessageElement);

    // Clear input and scroll to bottom
    userInput.value = '';
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Initialize the inventory list
renderInventoryList();
