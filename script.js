// Inventory Management System JavaScript

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('ri-moon-line');
        themeIcon.classList.add('ri-sun-line');
    } else {
        themeIcon.classList.remove('ri-sun-line');
        themeIcon.classList.add('ri-moon-line');
    }
});

// Inventory Management
class InventorySystem {
    constructor() {
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.inventoryBody = document.getElementById('inventory-body');
        this.addItemForm = document.getElementById('add-item-form');
        this.editModal = document.getElementById('edit-modal');
        this.editItemForm = document.getElementById('edit-item-form');
        this.closeModalBtn = document.querySelector('.close-modal');

        this.initEventListeners();
        this.renderInventory();
    }

    initEventListeners() {
        this.addItemForm.addEventListener('submit', (e) => this.addItem(e));
        this.editItemForm.addEventListener('submit', (e) => this.updateItem(e));
        this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
    }

    addItem(e) {
        e.preventDefault();
        const name = document.getElementById('item-name').value;
        const date = document.getElementById('item-date').value;
        const price = document.getElementById('item-price').value;
        const quantity = document.getElementById('item-quantity').value;
        const imageFile = document.getElementById('item-image').files[0];

        // Handle image upload
        const reader = new FileReader();
        reader.onloadend = () => {
            const item = {
                name,
                date,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                image: reader.result
            };

            this.inventory.push(item);
            this.saveInventory();
            this.renderInventory();
            this.addItemForm.reset();
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            const item = {
                name,
                date,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                image: null
            };

            this.inventory.push(item);
            this.saveInventory();
            this.renderInventory();
            this.addItemForm.reset();
        }
    }

    renderInventory() {
        this.inventoryBody.innerHTML = '';
        this.inventory.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="table-image">` : 'No Image'}
                </td>
                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="inventorySystem.openEditModal(${index})">Edit</button>
                    <button class="delete-btn" onclick="inventorySystem.deleteItem(${index})">Delete</button>
                </td>
            `;
            this.inventoryBody.appendChild(row);
        });
    }

    openEditModal(index) {
        const item = this.inventory[index];
        document.getElementById('edit-item-index').value = index;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-date').value = item.date;
        document.getElementById('edit-item-price').value = item.price;
        document.getElementById('edit-item-quantity').value = item.quantity;
        this.editModal.style.display = 'block';
    }

    updateItem(e) {
        e.preventDefault();
        const index = document.getElementById('edit-item-index').value;
        const name = document.getElementById('edit-item-name').value;
        const date = document.getElementById('edit-item-date').value;
        const price = document.getElementById('edit-item-price').value;
        const quantity = document.getElementById('edit-item-quantity').value;
        const imageFile = document.getElementById('edit-item-image').files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            this.inventory[index] = {
                name,
                date,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                image: reader.result || this.inventory[index].image
            };

            this.saveInventory();
            this.renderInventory();
            this.closeEditModal();
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            this.inventory[index] = {
                name,
                date,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                image: this.inventory[index].image
            };

            this.saveInventory();
            this.renderInventory();
            this.closeEditModal();
        }
    }

    deleteItem(index) {
        this.inventory.splice(index, 1);
        this.saveInventory();
        this.renderInventory();
    }

    closeEditModal() {
        this.editModal.style.display = 'none';
    }

    saveInventory() {
        localStorage.setItem('inventory', JSON.stringify(this.inventory));
    }
}

// Chatbot Functionality
class InventoryChatbot {
    constructor() {
        this.chatbotIcon = document.getElementById('chatbot-icon');
        this.chatbotWindow = document.getElementById('chatbot-window');
        this.chatbotMessages = document.getElementById('chatbot-messages');
        this.userMessageInput = document.getElementById('user-message');
        this.sendMessageBtn = document.getElementById('send-message');
        this.closeChatbotBtn = document.getElementById('close-chatbot');

        this.initEventListeners();
    }

    initEventListeners() {
        this.chatbotIcon.addEventListener('click', () => this.toggleChatbot());
        this.closeChatbotBtn.addEventListener('click', () => this.closeChatbot());
        this.sendMessageBtn.addEventListener('click', () => this.processUserMessage());
        this.userMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processUserMessage();
        });
    }

    toggleChatbot() {
        this.chatbotWindow.style.display = 
            this.chatbotWindow.style.display === 'block' ? 'none' : 'block';
    }

    closeChatbot() {
        this.chatbotWindow.style.display = 'none';
    }

    addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('bot-message');
        messageElement.textContent = message;
        this.chatbotMessages.appendChild(messageElement);
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }

    processUserMessage() {
        const userMessage = this.userMessageInput.value.trim().toLowerCase();
        
        if (userMessage === '') return;

        // Add user message to chat
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('user-message');
        userMessageElement.textContent = userMessage;
        this.chatbotMessages.appendChild(userMessageElement);

        // Process user message
        let response = this.generateResponse(userMessage);

        // Add bot response
        this.addBotMessage(response);

        // Clear input
        this.userMessageInput.value = '';
    }

    generateResponse(message) {
        const keywords = {
            'help': 'I can help you with inventory management. Ask about adding items, editing, or deleting inventory.',
            'add': 'To add an item, fill out the form at the top of the page with item name, date, price, quantity, and optionally an image.',
            'edit': 'You can edit an item by clicking the "Edit" button next to the item in the inventory table.',
            'delete': 'To delete an item, click the "Delete" button next to the item in the inventory table.',
            'save': 'Your inventory is automatically saved in the browser\'s local storage.',
            'theme': 'You can toggle between light and dark mode using the button in the top right corner.',
            'image': 'You can upload an image for each inventory item when adding or editing.',
            'quantity': 'Quantity can be updated in the edit form for each item.'
        };

        for (let [keyword, response] of Object.entries(keywords)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        return "I'm not sure I understand. Can you ask about inventory management, adding items, editing, or deleting?";
    }
}

// Initialize Systems
const inventorySystem = new InventorySystem();
const inventoryChatbot = new InventoryChatbot();
