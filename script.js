// Global variables
let currentItemIndex = -1;
let isDarkMode = false;

// DOM Element Selectors
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatInput = document.getElementById('chatInput');
const chatbotMessages = document.getElementById('chatbotMessages');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('searchButton');
const resetButton = document.getElementById('resetButton');
const inventoryForm = document.getElementById('inventoryForm');
const editForm = document.getElementById('editForm');

// Chatbot Functionality
function toggleChatbot() {
  chatbotContainer.style.display = 
    chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '' 
      ? 'flex' 
      : 'none';
}

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

function addMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
  messageElement.textContent = message;
  chatbotMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function processMessage(message) {
  message = message.toLowerCase();
  
  // Comprehensive response mapping
  const responses = {
    'hello': "Hello! How can I help you with your inventory management today?",
    'hi': "Hi there! What can I do for you?",
    'hey': "Hey! Ready to manage your inventory?",
    'add item': "To add a new item, click the 'Add New Item' button, fill in the details, and click 'Add Item'.",
    'delete': "To delete an item, find it in the inventory list and click the 'Remove' button in the Actions column.",
    'edit': "To edit an item, click 'View' next to the item, then click 'Edit Details' in the detail panel.",
    'search': "To search for items, type in the search bar and press Enter or click the 'Search' button.",
    'theme': "Toggle between dark and light themes by clicking the sun/moon icon in the top-right corner.",
    'quantity': "Update item quantity by viewing the item details and using the + and - buttons.",
    'help': "I can help with: adding items, editing items, deleting items, searching inventory, changing themes, and managing quantities.",
    'improvement': "We're continuously working to improve the system and make it more user-friendly.",
    'feature': "This is a simple inventory management system. More advanced features are planned for future updates.",
    'description': "Item descriptions can be viewed by clicking 'View' on an item in the inventory list.",
    'price': "Prices are displayed per item quantity. Total value is shown in the item details.",
    'image': "You can upload an image URL for each item to help identify it easily.",
    'currency': "The system uses Indian Rupees (INR) as the default currency.",
    'feedback': "We welcome your feedback! Contact us at +91-6366739780 or through our feedback page."
  };

  // Check for exact matches first
  for (const [key, response] of Object.entries(responses)) {
    if (message.includes(key)) return response;
  }

  // Fallback response
  return "I'm not sure how to help with that. Try asking about inventory management features.";
}

// Event Listeners for Chatbot
chatToggleBtn.addEventListener('click', toggleChatbot);
chatInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Theme Toggle Functionality
function toggleTheme() {
  isDarkMode ? disableDarkMode() : enableDarkMode();
}

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  themeToggleBtn.querySelector('.theme-toggle-icon').textContent = '🌙';
  isDarkMode = true;
  localStorage.setItem('theme', 'dark');
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  themeToggleBtn.querySelector('.theme-toggle-icon').textContent = '☀';
  isDarkMode = false;
  localStorage.setItem('theme', 'light');
}

// Inventory Management
function saveItem(item) {
  const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
  storedItems.push(item);
  localStorage.setItem('inventory', JSON.stringify(storedItems));
  addItemToInventory(item, storedItems.length - 1);
}

