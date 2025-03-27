// Inventory Management System Script

document.addEventListener('DOMContentLoaded', () => {
    const InventoryApp = {
        inventory: [],
        currentTheme: 'light',
        
        init() {
            this.cacheDOM();
            this.bindEvents();
            this.loadInitialData();
            this.initializeTheme();
            this.initializeChatbot();
        },

        cacheDOM() {
            // Existing DOM element selections
            this.inventoryForm = document.getElementById('inventoryForm');
            this.inventoryTable = document.getElementById('inventoryTable').querySelector('tbody');
            this.searchBar = document.getElementById('search-bar');
            this.searchButton = document.getElementById('searchButton');

            // Theme Toggle Elements
            this.themeToggleBtn = document.getElementById('themeToggleBtn');
            this.themeToggleIcon = this.themeToggleBtn.querySelector('.theme-toggle-icon');

            // Chatbot Elements
            this.chatToggleBtn = document.getElementById('chatToggleBtn');
            this.chatbotContainer = document.getElementById('chatbotContainer');
            this.chatbotMessages = document.getElementById('chatbotMessages');
            this.chatInput = document.getElementById('chatInput');
            this.sendMessageButton = document.getElementById('sendMessageButton');
            this.closeChatButton = document.getElementById('closeChatButton');

            // Other existing selections...
        },

        bindEvents() {
            // Existing event bindings...

            // Chatbot Events
            this.chatToggleBtn.addEventListener('click', this.toggleChatbot.bind(this));
            this.sendMessageButton.addEventListener('click', this.sendChatMessage.bind(this));
            this.chatInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
            this.closeChatButton.addEventListener('click', this.toggleChatbot.bind(this));
        },

        // Theme Management
        initializeTheme() {
            // Retrieve saved theme or default to light
            const savedTheme = localStorage.getItem('inventoryTheme') || 'light';
            this.applyTheme(savedTheme);
        },

        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
        },

        applyTheme(theme) {
            this.currentTheme = theme;
            
            // Detailed theme application
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
                
                // Specific theme modifications
                this.themeToggleIcon.textContent = '☀️';
                
                // Optionally, apply dark theme to specific elements
                this.applyDarkThemeToElements();
            } else {
                document.body.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
                
                this.themeToggleIcon.textContent = '🌙';
                
                // Optionally, reset specific element styles
                this.resetLightThemeElements();
            }
            
            // Save theme preference
            localStorage.setItem('inventoryTheme', theme);
        },

        applyDarkThemeToElements() {
            // Apply dark theme to specific elements
            const darkThemedElements = [
                this.inventoryTable,
                this.inventoryForm,
                this.chatbotContainer
            ];

            darkThemedElements.forEach(el => {
                if (el) {
                    el.classList.add('dark-theme-element');
                }
            });
        },

        resetLightThemeElements() {
            // Reset theme of specific elements
            const lightThemedElements = [
                this.inventoryTable,
                this.inventoryForm,
                this.chatbotContainer
            ];

            lightThemedElements.forEach(el => {
                if (el) {
                    el.classList.remove('dark-theme-element');
                }
            });
        },

        // Chatbot Functionality
        initializeChatbot() {
            // Initial bot welcome message
            this.addChatMessage('Welcome to the Inventory Assistant! How can I help you today?', 'bot');
        },

        toggleChatbot() {
            // Toggle chatbot visibility
            this.chatbotContainer.classList.toggle('open');
        },

        sendChatMessage() {
            const userMessage = this.chatInput.value.trim();
            if (!userMessage) return;

            // Add user message to chat
            this.addChatMessage(userMessage, 'user');
            
            // Clear input
            this.chatInput.value = '';

            // Generate bot response
            const botResponse = this.generateChatbotResponse(userMessage);
            
            // Add bot response after a short delay
            setTimeout(() => {
                this.addChatMessage(botResponse, 'bot');
            }, 500);
        },

        addChatMessage(message, sender) {
            const messageEl = document.createElement('div');
            messageEl.classList.add('message', `${sender}-message`);
            messageEl.textContent = message;
            
            this.chatbotMessages.appendChild(messageEl);
            
            // Scroll to bottom of messages
            this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
        },

        generateChatbotResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();

            // Inventory-related responses
            if (lowerMessage.includes('total value')) {
                const totalValue = this.inventory.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0);
                return `The total inventory value is $${totalValue.toFixed(2)}`;
            }

            if (lowerMessage.includes('number of items') || lowerMessage.includes('item count')) {
                return `You currently have ${this.inventory.length} different items in your inventory.`;
            }

            if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
                return "I can help you with inventory-related queries. Try asking about total inventory value, number of items, or specific item details.";
            }

            // Fallback response
            return "I'm not sure how to help with that. Could you please rephrase or ask something specific about the inventory?";
        },

        // Existing inventory management methods remain the same...
    };

    // Initialize the application
    InventoryApp.init();

    // Expose to global scope
    window.InventoryApp = InventoryApp;
});
