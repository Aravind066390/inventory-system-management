document.addEventListener("DOMContentLoaded", function () {
    const chatToggleBtn = document.getElementById("chatToggleBtn");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const closeChatButton = document.getElementById("closeChatButton");
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const chatbotMessages = document.getElementById("chatbotMessages");

    // Toggle chatbot visibility
    chatToggleBtn.addEventListener("click", function () {
        chatbotContainer.style.display = "block";
    });

    closeChatButton.addEventListener("click", function () {
        chatbotContainer.style.display = "none";
    });

    // Chatbot response function
    function getChatbotResponse(message) {
        message = message.toLowerCase();

        if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
            return "Hello! How can I help you with your inventory management today?";
        } else if (message.includes("add") && message.includes("item")) {
            return "To add a new item, click the 'Add New Item' button at the top of the page, fill in the details, and click 'Add Item'.";
        } else if (message.includes("delete") || message.includes("remove")) {
            return "To delete an item, find it in the inventory list and click the 'Delete' button in the Actions column.";
        } else if (message.includes("edit") || message.includes("update")) {
            return "To edit an item, first click 'View' next to the item in the inventory list, then click 'Edit Details' in the detail panel.";
        } else if (message.includes("search")) {
            return "To search for items, type in the search bar at the top and press Enter or click the 'Search' button.";
        } else if (message.includes("dark") || message.includes("light") || message.includes("theme")) {
            return "You can toggle between dark and light themes by clicking the sun/moon icon in the top-right corner.";
        } else if (message.includes("quantity")) {
            return "You can update item quantity by viewing the item details and using the + and - buttons next to the quantity field.";
        } else if (message.includes("thank")) {
            return "You're welcome! Feel free to ask if you need any more help with your inventory.";
        } else if (message.includes("help")) {
            return "I can help you with: adding items, editing items, deleting items, searching inventory, changing themes, and managing quantities and some other basic tasks. What would you like to know about?";
        } else if (message.includes("improvement") || message.includes("struck") || message.includes("slow")) {
            return "We will try to develop it further and make it more suitable and user-friendly. Sorry for the inconvenience.";
        } else if (message.includes("feature")) {
            return "This is a simple inventory management system. For complex management and more user-friendly features, it's still under development. We promise more features in the future. Please use the features that are already available.";
        } else if (message.includes("description")) {
            return "It contains details about the stored items. Search for the item, press 'View', and you will find the description.";
        } else if (message.includes("price") || message.includes("money") || message.includes("cost")) {
            return "The price value displayed is for a single quantity. Press the 'View' icon to know its total price with respect to quantity.";
        } else if (message.includes("image") || message.includes("photo")) {
            return "You can upload a respective image to find the stored item easily.";
        } else if (message.includes("currency")) {
            return "The system is based on Indian currency (INR).";
        } else if (message.includes("team")) {
            return "Aravind is the leader, with Karan, Aditya, and Abdul as colleagues.";
        } else if (message.includes("comment") || message.includes("feedback")) {
            return "You can give your feedback to the number 6366739780. It will be known to the developer as soon as possible. We are willing to accept both positive and negative feedback and promise to improve in the future.";
        } else if (message.includes("useless")) {
            return "Sorry for the inconvenience. We will be better in the future with an improved version.";
        } else {
            return "I'm not sure how to help with that. Try asking about adding, editing, or deleting items, searching the inventory, or changing the theme.";
        }
    }

    // Function to display message in chat
    function displayMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Handle user input
    function handleUserInput() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        displayMessage("user", userMessage);
        setTimeout(() => {
            const botResponse = getChatbotResponse(userMessage);
            displayMessage("bot", botResponse);
        }, 500);

        chatInput.value = "";
    }

    sendMessageButton.addEventListener("click", handleUserInput);
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });
});
