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
  } else if (message.includes('help')) {
    return "I can help you with: adding items, editing items, deleting items, searching inventory, changing themes, and managing quantities. What would you like to know about?";
  } else if (message.includes('improvement')) {
    return "we will try to develop it further and make it more suitable and  user friendly soory for the inconvenience";
  } 

else if (message.includes('struck')) {
    return "we will try to develop it further and make it more suitable and  user friendly sorry for the inconvenience";
  } 

else if (message.includes('slow')) {
    return "we will try to develop it further and make it more suitable and  user friendly sorry for the inconvenience";
  } 
else if (message.includes('feature')) {
    return "it is a simple inventory management system for complex management and more userfriendly features its still under under development we promise more features in future please use the features which is already available ";
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
    return "it is based on indian currency";
  }
else if (message.includes('team')) {
    return "aravind as the leader karan,aditya,abdul as the colleague ";
  }
else if (message.includes('comment')) {
    return "you can give your feed back to the number 6366739780 it will be known to the developer as soon as possible any negative or positive  feedback we are willing to accept and  we will promise to  make it a more improved version  ";
  }
else if (message.includes('feedback')) {
    return "you can give your feed back to the number <a href="6366739780">6366739780</a> it will be known to the developer as soon as possible any negative or positive  feedback we are willing to accept and  we will promise to make it a more improved version or the feedback form is available ";
  }
