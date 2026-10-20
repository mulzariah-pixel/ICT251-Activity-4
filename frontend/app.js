
const API_URL = 'http://localhost:3000/api/products';

const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const statusBox = document.getElementById('status');
const formTitle = document.getElementById('form-title');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');
const searchInput = document.getElementById('search');

let products = [];

function showStatus(message, isError = false) {
    statusBox.textContent = message;
    statusBox.style.background = isError ? '#fee2e2' : '#e0f2fe';
    statusBox.style.color = isError ? '#991b1b' : '#075985';
}

async function request(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
    }

    return data;
}

async function loadProducts() {
    productList.innerHTML =
        '<tr><td colspan="7" class="empty">Loading products...</td></tr>';

    try {
        products = await request(API_URL);
        renderProducts();
        showStatus(`Connected successfully. ${products.length} product(s) loaded.`);
    } catch (error) {
        productList.innerHTML =
            '<tr><td colspan="7" class="empty">Could not load products.</td></tr>';
        showStatus(
            `Connection failed: ${error.message}. Check that the backend is running.`,
            true
        );
    }
}

function renderProducts() {
    const term = searchInput.value.trim().toLowerCase();

    const filtered = products.filter(product =>
        [
            product.product_name,
            product.category,
            product.brand,
            product.description
        ].some(value => String(value || '').toLowerCase().includes(term))
    );

    productList.replaceChildren();

    if (filtered.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 7;
        cell.className = 'empty';
        cell.textContent = 'No matching products found.';
        row.appendChild(cell);
        productList.appendChild(row);
        return;
    }

    filtered.forEach(product => {
        const row = document.createElement('tr');

        const values = [
            product.id,
            product.product_name,
            product.category,
            product.brand,
            Number(product.price).toFixed(2),
            product.stock_quantity
        ];

        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value ?? '';
            row.appendChild(cell);
        });

        const actions = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit';
        editButton.type = 'button';
        editButton.addEventListener('click', () => editProduct(product.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.type = 'button';
        deleteButton.addEventListener('click', () => deleteProduct(product.id));

        actions.append(editButton, document.createTextNode(' '), deleteButton);
        row.appendChild(actions);
        productList.appendChild(row);
    });
}

function resetForm() {
    form.reset();
    document.getElementById('product-id').value = '';
    formTitle.textContent = 'Add a New Product';
    saveButton.textContent = 'Add Product';
    cancelButton.hidden = true;
}

form.addEventListener('submit', async event => {
    event.preventDefault();

    const id = document.getElementById('product-id').value;

    const product = {
        product_name: document.getElementById('product-name').value.trim(),
        category: document.getElementById('category').value.trim(),
        brand: document.getElementById('brand').value.trim(),
        price: Number(document.getElementById('price').value),
        stock_quantity: Number(document.getElementById('stock').value),
        description: document.getElementById('description').value.trim()
    };

    if (
        !product.product_name ||
        !product.category ||
        !product.brand ||
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isInteger(product.stock_quantity) ||
        product.stock_quantity < 0
    ) {
        showStatus('Please enter valid product information.', true);
        return;
    }

    saveButton.disabled = true;

    try {
        const saved = await request(
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            }
        );

        showStatus(
            id
                ? `Product "${saved.product_name}" updated successfully.`
                : `Product "${saved.product_name}" added successfully.`
        );

        resetForm();
        await loadProducts();
    } catch (error) {
        showStatus(`Could not save product: ${error.message}`, true);
    } finally {
        saveButton.disabled = false;
    }
});

function editProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.product_name;
    document.getElementById('category').value = product.category;
    document.getElementById('brand').value = product.brand;
    document.getElementById('price').value = product.price;
    document.getElementById('stock').value = product.stock_quantity;
    document.getElementById('description').value = product.description || '';

    formTitle.textContent = `Edit Product #${product.id}`;
    saveButton.textContent = 'Save Changes';
    cancelButton.hidden = false;

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    if (!confirm(`Delete "${product.product_name}"? This cannot be undone.`)) {
        return;
    }

    try {
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        resetForm();
        showStatus(`Product "${product.product_name}" deleted successfully.`);
        await loadProducts();
    } catch (error) {
        showStatus(`Could not delete product: ${error.message}`, true);
    }
}

cancelButton.addEventListener('click', resetForm);
searchInput.addEventListener('input', renderProducts);

loadProducts();
