// Inventory Management System
class InventoryManager {
    constructor() {
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.initializeEventListeners();
        this.renderInventory();
        this.initializeChatbot();
        this.setupThemeToggle();
    }

    // Initialize Event Listeners
    initializeEventListeners() {
        document.getElementById('inventoryForm').addEventListener('submit', this.addItem.bind(this));
        document.getElementById('chatbotIcon').addEventListener('click', this.toggleChatbot);
        document.getElementById('closeChatbot').addEventListener('click', this.toggleChatbot);
        document.getElementById('sendChatbotMessage').addEventListener('click', this.sendChatbotMessage);
        
        // Delegate event for dynamic action buttons
        document.getElementById('inventoryList').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                this.deleteItem(e.target.closest('tr').dataset.id);
            } else if (e.target.classList.contains('edit-btn')) {
                this.openEditModal(e.target.closest('tr').dataset.id);
            }
        });

        // Edit Modal Event Listeners
        const editModal = document.getElementById('editModal');
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        document.getElementById('editForm').addEventListener('submit', this.updateItem.bind(this));
    }

    // Add Item to Inventory
    addItem(e) {
        e.preventDefault();
        const name = document.getElementById('itemName').value;
        const quantity = document.getElementById('itemQuantity').value;
        const price = document.getElementById('itemPrice').value;
        const date = document.getElementById('itemDate').value;
        const imageInput = document.getElementById('itemImage');

        // Handle image upload
        const reader = new FileReader();
        reader.onload = (event) => {
            const item = {
                id: Date.now().toString(),
                name,
                quantity,
                price,
                date,
                image: event.target.result
            };

            this.inventory.push(item);
            this.saveInventory();
            this.renderInventory();
            e.target.reset(); // Reset form
        };

        // Read image if selected, otherwise use default
        if (imageInput.files.length > 0) {
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            // Generate placeholder image
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#3498db';
            ctx.fillRect(0, 0, 100, 100);
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(name, 50, 50);
            
            const item = {
                id: Date.now().toString(),
                name,
                quantity,
                price,
                date,
                image: canvas.toDataURL()
            };

            this.inventory.push(item);
            this.saveInventory();
            this.renderInventory();
            e.target.reset(); // Reset form
        }
    }

    // Render Inventory Table
    renderInventory() {
        const inventoryList = document.getElementById('inventoryList');
        inventoryList.innerHTML = ''; // Clear existing entries

        this.inventory.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" class="item-image"></td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price}</td>
                <td>${item.date}</td>
                <td class="action-buttons">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            inventoryList.appendChild(row);
        });
    }

    // Delete Item
    deleteItem(id) {
        this.inventory = this.inventory.filter(item => item.id !== id);
        this.saveInventory();
        this.renderInventory();
    }

    // Open Edit Modal
    openEditModal(id) {
        const item = this.inventory.find(item => item.id === id);
        if (!item) return;

        const editModal = document.getElementById('editModal');
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemQuantity').value = item.quantity;
        document.getElementById('editItemPrice').value = item.price;
        
        // Store current item ID for update
        editModal.dataset.currentId = id;
        
        editModal.style.display = 'block';
    }

    // Update Item
    updateItem(e) {
        e.preventDefault();
        const id = document.getElementById('editModal').dataset.currentId;
        const itemIndex = this.inventory.findIndex(item => item.id === id);

        if (itemIndex === -1) return;

        const imageInput = document.getElementById('editItemImage');
        
        const updateItem = () => {
            this.inventory[itemIndex].name = document.getElementById('editItemName').value;
            this.inventory[itemIndex].quantity = document.getElementById('editItemQuantity').value;
            this.inventory[itemIndex].price = document.getElementById('editItemPrice').value;
            
            this.saveInventory();
            this.renderInventory();
            
            // Close modal
            document.getElementById('editModal').style.display = 'none';
        };

        // Handle image update
        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.inventory[itemIndex].image = event.target.result;
                updateItem();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            updateItem();
        }
    }

    // Save Inventory to Local Storage
    saveInventory() {
        localStorage.setItem('inventory', JSON.stringify(this.inventory));
    }

    // Chatbot Functionality
    initializeChatbot() {
        this.chatbotMessages = [];
        this.chatbotResponses = [
            "Welcome to Inventory Assistant! I can help you manage your inventory.",
            "To add an item, fill out the form above and click 'Add Item'.",
            "You can edit or delete items using the buttons in the Actions column.",
            "Need help tracking stock levels? I'm here to assist!",
            "Want to know your total inventory value? Just ask!",
            "Tips for inventory management: regularly update your stock, set reorder points.",
            "Remember to keep your inventory data accurate and up-to-date."
        ];
    }

    // Toggle Chatbot
    toggleChatbot = () => {
        const chatbotModal = document.getElementById('chatbotModal');
        chatbotModal.style.display = chatbotModal.style.display === 'block' ? 'none' : 'block';
    }

    // Send Chatbot Message
    sendChatbotMessage = () => {
        const input = document.getElementById('chatbotInput');
        const messagesContainer = document.getElementById('chatbotMessages');

        if (input.value.trim() === '') return;

        // User Message
        const userMessageEl = document.createElement('div');
        userMessageEl.textContent = `You: ${input.value}`;
        messagesContainer.appendChild(userMessageEl);

        // Bot Response
        const botMessageEl = document.createElement('div');
        const randomResponse = this.chatbotResponses[Math.floor(Math.random() * this.chatbotResponses.length)];
        botMessageEl.textContent = `Assistant: ${randomResponse}`;
        messagesContainer.appendChild(botMessageEl);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Clear input
        input.value = '';
    }

    // Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        // Check for saved theme
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Update icon
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// Initialize the Inventory Manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new InventoryManager();
});
