document.addEventListener('DOMContentLoaded', function() {
    class InventorySystem {
        constructor() {
            this.inventory = [];
            this.initializeEventListeners();
        }

        initializeEventListeners() {
            // Add Item Modal
            const addItemBtn = document.getElementById('addItemBtn');
            const closeModalBtn = document.querySelector('.close');
            const addItemForm = document.getElementById('addItemForm');

            if (addItemBtn) {
                addItemBtn.addEventListener('click', () => this.openAddItemModal());
            }

            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => this.closeAddItemModal());
            }

            if (addItemForm) {
                addItemForm.addEventListener('submit', (e) => this.addItem(e));
            }

            // Chatbot
            const chatbotButton = document.getElementById('chatbotButton');
            const closeChatbot = document.getElementById('closeChatbot');
            const sendMessageBtn = document.getElementById('sendMessage');
            const userInput = document.getElementById('userInput');

            if (chatbotButton) {
                chatbotButton.addEventListener('click', () => this.toggleChatbot());
            }

            if (closeChatbot) {
                closeChatbot.addEventListener('click', () => this.toggleChatbot());
            }

            if (sendMessageBtn) {
                sendMessageBtn.addEventListener('click', () => this.handleChatbotMessage());
            }

            if (userInput) {
                userInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleChatbotMessage();
                });
            }
        }

        openAddItemModal() {
            const modal = document.getElementById('addItemModal');
            if (modal) modal.style.display = 'block';
        }

        closeAddItemModal() {
            const modal = document.getElementById('addItemModal');
            if (modal) modal.style.display = 'none';
        }

        addItem(event) {
            event.preventDefault();
            
            const name = document.getElementById('itemName').value;
            const date = document.getElementById('itemDate').value;
            const price = document.getElementById('itemPrice').value;
            const quantity = document.getElementById('itemQuantity').value;
            const imageInput = document.getElementById('itemImage');
            
            let imageUrl = 'https://via.placeholder.com/100';
            if (imageInput.files && imageInput.files[0]) {
                imageUrl = URL.createObjectURL(imageInput.files[0]);
            }

            const item = {
                id: Date.now(),
                name,
                date,
                price,
                quantity,
                imageUrl
            };

            this.inventory.push(item);
            this.renderInventory();
            this.closeAddItemModal();
            this.resetAddItemForm();
        }

        renderInventory() {
            const inventoryBody = document.getElementById('inventoryBody');
            if (!inventoryBody) return;

            inventoryBody.innerHTML = '';

            this.inventory.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.imageUrl}" alt="${item.name}" width="50" height="50"></td>
                    <td>${item.name}</td>
                    <td>${item.date}</td>
                    <td>$${parseFloat(item.price).toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button onclick="inventorySystem.editItem(${item.id})">Edit</button>
                        <button onclick="inventorySystem.deleteItem(${item.id})">Delete</button>
                    </td>
                `;
                inventoryBody.appendChild(row);
            });
        }

        editItem(id) {
            const item = this.inventory.find(i => i.id === id);
            if (item) {
                this.openAddItemModal();
                document.getElementById('itemName').value = item.name;
                document.getElementById('itemDate').value = item.date;
                document.getElementById('itemPrice').value = item.price;
                document.getElementById('itemQuantity').value = item.quantity;
                
                // Remove the existing item
                this.inventory = this.inventory.filter(i => i.id !== id);
            }
        }

        deleteItem(id) {
            this.inventory = this.inventory.filter(item => item.id !== id);
            this.renderInventory();
        }

        resetAddItemForm() {
            const form = document.getElementById('addItemForm');
            if (form) form.reset();
        }

        toggleChatbot() {
            const chatbotPanel = document.getElementById('chatbotPanel');
            if (chatbotPanel) {
                chatbotPanel.style.display = chatbotPanel.style.display === 'block' ? 'none' : 'block';
            }
        }

        handleChatbotMessage() {
            const userInput = document.getElementById('userInput');
            const chatMessages = document.getElementById('chatMessages');
            
            if (!userInput || !chatMessages) return;

            const message = userInput.value.trim();

            if (message) {
                // User message
                const userMessageEl = document.createElement('div');
                userMessageEl.classList.add('user-message');
                userMessageEl.textContent = message;
                chatMessages.appendChild(userMessageEl);

                // Chatbot response
                const botMessageEl = document.createElement('div');
                botMessageEl.classList.add('bot-message');
                
                // Simple keyword-based responses
                const responses = {
                    'help': 'I can help you with inventory management. Ask about adding items, viewing inventory, or specific item details.',
                    'add item': 'Click the "Add Item" button to add a new item to the inventory.',
                    'edit': 'You can edit an item by clicking the "Edit" button next to each item in the inventory table.',
                    'delete': 'To delete an item, click the "Delete" button next to the item you want to remove.',
                    'inventory': `Current inventory has ${this.inventory.length} items.`
                };

                const lowercaseMessage = message.toLowerCase();
                let response = 'I\'m not sure I understand. Try asking about inventory help, adding items, or editing items.';

                for (const [keyword, botResponse] of Object.entries(responses)) {
                    if (lowercaseMessage.includes(keyword)) {
                        response = botResponse;
                        break;
                    }
                }

                botMessageEl.textContent = response;
                chatMessages.appendChild(botMessageEl);

                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Clear input
                userInput.value = '';
            }
        }
    }

    // Initialize the inventory system
    window.inventorySystem = new InventorySystem();
});
