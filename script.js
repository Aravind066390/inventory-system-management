class InventoryManager {
    constructor() {
        this.inventory = [];
        this.initEventListeners();
        this.loadInventoryFromLocalStorage();
    }

    initEventListeners() {
        // Add Item Button
        document.getElementById('addItemBtn').addEventListener('click', () => this.openModal());

        // Close Modal Button
        document.querySelector('.close-btn').addEventListener('click', () => this.closeModal());

        // Form Submission
        document.getElementById('itemForm').addEventListener('submit', (e) => this.saveItem(e));

        // Image Upload Preview
        document.getElementById('itemImage').addEventListener('change', (e) => this.previewImage(e));

        // Reset Button
        document.getElementById('resetBtn').addEventListener('click', () => this.resetInventory());
    }

    openModal(item = null) {
        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const saveBtn = document.getElementById('saveItemBtn');

        // Reset form
        document.getElementById('itemForm').reset();
        document.getElementById('imagePreview').innerHTML = '';

        if (item) {
            // Edit mode
            modalTitle.textContent = 'Edit Item';
            saveBtn.textContent = 'Update Item';
            
            // Populate form with existing item data
            document.getElementById('itemId').value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemDate').value = item.date;
            document.getElementById('itemQuantity').value = item.quantity;
            document.getElementById('itemDescription').value = item.description || '';
            
            // Show existing image if available
            if (item.imageUrl) {
                const previewImg = document.createElement('img');
                previewImg.src = item.imageUrl;
                document.getElementById('imagePreview').appendChild(previewImg);
            }
        } else {
            // Add mode
            modalTitle.textContent = 'Add New Item';
            saveBtn.textContent = 'Save Item';
        }

        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('itemModal').style.display = 'none';
    }

    previewImage(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = ''; // Clear previous preview

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    saveItem(e) {
        e.preventDefault();

        // Collect form data
        const id = document.getElementById('itemId').value || Date.now().toString();
        const name = document.getElementById('itemName').value;
        const date = document.getElementById('itemDate').value;
        const quantity = document.getElementById('itemQuantity').value;
        const description = document.getElementById('itemDescription').value;
        const imageFile = document.getElementById('itemImage').files[0];

        // Existing item or new item
        const existingItemIndex = this.inventory.findIndex(item => item.id === id);

        // Create item object
        const item = {
            id,
            name,
            date,
            quantity,
            description,
            imageUrl: null
        };

        // Handle image upload
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                item.imageUrl = event.target.result;
                
                if (existingItemIndex !== -1) {
                    // Update existing item
                    this.inventory[existingItemIndex] = item;
                } else {
                    // Add new item
                    this.inventory.push(item);
                }

                this.saveInventoryToLocalStorage();
                this.renderInventory();
                this.closeModal();
            };
            reader.readAsDataURL(imageFile);
        } else {
            // If no new image, use existing image or keep it null
            if (existingItemIndex !== -1) {
                item.imageUrl = this.inventory[existingItemIndex].imageUrl;
                this.inventory[existingItemIndex] = item;
            } else {
                this.inventory.push(item);
            }

            this.saveInventoryToLocalStorage();
            this.renderInventory();
            this.closeModal();
        }
    }

    renderInventory() {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = ''; // Clear existing items

        this.inventory.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('inventory-item');
            
            itemCard.innerHTML = `
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : ''}
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Date: ${item.date}</p>
                    <p>Quantity: ${item.quantity}</p>
                    ${item.description ? `<p>Description: ${item.description}</p>` : ''}
                </div>
                <div class="item-actions">
                    <button onclick="inventoryManager.openModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="inventoryManager.deleteItem('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;

            grid.appendChild(itemCard);
        });
    }

    deleteItem(id) {
        // Confirm deletion
        if (confirm('Are you sure you want to delete this item?')) {
            this.inventory = this.inventory.filter(item => item.id !== id);
            this.saveInventoryToLocalStorage();
            this.renderInventory();
        }
    }

    resetInventory() {
        // Confirm reset
        if (confirm('Are you sure you want to reset the entire inventory? This will delete all items.')) {
            this.inventory = [];
            this.saveInventoryToLocalStorage();
            this.renderInventory();
        }
    }

    saveInventoryToLocalStorage() {
        localStorage.setItem('inventoryItems', JSON.stringify(this.inventory));
    }

    loadInventoryFromLocalStorage() {
        const savedInventory = localStorage.getItem('inventoryItems');
        if (savedInventory) {
            this.inventory = JSON.parse(savedInventory);
            this.renderInventory();
        }
    }
}

// Initialize the inventory manager
const inventoryManager = new InventoryManager();

// Expose to global scope for event handlers
window.inventoryManager = inventoryManager;