function addItemToInventory(item, index) {
  const tableBody = document.querySelector('#inventoryTable tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="clickable" onclick="viewItemDetails(${index})">${item.name}</td>
    <td>${item.quantity}</td>
    <td>₹${parseFloat(item.price).toFixed(2)}</td>
    <td class="actions">
      <button class="view-button" onclick="viewItemDetails(${index})">View</button>
      <button onclick="removeItem(this, ${index})">Remove</button>
    </td>
  `;
  tableBody.appendChild(row);
}

function viewItemDetails(index) {
  const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
  if (index >= 0 && index < storedItems.length) {
    const item = storedItems[index];
    currentItemIndex = index;
    document.getElementById('formPanel').style.display = 'none';
    document.getElementById('detailPanel').style.display = 'block';
    refreshDetailView(item);
  }
}

function refreshDetailView(item) {
  document.getElementById('detail-title').textContent = item.name;
  document.getElementById('detail-description').textContent = item.description || 'No description';
  document.getElementById('detail-price').textContent = `₹${parseFloat(item.price).toFixed(2)}`;
  document.getElementById('detail-quantity').value = item.quantity;
  document.getElementById('detail-total').textContent = `₹${(item.price * item.quantity).toFixed(2)}`;
  
  const imgElement = document.getElementById('detail-image');
  imgElement.src = item.image || 'https://via.placeholder.com/200x150?text=No+Image';
  imgElement.onerror = () => {
    imgElement.src = 'https://via.placeholder.com/200x150?text=No+Image';
  };

  // Populate edit form
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-description').value = item.description || '';
  document.getElementById('edit-price').value = item.price;
  document.getElementById('edit-quantity').value = item.quantity;
  document.getElementById('edit-image').value = item.image || '';
}

function searchItem() {
  const searchTerm = searchBar.value.toLowerCase();
  const rows = document.querySelectorAll('#inventoryTable tbody tr');
  
  rows.forEach(row => {
    const itemName = row.cells[0].textContent.toLowerCase();
    row.style.display = itemName.includes(searchTerm) ? '' : 'none';
  });
}

function removeItem(button, index) {
  const row = button.closest('tr');
  row.remove();
  
  const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
  storedItems.splice(index, 1);
  localStorage.setItem('inventory', JSON.stringify(storedItems));
  
  if (currentItemIndex === index) {
    hideDetailPanel();
  }
  
  refreshInventoryTable();
}

function refreshInventoryTable() {
  const tableBody = document.querySelector('#inventoryTable tbody');
  tableBody.innerHTML = '';
  const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
  storedItems.forEach((item, index) => {
    addItemToInventory(item, index);
  });
}

function resetInventory() {
  if (confirm('Are you sure you want to reset? This will clear all inventory data.')) {
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';
    localStorage.removeItem('inventory');
    alert('Inventory has been reset.');
  }
}

// Form Submission Handlers
inventoryForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const newItem = {
    name: document.getElementById('item-name').value,
    quantity: parseInt(document.getElementById('item-quantity').value),
    price: parseFloat(document.getElementById('item-price').value),
    description: document.getElementById('item-description').value || 'No description',
    image: document.getElementById('item-image').value || null
  };
  
  saveItem(newItem);
  clearForm();
  toggleFormPanel();
});

editForm.addEventListener('submit', function(event) {
  event.preventDefault();
  if (currentItemIndex >= 0) {
    const updatedItem = {
      name: document.getElementById('edit-name').value,
      description: document.getElementById('edit-description').value,
      price: parseFloat(document.getElementById('edit-price').value),
      quantity: parseInt(document.getElementById('edit-quantity').value),
      image: document.getElementById('edit-image').value
    };
    
    updateItem(currentItemIndex, updatedItem);
    switchToReadMode();
    refreshDetailView(updatedItem);
  }
});

// Utility Functions
function updateItem(index, updatedItem) {
  const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
  if (index >= 0 && index < storedItems.length) {
    storedItems[index] = updatedItem;
    localStorage.setItem('inventory', JSON.stringify(storedItems));
    refreshInventoryTable();
  }
}

function toggleFormPanel() {
  const formPanel = document.getElementById('formPanel');
  const detailPanel = document.getElementById('detailPanel');
  
  formPanel.style.display = 
    formPanel.style.display === 'none' || formPanel.style.display === '' 
      ? 'block' 
      : 'none';
  
  detailPanel.style.display = 'none';
}

function clearForm() {
  document.getElementById('item-name').value = '';
  document.getElementById('item-quantity').value = '';
  document.getElementById('item-price').value = '';
  document.getElementById('item-description').value = '';
  document.getElementById('item-image').value = '';
}

function switchToEditMode() {
  const detailPanel = document.getElementById('detailPanel');
  detailPanel.classList.remove('detail-view');
  detailPanel.classList.add('detail-edit');
}

function switchToReadMode() {
  const detailPanel = document.getElementById('detailPanel');
  detailPanel.classList.remove('detail-edit');
  detailPanel.classList.add('detail-view');
}

function hideDetailPanel() {
  const detailPanel = document.getElementById('detailPanel');
  detailPanel.style.display = 'none';
  currentItemIndex = -1;
}

function cancelEdit() {
  switchToReadMode();
  const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
  if (currentItemIndex >= 0 && currentItemIndex < storedItems.length) {
    refreshDetailView(storedItems[currentItemIndex]);
  }
}

function increaseQuantity() {
  if (currentItemIndex >= 0) {
    const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
    if (currentItemIndex < storedItems.length) {
      storedItems[currentItemIndex].quantity++;
      localStorage.setItem('inventory', JSON.stringify(storedItems));
      refreshDetailView(storedItems[currentItemIndex]);
      refreshInventoryTable();
    }
  }
}

function decreaseQuantity() {
  if (currentItemIndex >= 0) {
    const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
    if (currentItemIndex < storedItems.length && storedItems[currentItemIndex].quantity > 0) {
      storedItems[currentItemIndex].quantity--;
      localStorage.setItem('inventory', JSON.stringify(storedItems));
      refreshDetailView(storedItems[currentItemIndex]);
      refreshInventoryTable();
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load saved items
  const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
  storedItems.forEach((item, index) => {
    addItemToInventory(item, index);
  });
  
  // Load theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    enableDarkMode();
  }
  
  // Hide chatbot initially
  chatbotContainer.style.display = 'none';
  
  // Event Listeners
  themeToggleBtn.addEventListener('click', toggleTheme);
  searchButton.addEventListener('click', searchItem);
  resetButton.addEventListener('click', resetInventory);
});
