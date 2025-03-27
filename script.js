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
    class InventoryAssistant {
    constructor(inventoryManager) {
        this.inventoryManager = inventoryManager;
        this.conversationContext = {
            lastQuery: null,
            queryCount: 0,
            userInterests: new Set()
        };
        this.initializeKnowledgeBase();
        this.setupNaturalLanguageProcessing();
    }

    // Initialize Comprehensive Knowledge Base
    initializeKnowledgeBase() {
        this.knowledgeBase = {
            // Inventory Management Insights
            insights: [
                "Regularly update your inventory to maintain accuracy.",
                "Consider setting reorder points for critical items.",
                "Track seasonal variations in your inventory.",
                "Use data-driven insights to optimize stock levels."
            ],

            // Advanced Inventory Strategies
            strategies: [
                "Implement just-in-time inventory management.",
                "Use ABC analysis to prioritize inventory items.",
                "Consider demand forecasting techniques.",
                "Integrate inventory management with sales data."
            ],

            // Contextual Response Templates
            responseTemplates: {
                total_value: [
                    "Your total inventory value is ${value}.",
                    "Current inventory worth: ${value}.",
                    "Total stock valuation: ${value}."
                ],
                item_analysis: [
                    "You have ${count} items with average price of ${avgPrice}.",
                    "${count} unique items in your inventory.",
                    "Inventory snapshot: ${count} items, average unit price: ${avgPrice}."
                ]
            }
        };
    }

    // Advanced Natural Language Processing Setup
    setupNaturalLanguageProcessing() {
        this.intentMatchers = {
            greetings: [
                /\b(hi|hello|hey|greetings)\b/i,
                /\b(what can you do|help|assist)\b/i
            ],
            inventory_value: [
                /\b(total value|inventory worth|stock value)\b/i,
                /\b(how much is my inventory|total stock)\b/i
            ],
            item_count: [
                /\b(how many items|total items|item count)\b/i,
                /\b(number of products|inventory size)\b/i
            ],
            low_stock: [
                /\b(low stock|running low|need to restock)\b/i,
                /\b(inventory levels|stock levels)\b/i
            ]
        };
    }

    // Advanced Intent Recognition
    recognizeIntent(message) {
        for (const [intent, patterns] of Object.entries(this.intentMatchers)) {
            if (patterns.some(pattern => pattern.test(message))) {
                return intent;
            }
        }
        return 'default';
    }

    // Generate Intelligent Response
    generateResponse(intent, message) {
        const inventory = this.inventoryManager.inventory;
        
        // Context Tracking
        this.conversationContext.queryCount++;
        this.conversationContext.lastQuery = intent;
        this.conversationContext.userInterests.add(intent);

        // Response Generation
        switch(intent) {
            case 'greetings':
                return this.getGreetingResponse();
            
            case 'inventory_value':
                return this.getInventoryValueResponse(inventory);
            
            case 'item_count':
                return this.getItemCountResponse(inventory);
            
            case 'low_stock':
                return this.getLowStockResponse(inventory);
            
            default:
                return this.getDefaultResponse();
        }
    }

    // Specific Response Generators
    getGreetingResponse() {
        const greetings = [
            "Hello! I'm your Inventory Assistant. How can I help you today?",
            "Hi there! Ready to manage your inventory efficiently?",
            "Greetings! What would you like to know about your inventory?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getInventoryValueResponse(inventory) {
        const totalValue = inventory.reduce((total, item) => 
            total + (parseFloat(item.price) * parseFloat(item.quantity)), 0);
        
        const templates = this.knowledgeBase.responseTemplates.total_value;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return template.replace('${value}', `$${totalValue.toFixed(2)}`);
    }

    getItemCountResponse(inventory) {
        const count = inventory.length;
        const avgPrice = inventory.reduce((total, item) => 
            total + parseFloat(item.price), 0) / count || 0;
        
        const templates = this.knowledgeBase.responseTemplates.item_analysis;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return template
            .replace('${count}', count)
            .replace('${avgPrice}', `$${avgPrice.toFixed(2)}`);
    }

    getLowStockResponse(inventory) {
        const lowStockItems = inventory.filter(item => 
            parseFloat(item.quantity) < 5 && parseFloat(item.quantity) > 0);
        
        if (lowStockItems.length === 0) {
            return "Great news! No items are currently low on stock.";
        }
        
        const itemList = lowStockItems.map(item => 
            `${item.name}: Only ${item.quantity} remaining`).join('\n');
        
        return `Low Stock Alert:\n${itemList}`;
    }

    getDefaultResponse() {
        const defaultResponses = [
            "I'm not sure I understand. Could you rephrase that?",
            "I can help with inventory-related questions. Try asking about total value, item count, or low stock.",
            "Sorry, I didn't catch that. Can you be more specific about your inventory?"
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Process User Message
    processMessage(message) {
        const intent = this.recognizeIntent(message);
        return this.generateResponse(intent, message);
    }
}

class InventoryManager {
    constructor() {
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.chatbot = new InventoryAssistant(this);
        this.initializeEventListeners();
        this.renderInventory();
        this.setupThemeToggle();
    }

    // Existing methods remain the same...

    // Updated Chatbot Initialization in Send Message
    sendChatbotMessage = () => {
        const input = document.getElementById('chatbotInput');
        const messagesContainer = document.getElementById('chatbotMessages');

        if (input.value.trim() === '') return;

        // User Message
        const userMessageEl = document.createElement('div');
        userMessageEl.classList.add('user-message');
        userMessageEl.textContent = `You: ${input.value}`;
        messagesContainer.appendChild(userMessageEl);

        // Bot Response
        const botMessageEl = document.createElement('div');
        botMessageEl.classList.add('bot-message');
        
        // Process user message through the chatbot
        const botResponse = this.chatbot.processMessage(input.value);
        
        botMessageEl.textContent = `Assistant: ${botResponse}`;
        messagesContainer.appendChild(botMessageEl);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Clear input
        input.value = '';
    }
}

// Initialize the Inventory Manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new InventoryManager();
});

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
