document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const chatToggleBtn = document.getElementById("chatToggleBtn");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const closeChatButton = document.getElementById("closeChatButton");
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const body = document.body;

    // Toggle chat visibility
    chatToggleBtn.addEventListener("click", () => {
        chatbotContainer.style.display = chatbotContainer.style.display === "block" ? "none" : "block";
    });

    closeChatButton.addEventListener("click", () => {
        chatbotContainer.style.display = "none";
    });

    // Toggle Dark/Light Mode
    themeToggleBtn.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        themeToggleBtn.innerHTML = body.classList.contains("dark-mode") ? "🌙" : "☀";
    });

    // Handle Chatbot Responses
    function getChatbotResponse(message) {
        message = message.toLowerCase();

        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! How can I help you with your inventory management today?";
        } else if (message.includes('add') && message.includes('item')) {
            return "To add a new item, click the 'Add New Item' button at the top of the page, fill in the details, and click 'Add Item'.";
        } else if (message.includes('delete') || message.includes('remove')) {
            return "To delete an item, find it in the inventory list and click the 'Delete' button in the Actions column.";
        } else if (message.includes('edit') || message.includes('update')) {
            return "To edit an item, first click 'View' next to the item in the inventory list, then click 'Edit Details' in the detail panel.";
        } else if (message.includes('search')) {
            return "To search for items, type in the search bar at the top and press Enter or click the 'Search' button.";
        } else if (message.includes('dark') || message.includes('light') || message.includes('theme')) {
            return "You can toggle between dark and light themes by clicking the sun/moon icon in the top-right corner.";
        } else if (message.includes('quantity')) {
            return "You can update item quantity by viewing the item details and using the + and - buttons next to the quantity field.";
        } else if (message.includes('thank')) {
            return "You're welcome! Feel free to ask if you need any more help with your inventory.";
        } else if (message.includes('help')) {
            return "I can help you with: adding items, editing items, deleting items, searching inventory, changing themes, and managing quantities.";
        } else if (message.includes('improvement') || message.includes('struck') || message.includes('slow')) {
            return "We will try to develop it further and make it more suitable and user-friendly. Sorry for the inconvenience.";
        } else if (message.includes('feature')) {
            return "This is a simple inventory management system. We promise more features in future updates.";
        } else if (message.includes('description')) {
            return "To see an item's description, search for the item and press 'View'.";
        } else if (message.includes('price') || message.includes('money') || message.includes('cost')) {
            return "The price displayed is for a single quantity. Press the 'View' icon to see the total price based on quantity.";
        } else if (message.includes('image') || message.includes('photo')) {
            return "You can upload an image to make item identification easier.";
        } else if (message.includes('currency')) {
            return "This system is based on Indian currency (INR).";
        } else if (message.includes('team')) {
            return "Aravind is the leader, with Karan, Aditya, and Abdul as colleagues.";
        } else if (message.includes('comment') || message.includes('feedback')) {
            return "You can provide feedback by calling 6366739780. We appreciate any suggestions for improvement.";
        } else if (message.includes('useless')) {
            return "Sorry for the inconvenience. We will improve in future updates.";
        } else {
            return "I'm not sure how to help with that. Try asking about adding, editing, or deleting items, searching the inventory, or changing the theme.";
        }
    }

    // Function to add message to chat window
    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
    }

    // Handle sending message
    function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        addMessageToChat("user", userMessage);
        setTimeout(() => {
            const botResponse = getChatbotResponse(userMessage);
            addMessageToChat("bot", botResponse);
        }, 500); // Simulate bot thinking delay

        chatInput.value = ""; // Clear input field
    }

    // Event listeners for chat
    sendMessageButton.addEventListener("click", handleSendMessage);
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") handleSendMessage();
    });
});
