class InventorySystem {
    constructor() {
        this.inventory = [];
        this.initEventListeners();
        this.loadInventoryFromLocalStorage();
    }

    initEventListeners() {
        // Add Item Modal Interactions
        document.getElementById('addItemBtn').addEventListener('click', () => this.openAddItemModal());
        document.querySelector('.close-btn').addEventListener('click', () => this.closeAddItemModal());
        document.getElementById('addItemForm').addEventListener('submit', (e) => this.addItem(e));

        // Chatbot Interactions
        document.getElementById('chatbotToggle').addEventListener('click', () => this.toggleChatbot());
        document.getElementById('sendChatBtn').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }

    openAddItemModal() {
        document.getElementById('addItemModal').style.display = 'block';
    }

    closeAddItemModal() {
        document.getElementById('addItemModal').style.display = 'none';
    }

    addItem(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('itemName').value;
        const date = document.getElementById('itemDate').value;
        const price = parseFloat(document.getElementById('itemPrice').value);
        const quantity = parseInt(document.getElementById('itemQuantity').value);
        const imageFile = document.getElementById('itemImage').files[0];

        // Create item object
        const item = {
            id: Date.now(),
            name,
            date,
            price,
            quantity,
            imageUrl: null
        };

        // Handle image upload
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                item.imageUrl = event.target.result;
                this.inventory.push(item);
                this.saveInventoryToLocalStorage();
                this.renderInventory();
                this.closeAddItemModal();
                this.resetAddItemForm();
            };
            reader.readAsDataURL(imageFile);
        } else {
            this.inventory.push(item);
            this.saveInventoryToLocalStorage();
            this.renderInventory();
            this.closeAddItemModal();
            this.resetAddItemForm();
        }
    }

    resetAddItemForm() {
        document.getElementById('addItemForm').reset();
    }

    renderInventory() {
        const inventoryList = document.getElementById('inventoryList');
        inventoryList.innerHTML = ''; // Clear existing items

        this.inventory.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('inventory-item');
            itemCard.innerHTML = `
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : ''}
                <h3>${item.name}</h3>
                <p>Date: ${item.date}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <div class="item-actions">
                    <button onclick="inventorySystem.editItem(${item.id})">Edit</button>
                    <button onclick="inventorySystem.deleteItem(${item.id})">Delete</button>
                </div>
            `;
            inventoryList.appendChild(itemCard);
        });
    }

    editItem(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            // Implement edit functionality 
            // Could open a modal with pre-filled item details
            alert(`Editing item: ${item.name}`);
        }
    }

    deleteItem(id) {
        this.inventory = this.inventory.filter(item => item.id !== id);
        this.saveInventoryToLocalStorage();
        this.renderInventory();
    }

    saveInventoryToLocalStorage() {
        localStorage.setItem('inventoryItems', JSON.stringify(this.inventory));
    }

    loadInventoryFromLocalStorage() {
        const savedInventory = localStorage.getItem('inventoryItems');
        if (savedInventory) {
            this.inventory = JSON.parse(savedInventory);
            this.renderInventory();
        }
    }

    toggleChatbot() {
        const chatbotPanel = document.getElementById('chatbotPanel');
        chatbotPanel.classList.toggle('hidden');
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        const message = chatInput.value.trim();

        if (message) {
            // Add user message
            this.addChatMessage('user', message);

            // Process and respond
            const response = this.processChatbotMessage(message);

            // Add chatbot response
            setTimeout(() => {
                this.addChatMessage('chatbot', response);
            }, 500);

            // Clear input
            chatInput.value = '';
        }
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    processChatbotMessage(message) {
        const lowerMessage = message.toLowerCase();
        const keywords = {
            'help': 'I can help you with inventory management. You can add, edit, or delete items.',
            'add item': 'Click the "Add New Item" button to add a new product to your inventory.',
            'total items': `You currently have ${this.inventory.length} items in your inventory.`,
            'total value': `Total inventory value: $${this.calculateTotalInventoryValue().toFixed(2)}`,
            'how many': 'I can help you count items or provide inventory statistics.',
            'delete': 'You can delete items by clicking the delete button next to each item.'
        };

        for (const [keyword, response] of Object.entries(keywords)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        return "I'm not sure I understand. Could you rephrase your question about the inventory system?";
    }

    calculateTotalInventoryValue() {
        return this.inventory.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

// Initialize the inventory system
const inventorySystem = new InventorySystem();

// Expose the instance globally for event handlers
window.inventorySystem = inventorySystem;
