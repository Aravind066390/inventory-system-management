class InventoryManager {
    constructor() {
        this.inventory = [];
        this.initElements();
        this.bindEvents();
        this.loadInventory();
    }

    initElements() {
        // Modal and Form Elements
        this.modal = document.getElementById('itemModal');
        this.addItemBtn = document.getElementById('addItemBtn');
        this.closeBtn = document.querySelector('.close-btn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.itemForm = document.getElementById('itemForm');
        this.inventoryContainer = document.getElementById('inventoryContainer');
        this.imageInput = document.getElementById('itemImage');
        this.imagePreview = document.getElementById('imagePreview');

        // Form Fields
        this.itemIdField = document.getElementById('itemId');
        this.itemNameField = document.getElementById('itemName');
        this.itemDateField = document.getElementById('itemDate');
        this.itemQuantityField = document.getElementById('itemQuantity');
        this.itemPriceField = document.getElementById('itemPrice');
        this.itemDescriptionField = document.getElementById('itemDescription');
    }

    bindEvents() {
        this.addItemBtn.addEventListener('click', () => this.openAddItemModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.itemForm.addEventListener('submit', (e) => this.saveItem(e));
        this.imageInput.addEventListener('change', (e) => this.previewImage(e));
    }

    openAddItemModal(item = null) {
        // Reset form
        this.itemForm.reset();
        this.imagePreview.innerHTML = '';

        if (item) {
            // Edit mode
            this.itemIdField.value = item.id;
            this.itemNameField.value = item.name;
            this.itemDateField.value = item.date;
            this.itemQuantityField.value = item.quantity;
            this.itemPriceField.value = item.price;
            this.itemDescriptionField.value = item.description;

            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                this.imagePreview.appendChild(img);
            }
        }

        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    previewImage(event) {
        const file = event.target.files[0];
        this.imagePreview.innerHTML = '';

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                this.imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    saveItem(e) {
        e.preventDefault();

        // Validate inputs
        if (!this.validateForm()) return;

        const item = {
            id: this.itemIdField.value || Date.now().toString(),
            name: this.itemNameField.value,
            date: this.itemDateField.value,
            quantity: parseInt(this.itemQuantityField.value),
            price: parseFloat(this.itemPriceField.value),
            description: this.itemDescriptionField.value,
            image: this.imagePreview.querySelector('img')?.src || null
        };

        // Remove existing item if editing
        this.inventory = this.inventory.filter(i => i.id !== item.id);
        
        // Add new/updated item
        this.inventory.push(item);

        // Save and render
        this.saveInventory();
        this.renderInventory();
        this.closeModal();
        this.showNotification('Item saved successfully!');
    }

    validateForm() {
        const requiredFields = [
            this.itemNameField,
            this.itemDateField,
            this.itemQuantityField,
            this.itemPriceField
        ];

        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    renderInventory() {
        this.inventoryContainer.innerHTML = '';

        this.inventory.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('inventory-item');
            itemCard.innerHTML = `
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
                <h3>${item.name}</h3>
                <p>Date: ${item.date}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                ${item.description ? `<p>Description: ${item.description}</p>` : ''}
                <div class="item-actions">
                    <button onclick="inventoryManager.editItem('${item.id}')">Edit</button>
                    <button onclick="inventoryManager.deleteItem('${item.id}')">Delete</button>
                </div>
            `;
            this.inventoryContainer.appendChild(itemCard);
        });
    }

    editItem(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            this.openAddItemModal(item);
        }
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.inventory = this.inventory.filter(i => i.id !== id);
            this.saveInventory();
            this.renderInventory();
            this.showNotification('Item deleted successfully!');
        }
    }

    saveInventory() {
        try {
            localStorage.setItem('inventoryItems', JSON.stringify(this.inventory));
        } catch (error) {
            this.showNotification('Failed to save inventory', 'error');
        }
    }

    loadInventory() {
        try {
            const savedInventory = localStorage.getItem('inventoryItems');
            if (savedInventory) {
                this.inventory = JSON.parse(savedInventory);
                this.renderInventory();
            }
        } catch (error) {
            this.showNotification('Failed to load inventory', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notificationContainer = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        notificationContainer.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 3000);
    }
}

// Initialize the inventory manager
const inventoryManager = new InventoryManager();

// Expose to global scope for event handlers
window.inventoryManager = inventoryManager;
