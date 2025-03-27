// Inventory Management System Script

const app = {
    inventory: [],
    currentTheme: 'light',
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadInitialData();
        this.setupTheme();
    },

    cacheDOM() {
        // All previous DOM element selections remain the same
        // But we'll add more robust error checking
        this.elementsToCache = [
            'inventoryForm', 'searchBar', 'searchButton', 'inventoryTable', 
            'toggleFormButton', 'formPanel', 'detailPanel', 'detailTitle', 
            'detailImage', 'detailDescription', 'detailPrice', 'detailDate', 
            'detailQuantity', 'detailTotal', 'editForm', 'editName', 
            'editDescription', 'editPrice', 'editDate', 'editQuantity', 
            'editImage', 'backToInventoryBtn', 'editDetailButton', 
            'cancelEditBtn', 'decreaseQuantityBtn', 'increaseQuantityBtn', 
            'resetButton', 'themeToggleBtn', 'themeToggleIcon'
        ];

        this.elementsToCache.forEach(elementId => {
            this[elementId] = document.getElementById(elementId);
            if (!this[elementId]) {
                console.warn(`Element with ID ${elementId} not found`);
            }
        });

        // Ensure tbody exists
        this.inventoryTableBody = this.inventoryTable ? 
            this.inventoryTable.querySelector('tbody') : null;
    },

    bindEvents() {
        // Add null checks to prevent errors
        if (this.inventoryForm) {
            this.inventoryForm.addEventListener('submit', this.addInventoryItem.bind(this));
        }

        if (this.editForm) {
            this.editForm.addEventListener('submit', this.saveEditedItem.bind(this));
        }

        if (this.searchButton) {
            this.searchButton.addEventListener('click', this.searchInventory.bind(this));
        }

        if (this.searchBar) {
            this.searchBar.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') this.searchInventory();
            });
        }

        if (this.toggleFormButton) {
            this.toggleFormButton.addEventListener('click', this.toggleAddItemForm.bind(this));
        }

        if (this.backToInventoryBtn) {
            this.backToInventoryBtn.addEventListener('click', this.showInventoryList.bind(this));
        }

        if (this.editDetailButton) {
            this.editDetailButton.addEventListener('click', this.switchToEditMode.bind(this));
        }

        if (this.cancelEditBtn) {
            this.cancelEditBtn.addEventListener('click', this.cancelEdit.bind(this));
        }

        if (this.decreaseQuantityBtn) {
            this.decreaseQuantityBtn.addEventListener('click', this.adjustQuantity.bind(this, -1));
        }

        if (this.increaseQuantityBtn) {
            this.increaseQuantityBtn.addEventListener('click', this.adjustQuantity.bind(this, 1));
        }

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', this.toggleTheme.bind(this));
        }

        if (this.resetButton) {
            this.resetButton.addEventListener('click', this.resetInventory.bind(this));
        }
    },

    loadInitialData() {
        const savedInventory = localStorage.getItem('inventoryData');
        if (savedInventory) {
            try {
                this.inventory = JSON.parse(savedInventory);
                this.renderInventoryTable();
            } catch (error) {
                console.error('Error loading inventory:', error);
                this.inventory = [];
            }
        } else {
            // Optional default items
            const initialItems = [
                {
                    id: Date.now(),
                    name: 'Laptop',
                    quantity: 10,
                    price: 999.99,
                    date: '2024-03-15',
                    description: 'High-performance business laptop',
                    image: 'https://via.placeholder.com/150'
                }
            ];
            this.inventory = initialItems;
            this.renderInventoryTable();
            this.saveInventoryToLocalStorage();
        }
    },

    saveInventoryToLocalStorage() {
        localStorage.setItem('inventoryData', JSON.stringify(this.inventory));
    },

    addInventoryItem(event, itemData = null) {
        if (event) {
            event.preventDefault();
            itemData = {
                id: Date.now(),
                name: this.inventoryForm.querySelector('#item-name').value,
                quantity: parseInt(this.inventoryForm.querySelector('#item-quantity').value),
                price: parseFloat(this.inventoryForm.querySelector('#item-price').value),
                date: this.inventoryForm.querySelector('#item-date').value,
                description: this.inventoryForm.querySelector('#item-description').value,
                image: this.inventoryForm.querySelector('#item-image').value || 'https://via.placeholder.com/150'
            };
        }

        this.inventory.push(itemData);
        this.renderInventoryTable();
        this.saveInventoryToLocalStorage();
        this.clearAddItemForm();
    },

    renderInventoryTable() {
        if (!this.inventoryTableBody) return;

        this.inventoryTableBody.innerHTML = '';
        this.inventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.date}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="app.showItemDetails(${item.id})">View</button>
                    <button onclick="app.deleteItem(${item.id})">Delete</button>
                </td>
            `;
            this.inventoryTableBody.appendChild(row);
        });
    },

    deleteItem(itemId) {
        this.inventory = this.inventory.filter(item => item.id !== itemId);
        this.renderInventoryTable();
        this.saveInventoryToLocalStorage();
    },

    showItemDetails(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return;

        // Populate detail view
        this.detailTitle.textContent = item.name;
        this.detailImage.src = item.image || 'https://via.placeholder.com/300';
        this.detailDescription.textContent = item.description;
        this.detailPrice.textContent = `$${item.price.toFixed(2)}`;
        this.detailDate.textContent = item.date;
        this.detailQuantity.value = item.quantity;
        this.detailTotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        // Toggle view
        this.formPanel.style.display = 'none';
        this.detailPanel.style.display = 'block';
        this.detailPanel.classList.remove('edit-mode');
    },

    switchToEditMode() {
        if (!this.detailPanel) return;
        this.detailPanel.classList.add('edit-mode');

        const currentItem = this.inventory.find(item => item.name === this.detailTitle.textContent);
        if (!currentItem) return;

        this.editName.value = currentItem.name;
        this.editDescription.value = currentItem.description;
        this.editPrice.value = currentItem.price;
        this.editDate.value = currentItem.date;
        this.editQuantity.value = currentItem.quantity;
        this.editImage.value = currentItem.image || '';
    },

    saveEditedItem(event) {
        event.preventDefault();
        const currentItemIndex = this.inventory.findIndex(item => item.name === this.detailTitle.textContent);
        
        if (currentItemIndex !== -1) {
            this.inventory[currentItemIndex] = {
                ...this.inventory[currentItemIndex],
                name: this.editName.value,
                description: this.editDescription.value,
                price: parseFloat(this.editPrice.value),
                date: this.editDate.value,
                quantity: parseInt(this.editQuantity.value),
                image: this.editImage.value || 'https://via.placeholder.com/150'
            };

            this.renderInventoryTable();
            this.saveInventoryToLocalStorage();
            this.showItemDetails(this.inventory[currentItemIndex].id);
        }
    },

    cancelEdit() {
        if (this.detailPanel) {
            this.detailPanel.classList.remove('edit-mode');
        }
    },

    showInventoryList() {
        if (this.detailPanel) this.detailPanel.style.display = 'none';
        if (this.formPanel) this.formPanel.style.display = 'block';
    },

    adjustQuantity(change) {
        const currentItem = this.inventory.find(item => item.name === this.detailTitle.textContent);
        if (!currentItem) return;

        currentItem.quantity = Math.max(0, currentItem.quantity + change);
        this.detailQuantity.value = currentItem.quantity;
        this.detailTotal.textContent = `$${(currentItem.price * currentItem.quantity).toFixed(2)}`;
        this.renderInventoryTable();
        this.saveInventoryToLocalStorage();
    },

    setupTheme() {
        const savedTheme = localStorage.getItem('inventoryAppTheme') || 'light';
        this.applyTheme(savedTheme);
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },

    applyTheme(theme) {
        this.currentTheme = theme;
        
        // More robust theme application
        if (document.body) {
            document.body.classList.toggle('dark-theme', theme === 'dark');
        }

        if (this.themeToggleIcon) {
            this.themeToggleIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }

        localStorage.setItem('inventoryAppTheme', theme);
    },

    resetInventory() {
        // Clear inventory and local storage
        this.inventory = [];
        localStorage.removeItem('inventoryData');
        
        // Reset table and views
        this.renderInventoryTable();
        
        // Reset to initial view
        if (this.detailPanel) this.detailPanel.style.display = 'none';
        if (this.formPanel) this.formPanel.style.display = 'block';
    },

    clearAddItemForm() {
        if (this.inventoryForm) {
            this.inventoryForm.reset();
        }
    },

    searchInventory() {
        const searchTerm = this.searchBar.value.toLowerCase();
        const filteredInventory = this.inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );

        this.inventoryTableBody.innerHTML = '';
        filteredInventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.date}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="app.showItemDetails(${item.id})">View</button>
                    <button onclick="app.deleteItem(${item.id})">Delete</button>
                </td>
            `;
            this.inventoryTableBody.appendChild(row);
        });
    }
};

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
