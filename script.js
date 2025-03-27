const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatInput = document.getElementById('chatInput');
const chatbotMessages = document.getElementById('chatbotMessages');

// Toggle chatbot visibility
function toggleChatbot() {
  if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
    chatbotContainer.style.display = 'flex';
  } else {
    chatbotContainer.style.display = 'none';
  }
}

// Initialize chatbot toggle button
chatToggleBtn.addEventListener('click', toggleChatbot);

// Send message to chatbot
function sendMessage() {
  const message = chatInput.value.trim();
  if (message === '') return;

  // Add user message to chat
  addMessage(message, 'user');

  // Clear input
  chatInput.value = '';

  // Process message and get response
  const response = processMessage(message);

  // Add bot response after a short delay
  setTimeout(() => {
    addMessage(response, 'bot');
  }, 500);
}

// Add message to chat
function addMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
  messageElement.textContent = message;
  chatbotMessages.appendChild(messageElement);

  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Process message and generate response
function processMessage(message) {
  message = message.toLowerCase();

  // Simple response mapping
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
  } 
  else if (message.includes('help')) {
    return "I can help you with: adding items, editing items, deleting items, searching inventory, changing themes, and managing quantities and some other basic tasks . What would you like to know about?";
  }
  else if (message.includes('improvement')) {
    return "we will try to develop it further and make it more suitable and  user friendly sorry for the inconvenience";
  } 
  else if (message.includes('struck')) {
    return "we will try to develop it further and make it more suitable and  user friendly sorry for the inconvenience";
  } 
  else if (message.includes('slow')) {
    return "we will try to develop it further and make it more suitable and  user friendly sorry for the inconvenience";
  } 
  else if (message.includes('feature')) {
    return "it is a simple inventory management system for complex management and more userfriendly features its still under development we promise more features in future please use the features which is already available ";
  } 
  else if (message.includes('description')) {
    return "it contains details about the stored items search the item press on view you will find the description";
  } 
  else if (message.includes('price')) {
    return "price value is displayed of just one quantity, press view icon to know its  total price with respect to quantity ";
  } 
  else if (message.includes('money')) {
    return "price value is displayed of just one quantity, press view icon to know its  total price with respect to quantity ";
  }
  else if (message.includes('cost')) {
    return "price value is displayed of just one quantity, press view icon to know its  total price with respect to quantity ";
  }
  else if (message.includes('image')) {
    return "you can upload respective image to find out stored image easily";
  }
  else if (message.includes('photo')) {
    return "you can upload respective image to find out stored image easily";
  }
  else if (message.includes('currency')) {
    return "it is based on indian currency (INR) ";
  }
  else if (message.includes('team')) {
    return "aravind as the leader karan,aditya,abdul as the colleague ";
  }
  else if (message.includes('comment')) {
    return "you can give your feed back to the number  6366739780 it will be known to the developer as soon as possible.Any negative or positive  feedback we are willing to accept and  we will promise to  make it a more improved version  ";
  }
  else if (message.includes('feedback')) {
    return "you can give your feed back to the number 6366739780 it will be known to the developer as soon as possible any negative or positive  feedback we are willing to accept and  we will promise to make it a more improved version";
  }
  else if (message.includes('useless')) {
    return "sorry for the inconvenience we will be better in future with improved version  ";
  }
  else {
    return "I'm not sure how to help with that. Try asking about adding, editing, or deleting items, searching the inventory, or changing the theme.";
  }
}

// Allow sending messages with Enter key
chatInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Make sure the chatbot is initially hidden
document.addEventListener('DOMContentLoaded', () => {
  chatbotContainer.style.display = 'none';
});