else if (message.includes('useless')) {
    return "sorry for the inconvenience we will be better in future with improved version  ";
  } else {
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
    // Global variables
    let currentItemIndex = -1;
    let isDarkMode = false;
    
    // Load inventory data and theme preference from localStorage on page load
    window.onload = function() {
      const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
      storedItems.forEach((item, index) => {
        addItemToInventory(item, index);
      });
      
      // Load theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        enableDarkMode();
      }
    };
    
    // Toggle between light and dark mode
    function toggleTheme() {
      if (isDarkMode) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
    }
    
    // Enable dark mode
    function enableDarkMode() {
      document.body.classList.add('dark-mode');
      document.querySelector('.theme-toggle-icon').textContent = '🌙';
      isDarkMode = true;
      localStorage.setItem('theme', 'dark');
    }
    
    // Disable dark mode
    function disableDarkMode() {
      document.body.classList.remove('dark-mode');
      document.querySelector('.theme-toggle-icon').textContent = '☀';
      isDarkMode = false;
      localStorage.setItem('theme', 'light');
    }
    
    // Handle form submission for new items
    document.getElementById('inventoryForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const itemName = document.getElementById('item-name').value;
      const itemQuantity = document.getElementById('item-quantity').value;
      const itemPrice = document.getElementById('item-price').value;
      const itemDescription = document.getElementById('item-description').value;
      const itemImage = document.getElementById('item-image').value;
      if (itemName && itemQuantity && itemPrice) {
        const newItem = {
          name: itemName,
          quantity: parseInt(itemQuantity),
          price: parseFloat(itemPrice),
          description: itemDescription || 'No description available',
          image: itemImage || 'placeholder.jpg'
        };
        // Save to localStorage and update display
        saveItem(newItem);
        clearForm();
        toggleFormPanel();
      } else {
        alert('Please fill out all required fields');
      }
    });
    // Handle form submission for editing items
    document.getElementById('editForm').addEventListener('submit', function(event) {
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
    // Function to add item to inventory list
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
    // Function to view item details
    function viewItemDetails(index) {
      const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
      if (index >= 0 && index < storedItems.length) {
        const item = storedItems[index];
        currentItemIndex = index;
        // Switch to detail panel
        document.getElementById('formPanel').style.display = 'none';
        document.getElementById('detailPanel').style.display = 'block';
        // Make sure we're in read mode
        document.getElementById('detailPanel').classList.remove('detail-edit');
        document.getElementById('detailPanel').classList.add('detail-view');
        // Update detail view with item data
        refreshDetailView(item);
      }
    }
    // Refresh the detail view with current item data
    function refreshDetailView(item) {
      document.getElementById('detail-title').textContent = item.name;
      document.getElementById('detail-description').textContent = item.description;
      document.getElementById('detail-price').textContent = `₹${parseFloat(item.price).toFixed(2)}`;
      document.getElementById('detail-quantity').value = item.quantity;
      document.getElementById('detail-total').textContent = `₹${(item.price * item.quantity).toFixed(2)}`;
      // Set image src with fallback
      const imgElement = document.getElementById('detail-image');
      imgElement.src = item.image;
      imgElement.onerror = function() {
        this.src = 'https://via.placeholder.com/200x150?text=No+Image';
      };
      // Set edit form values as well
      document.getElementById('edit-name').value = item.name;
      document.getElementById('edit-description').value = item.description;
      document.getElementById('edit-price').value = item.price;
      document.getElementById('edit-quantity').value = item.quantity;
      document.getElementById('edit-image').value = item.image;
    }
    // Switch to edit mode for details
    function switchToEditMode() {
      document.getElementById('detailPanel').classList.remove('detail-view');
      document.getElementById('detailPanel').classList.add('detail-edit');
    }
    // Switch back to read mode for details
    function switchToReadMode() {
      document.getElementById('detailPanel').classList.remove('detail-edit');
      document.getElementById('detailPanel').classList.add('detail-view');
    }
    // Cancel edit operation
    function cancelEdit() {
      // Simply switch back to read mode, without saving changes
      switchToReadMode();
      // Refresh the view with original data
      const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
      if (currentItemIndex >= 0 && currentItemIndex < storedItems.length) {
        refreshDetailView(storedItems[currentItemIndex]);
      }
    }
    // Hide the detail panel
    function hideDetailPanel() {
      document.getElementById('detailPanel').style.display = 'none';
      currentItemIndex = -1;
    }
    // Increase quantity from detail view
    function increaseQuantity() {
      if (currentItemIndex >= 0) {
        const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
        if (currentItemIndex < storedItems.length) {
          storedItems[currentItemIndex].quantity++;
          localStorage.setItem('inventory', JSON.stringify(storedItems));
          // Update display
          refreshDetailView(storedItems[currentItemIndex]);
          refreshInventoryTable();
        }
      }
    }
    // Decrease quantity from detail view
    function decreaseQuantity() {
      if (currentItemIndex >= 0) {
        const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
        if (currentItemIndex < storedItems.length && storedItems[currentItemIndex].quantity > 0) {
          storedItems[currentItemIndex].quantity--;
          localStorage.setItem('inventory', JSON.stringify(storedItems));
          // Update display
          refreshDetailView(storedItems[currentItemIndex]);
          refreshInventoryTable();
        }
      }
    }
    // Save a new item
    function saveItem(item) {
      const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
      storedItems.push(item);
      localStorage.setItem('inventory', JSON.stringify(storedItems));
      // Add to table display
      addItemToInventory(item, storedItems.length - 1);
    }
    // Update an existing item
    function updateItem(index, updatedItem) {
      const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
      if (index >= 0 && index < storedItems.length) {
        storedItems[index] = updatedItem;
        localStorage.setItem('inventory', JSON.stringify(storedItems));
        // Refresh table display
        refreshInventoryTable();
      }
    }
    // Remove item from inventory list and update localStorage
    function removeItem(button, index) {
      const row = button.closest('tr');
      row.remove();
      // Remove item from localStorage
      const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
      storedItems.splice(index, 1);
      localStorage.setItem('inventory', JSON.stringify(storedItems));
      // Hide detail panel if it was showing the removed item
      if (currentItemIndex === index) {
        hideDetailPanel();
      }
      // Refresh the table to update indices
      refreshInventoryTable();
    }
    // Refresh the entire inventory table
    function refreshInventoryTable() {
      const tableBody = document.querySelector('#inventoryTable tbody');
      tableBody.innerHTML = '';
      const storedItems = JSON.parse(localStorage.getItem('inventory')) || [];
      storedItems.forEach((item, index) => {
        addItemToInventory(item, index);
      });
    }
    // Toggle the form panel
    function toggleFormPanel() {
      const formPanel = document.getElementById('formPanel');
      const detailPanel = document.getElementById('detailPanel');
      if (formPanel.style.display === 'none' || formPanel.style.display === '') {
        formPanel.style.display = 'block';
        detailPanel.style.display = 'none';
      } else {
        formPanel.style.display = 'none';
      }
    }
    // Clear form inputs after adding item
    function clearForm() {
      document.getElementById('item-name').value = '';
      document.getElementById('item-quantity').value = '';
      document.getElementById('item-price').value = '';
      document.getElementById('item-description').value = '';
      document.getElementById('item-image').value = '';
    }
    // Exit button functionality to clear all inventory and localStorage
    function exitInventory() {
      if (confirm('Are you sure you want to reset?')) {
        // Clear the table
        const tableBody = document.querySelector('#inventoryTable tbody');
        tableBody.innerHTML = '';
        // Clear inventory localStorage but keep theme preference
        localStorage.removeItem('inventory');
        // Alert the user
        alert('Inventory has been cleared and saved data has been removed.');
        // Try to close the window (may not work in all browsers)
        window.close();
      }
    }
    // Search item functionality
    function searchItem() {
      const searchTerm = document.getElementById('search-bar').value.toLowerCase();
      const rows = document.querySelectorAll('#inventoryTable tbody tr');
      rows.forEach(row => {
        const itemName = row.cells[0].textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
          row.style.display = ''; // Show matching item
        } else {
          row.style.display = 'none'; // Hide non-matching item
        }
      });
    }
