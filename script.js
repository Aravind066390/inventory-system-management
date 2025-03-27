document.addEventListener("DOMContentLoaded", function () {
    const itemList = []; // Store inventory items

    // Elements
    const chatInput = document.getElementById("chatInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const themeToggle = document.getElementById("themeToggle");
    
    // Dark Mode Toggle
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });

    function getChatbotResponse(message) {
        message = message.toLowerCase();

        if (message.includes("add") && message.includes("item")) {
            return "Sure! Please enter the item name and quantity (e.g., Add item: Apple, 5).";
        } 
        else if (message.startsWith("add item:")) {
            const details = message.replace("add item:", "").trim();
            const [name, quantity] = details.split(",");
            
            if (!name || isNaN(quantity)) {
                return "Invalid format. Use: Add item: <name>, <quantity>";
            }
            
            itemList.push({ name: name.trim(), quantity: parseInt(quantity.trim()) });
            return `✅ Item "${name.trim()}" with quantity ${quantity.trim()} added successfully!`;
        } 
        else if (message.includes("show inventory")) {
            return itemList.length === 0 
                ? "📦 Your inventory is empty." 
                : "📦 Inventory:\n" + itemList.map(item => `${item.name} - ${item.quantity}`).join("\n");
        } 
        else if (message.includes("remove item:")) {
            const nameToRemove = message.replace("remove item:", "").trim();
            const index = itemList.findIndex(item => item.name.toLowerCase() === nameToRemove.toLowerCase());

            if (index !== -1) {
                itemList.splice(index, 1);
                return `🗑️ Item "${nameToRemove}" removed from inventory.`;
            } else {
                return `❌ Item "${nameToRemove}" not found in inventory.`;
            }
        }
        else {
            return "🤖 I'm not sure how to help with that. Try asking about adding, editing, or deleting items.";
        }
    }

    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
    }

    function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        addMessageToChat("user", userMessage);
        setTimeout(() => {
            const botResponse = getChatbotResponse(userMessage);
            addMessageToChat("bot", botResponse);
        }, 500); 

        chatInput.value = ""; 
    }

    sendMessageButton.addEventListener("click", handleSendMessage);
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") handleSendMessage();
    });
});
