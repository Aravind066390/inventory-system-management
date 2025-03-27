// Inventory Management System Script

// Main Application State
const app = {
    inventory: [],
    currentTheme: 'light',
    chatbotMessages: [],
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadInitialData();
        this.setupTheme();
    },

    cacheDOM() {
        // Form Elements
        this.inventoryForm = document.getElementById('inventoryForm');
        this.searchBar = document.getElementById('search-bar');
        this.searchButton = document.getElementById('searchButton');
        this.inventoryTable = document.getElementById('inventoryTable').querySelector('tbody');
        this.toggleFormButton = document.getElementById('toggleFormButton');
        this.formPanel = document.getElementById('formPanel');

        // Detail View Elements
        this.detailPanel = document.getElementById('detailPanel');
        this.detailTitle = document.getElementById('detail-title');
        this.detailImage = document.getElementById('detail-image');
        this.detailDescription = document.getElementById('detail-description');
        this.detailPrice = document.getElementById('detail-price');
        this.detailDate = document.getElementById('detail-date');
        this.detailQuantity = document.getElementById('detail-quantity');
        this.detailTotal = document.getElementById('detail-total');

        // Edit Form Elements
        this.editForm = document.getElementById('editForm');
        this.editName = document.getElementById('edit-name');
        this.editDescription = document.getElementById('edit-description');
        this.editPrice = document.getElementById('edit-price');
        this.editDate = document.getElementById('edit-date');
        this.editQuantity = document.getElementById('edit-quantity');
        this.editImage = document.getElementById('edit-image');

        // Buttons
        this.backToInventoryBtn = document.getElementById('back-to-inventory');
        this.editDetailButton = document.getElementById('edit-detail-button');
        this.cancelEditBtn = document.getElementById('cancel-edit');
        this.decreaseQuantityBtn = document.getElementById('decrease-quantity');
        this.increaseQuantityBtn = document.getElementById('increase-quantity');
        this.resetButton = document.getElementById('resetButton');

        // Theme Toggle
        this.themeToggleBtn = document.getElementById('themeToggleBtn');
        this.themeToggleIcon = this.themeToggleBtn.querySelector('.theme-toggle-icon');

        // Chatbot Elements
        this.chatToggleBtn = document.getElementById('chatToggleBtn');
        this.chatbotContainer = document.getElementById('chatbotContainer');
        this.chatbotMessages = document.getElementById('chatbotMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendMessageButton = document.getElementById('sendMessageButton');
        this.closeChatButton = document.getElementById('closeChatButton');
    },

    bindEvents() {
        // Form Submission
        this.inventoryForm.addEventListener('submit', this.addInventoryItem.bind(this));
        this.editForm.addEventListener('submit', this.saveEditedItem.bind(this));

        // Search 
        this.searchButton.addEventListener('click', this.searchInventory.bind(this));
        this.searchBar.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.searchInventory();
        });

        // Toggle Form
        this.toggleFormButton.addEventListener('click', this.toggleAddItemForm.bind(this));

        // Detail View Interactions
        this.backToInventoryBtn.addEventListener('click', this.showInventoryList.bind(this));
        this.editDetailButton.addEventListener('click', this.switchToEditMode.bind(this));
        this.cancelEditBtn.addEventListener('click', this.cancelEdit.bind(this));

        // Quantity Controls
        this.decreaseQuantityBtn.addEventListener('click', this.adjustQuantity.bind(this, -1));
        this.increaseQuantityBtn.addEventListener('click', this.adjustQuantity.bind(this, 1));

        // Theme Toggle
        this.themeToggleBtn.addEventListener('click', this.toggleTheme.bind(this));

        // Reset
        this.resetButton.addEventListener('click', this.resetInventory.bind(this));

        // Chatbot
        this.chatToggleBtn.addEventListener('click', this.toggleChatbot.bind(this));
        this.sendMessageButton.addEventListener('click', this.sendChatMessage.bind(this));
        this.chatInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
        this.closeChatButton.addEventListener('click', this.toggleChatbot.bind(this));
    },

    loadInitialData() {
        // Optional: Load some initial inventory items
        const initialItems = [
            {
                id: 1,
                name: 'Laptop',
                quantity: 10,
                price: 999.99,
                date: '2024-03-15',
                description: 'High-performance business laptop',
                image: 'https://example.com/laptop.jpg'
            },
            {
                id: 2,
                name: 'Wireless Mouse',
                quantity: 50,
                price: 29.99,
                date: '2024-03-10',
                description: 'Ergonomic wireless mouse',
                image: 'https://example.com/mouse.jpg'
            }
        ];

        initialItems.forEach(item => this.addInventoryItem(null, item));
    },

    // Inventory Management Methods
    addInventoryItem(event, itemData = null) {
        if (event) {
            event.preventDefault();
            itemData = {
                id: Date.now(),
                name: document.getElementById('item-name').value,
                quantity: parseInt(document.getElementById('item-quantity').value),
                price: parseFloat(document.getElementById('item-price').value),
                date: document.getElementById('item-date').value,
                description: document.getElementById('item-description').value,
                image: document.getElementById('item-image').value || 'https://via.placeholder.com/150'
            };
        }

        this.inventory.push(itemData);
        this.renderInventoryTable();
        this.clearAddItemForm();
    },

    renderInventoryTable() {
        this.inventoryTable.innerHTML = '';
        this.inventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.date}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="app.showItemDetails(${item.id})">View</button>
                    <button onclick="app.deleteItem(${item.id})">Delete</button>
                </td>
            `;
            this.inventoryTable.appendChild(row);
        });
    },

    showItemDetails(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return;

        // Populate detail view
        this.detailTitle.textContent = item.name;
        this.detailImage.src = item.image || 'https://via.placeholder.com/300';
        this.detailDescription.textContent = item.description;
        this.detailPrice.textContent = `$${item.price.toFixed(2)}`;
        this.detailDate.textContent = item.date;
        this.detailQuantity.value = item.quantity;
        this.detailTotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        // Show detail panel, hide inventory list
        this.detailPanel.classList.remove('edit-mode');
        this.formPanel.style.display = 'none';
        this.detailPanel.style.display = 'block';
    },

    deleteItem(itemId) {
        this.inventory = this.inventory.filter(item => item.id !== itemId);
        this.renderInventoryTable();
    },

    // Form and View Management
    toggleAddItemForm() {
        this.formPanel.style.display = this.formPanel.style.display === 'none' ? 'block' : 'none';
    },

    clearAddItemForm() {
        this.inventoryForm.reset();
    },

    showInventoryList() {
        this.detailPanel.style.display = 'none';
        this.formPanel.style.display = 'block';
    },

    // Edit Functionality
    switchToEditMode() {
        const currentItem = this.inventory.find(item => item.name === this.detailTitle.textContent);
        if (!currentItem) return;

        this.detailPanel.classList.add('edit-mode');
        this.editName.value = currentItem.name;
        this.editDescription.value = currentItem.description;
        this.editPrice.value = currentItem.price;
        this.editDate.value = currentItem.date;
        this.editQuantity.value = currentItem.quantity;
        this.editImage.value = currentItem.image || '';
    },

    saveEditedItem(event) {
        event.preventDefault();
        const currentItemIndex = this.inventory.findIndex(item => item.name === this.detailTitle.textContent);
        
        if (currentItemIndex !== -1) {
            this.inventory[currentItemIndex] = {
                ...this.inventory[currentItemIndex],
                name: this.editName.value,
                description: this.editDescription.value,
                price: parseFloat(this.editPrice.value),
                date: this.editDate.value,
                quantity: parseInt(this.editQuantity.value),
                image: this.editImage.value || 'https://via.placeholder.com/150'
            };

            this.renderInventoryTable();
            this.showItemDetails(this.inventory[currentItemIndex].id);
        }
    },

    cancelEdit() {
        this.detailPanel.classList.remove('edit-mode');
    },

    // Quantity Adjustment
    adjustQuantity(change) {
        const currentItem = this.inventory.find(item => item.name === this.detailTitle.textContent);
        if (!currentItem) return;

        currentItem.quantity = Math.max(0, currentItem.quantity + change);
        this.detailQuantity.value = currentItem.quantity;
        this.detailTotal.textContent = `$${(currentItem.price * currentItem.quantity).toFixed(2)}`;
        this.renderInventoryTable();
    },

    // Search Functionality
    searchInventory() {
        const searchTerm = this.searchBar.value.toLowerCase();
        const filteredInventory = this.inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );

        this.inventoryTable.innerHTML = '';
        filteredInventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.date}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="app.showItemDetails(${item.id})">View</button>
                    <button onclick="app.deleteItem(${item.id})">Delete</button>
                </td>
            `;
            this.inventoryTable.appendChild(row);
        });
    },

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('inventoryAppTheme') || 'light';
        this.applyTheme(savedTheme);
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },

    applyTheme(theme) {
        this.currentTheme = theme;
        document.body.classList.toggle('dark-theme', theme === 'dark');
        this.themeToggleIcon.textContent = theme === 'light' ? '🌙' : '☀';
        localStorage.setItem('inventoryAppTheme', theme);
    },

    // Chatbot Functionality
    toggleChatbot() {
        this.chatbotContainer.classList.toggle('open');
    },

    sendChatMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        this.chatInput.value = '';

        // Simulate bot response (replace with actual AI chatbot logic)
        setTimeout(() => {
            const botResponse = this.generateChatbotResponse(message);
            this.addChatMessage(botResponse, 'bot');
        }, 500);
    },

    addChatMessage(message, sender) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', sender + '-message');
        messageEl.textContent = message;
        this.chatbotMessages.appendChild(messageEl);
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    },

    generateChatbotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
            return "I can help you manage your inventory. You can add items, search items, edit quantities, and more!";
        }
        
        if (lowerMessage.includes('total') || lowerMessage.includes('value')) {
            const totalValue = this.inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return `Your total inventory value is $${totalValue.toFixed(2)}`;
        }
        
        if (lowerMessage.includes('count') || lowerMessage.includes('items')) {
            return `You currently have ${this.inventory.length} different items in your inventory.`;
        }

        return "I'm not sure how to help with that. Can you be more specific?";
    },

    // Reset Functionality
    resetInventory() {
        this.inventory = [];
        this.renderInventoryTable();
        this.detailPanel.style.display = 'none';
        this.formPanel.style.display = 'block';
    }
};

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
