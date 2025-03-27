// Inventory Management System

// Local Storage Management
class InventoryManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
    }

    saveToLocalStorage() {
        localStorage.setItem('inventoryItems', JSON.stringify(this.items));
    }

    addItem(item) {
        item.id = Date.now(); // Unique ID
        this.items.push(item);
        this.saveToLocalStorage();
        this.renderInventory();
    }

    updateItem(id, updatedItem) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updatedItem };
            this.saveToLocalStorage();
            this.renderInventory();
        }
    }

    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.renderInventory();
    }

    renderInventory() {
        const container = document.getElementById('inventory-container');
        container.innerHTML = '';

        this.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('inventory-item');
            
            // Image handling
            const img = document.createElement('img');
            img.src = item.image || 'placeholder.png';
            img.alt = item.name;

            itemDiv.innerHTML = `
                <img src="${img.src}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Date: ${item.date}</p>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <div class="item-actions">
                    <button onclick="inventoryApp.editItem(${item.id})">Edit</button>
                    <button onclick="inventoryApp.deleteItem(${item.id})">Delete</button>
                </div>
            `;

            container.appendChild(itemDiv);
        });
    }

    editItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            document.getElementById('edit-item-id').value = id;
            document.getElementById('edit-item-name').value = item.name;
            document.getElementById('edit-item-date').value = item.date;
            document.getElementById('edit-item-price').value = item.price;
            document.getElementById('edit-item-quantity').value = item.quantity;
            
            document.getElementById('edit-item-modal').style.display = 'block';
        }
    }
}

// Chatbot Class
class InventoryChatbot {
    constructor() {
        this.keywords = {
            'add item': 'To add an item, click the "Add New Item" button at the top of the page.',
            'edit item': 'You can edit an item by clicking the "Edit" button on the item card.',
            'delete item': 'To delete an item, click the "Delete" button on the item card.',
            'quantity': 'The quantity shows how many of each item you currently have in stock.',
            'price': 'The price is the cost of a single item in your inventory.',
            'help': 'I can help you with adding, editing, and managing inventory items. Ask me about specific actions.',
            'inventory': 'This system helps you track and manage your items, including their name, date, price, and quantity.'
        };
    }

    processMessage(userMessage) {
        const lowercaseMessage = userMessage.toLowerCase();
        
        for (const [keyword, response] of Object.entries(this.keywords)) {
            if (lowercaseMessage.includes(keyword)) {
                return response;
            }
        }

        return "I'm not sure I understand. Try asking about adding, editing, or managing inventory items.";
    }

    displayMessage(message, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', type);
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Application Initialization
class InventoryApp {
    constructor() {
        this.inventoryManager = new InventoryManager();
        this.chatbot = new InventoryChatbot();
        this.initEventListeners();
        this.inventoryManager.renderInventory();
    }

    initEventListeners() {
        // Add Item Modal
        document.getElementById('add-item-btn').addEventListener('click', () => {
            document.getElementById('add-item-modal').style.display = 'block';
        });

        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').style.display = 'none';
            });
        });

        // Add Item Form
        document.getElementById('add-item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const reader = new FileReader();
            const imageFile = document.getElementById('item-image').files[0];

            const handleItemAdd = (imageData) => {
                const newItem = {
                    name: document.getElementById('item-name').value,
                    date: document.getElementById('item-date').value,
                    price: document.getElementById('item-price').value,
                    quantity: document.getElementById('item-quantity').value,
                    image: imageData || null
                };

                this.inventoryManager.addItem(newItem);
                document.getElementById('add-item-form').reset();
                document.getElementById('add-item-modal').style.display = 'none';
            };

            if (imageFile) {
                reader.onloadend = () => {
                    handleItemAdd(reader.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                handleItemAdd();
            }
        });

        // Edit Item Form
        document.getElementById('edit-item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-item-id').value);
            const reader = new FileReader();
            const imageFile = document.getElementById('edit-item-image').files[0];

            const handleItemUpdate = (imageData) => {
                const updatedItem = {
                    name: document.getElementById('edit-item-name').value,
                    date: document.getElementById('edit-item-date').value,
                    price: document.getElementById('edit-item-price').value,
                    quantity: document.getElementById('edit-item-quantity').value,
                    image: imageData || null
                };

                this.inventoryManager.updateItem(id, updatedItem);
                document.getElementById('edit-item-form').reset();
                document.getElementById('edit-item-modal').style.display = 'none';
            };

            if (imageFile) {
                reader.onloadend = () => {
                    handleItemUpdate(reader.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                handleItemUpdate();
            }
        });

        // Chatbot Event Listeners
        document.getElementById('chatbot-icon').addEventListener('click', () => {
            const chatbotPanel = document.getElementById('chatbot-panel');
            chatbotPanel.classList.toggle('open');
        });

        document.getElementById('close-chatbot').addEventListener('click', () => {
            document.getElementById('chatbot-panel').classList.remove('open');
        });

        document.getElementById('send-message').addEventListener('click', () => this.handleChatbotMessage());
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleChatbotMessage();
        });
    }

    handleChatbotMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (message) {
            // Display user message
            this.chatbot.displayMessage(message, 'user-message');

            // Process and display bot response
            const botResponse = this.chatbot.processMessage(message);
            this.chatbot.displayMessage(botResponse, 'bot-message');

            // Clear input
            input.value = '';
        }
    }

    editItem(id) {
        this.inventoryManager.editItem(id);
    }

    deleteItem(id) {
        this.inventoryManager.deleteItem(id);
    }
}

// Initialize the Application
const inventoryApp = new InventoryApp();
