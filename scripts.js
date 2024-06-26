let productId;
let count = 0;

document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:9000/products')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            if (data && Array.isArray(data)) {
                const mensProductsSection = document.getElementById('mens-slider');
                const womensProductsSection = document.getElementById('womens-slider');
                const perfumesProductsSection = document.getElementById('perfumes-slider');
                const jewelleryProductsSection = document.getElementById('jewellery-slider');
                
                data.forEach(product => {
                    const { productCard, addToCartBtn } = createProductCard(product);

                    addToCartBtn.addEventListener('click', () => {
                        showNotification(product.name);
                    });
                    
                    if (product.category === 'men') {
                        mensProductsSection.appendChild(productCard);
                    } else if (product.category === 'women') {
                        womensProductsSection.appendChild(productCard);
                    } else if (product.category === 'perfumes') {
                        perfumesProductsSection.appendChild(productCard);
                    } else if (product.category === 'jewellery') {
                        jewelleryProductsSection.appendChild(productCard);
                    }
                });
            } else {
                console.error('No products found in the data');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.setAttribute('data-id', product.id);
    
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.classList.add('product-image');
    productCard.appendChild(image);
    
    const title = document.createElement('h3');
    title.textContent = product.name;
    title.classList.add('product-title');
    productCard.appendChild(title);
    
    const price = document.createElement('p');
    price.textContent = '$' + product.price.toFixed(2);
    price.classList.add('product-price');
    productCard.appendChild(price);
    
    // Description
    const description = document.createElement('p');
    description.textContent = product.description;
    description.classList.add('product-description');
    productCard.appendChild(description);

    // Size dropdown
    const sizeDropdown = document.createElement('select');
    sizeDropdown.classList.add('product-size-dropdown');
    const sizes = product.size || [];
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeDropdown.appendChild(option);
    });
    productCard.appendChild(sizeDropdown);

    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update';
    updateBtn.classList.add('update-btn');
    updateBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        openUpdateModal(product);
    });
    productCard.appendChild(updateBtn);

    const addToCartBtn = document.createElement('a');
    addToCartBtn.href = '#';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.classList.add('btn');
    productCard.appendChild(addToCartBtn);

    const selectedSize = sizeDropdown.value;
    product.size = [selectedSize];

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteProduct(product.id);
            removeProductFromDisplay(product.id);
        }
    });
    productCard.appendChild(deleteBtn);

    // Add event listener to product card
    productCard.addEventListener('click', () => {
        console.log('Clicked product ID:', product.id);
        fetchProductById(product.id);
    });

    return { productCard, addToCartBtn };
}

    //deleteing a specific product tied to it's id
    function deleteProduct(productId) {
        fetch(`http://localhost:9000/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            console.log(`Product with ID ${productId} deleted from database.`);
        })
        .catch(error => {
            console.error(`Error deleting product with ID ${productId}:`, error);
        });
    }

    //remove the product from my dispplay
    function removeProductFromDisplay(id) {
        const productCardToRemove = document.querySelector(`.product-card[data-id="${id}"]`);
        if (productCardToRemove) {
            productCardToRemove.remove();
            console.log(`Product with ID ${id} removed from display.`);
        } else {
            console.error(`Product with ID ${id} not found in display.`);
        }
    }

    //fetch my products using a specific id
    function fetchProductById(productId) {
        fetch(`http://localhost:9000/products/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                return response.json();
            })
            .then(product => {
                console.log('Fetched product:', product);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }

    var modal = document.getElementById("myModal");
    var btn = document.getElementById("addProductBtn");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
    modal.style.display = "block";
    }

    span.onclick = function() {
    modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }

    document.getElementById("addProductForm").addEventListener("submit", function(event) {
        event.preventDefault(); 
    
        var formData = new FormData(this);
    
        var newProduct = {
            name: formData.get('productName'),
            price: parseInt(formData.get('productPrice')),
            image: formData.get('productImage'),
            description: formData.get('productDescription'),
            category: formData.get('productCategory'),
            size: [formData.get('productSize')] 
        };
    
        fetch('http://localhost:9000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
        console.log('New product added:', data);
        modal.style.display = "none";
        })
        .catch(error => {
        console.error('Error adding product:', error);
        });
    });

    function openUpdateModal(product) {
        document.getElementById('updateProductName').value = product.name;
        document.getElementById('updateProductPrice').value = product.price;
        document.getElementById('updateProductDescription').value = product.description;
        document.getElementById('updateProductCategory').value = product.category;
        document.getElementById('productId').value = product.id;
    
        const imageInput = document.getElementById('updateProductImage');
        imageInput.value = product.image;
        imageInput.setAttribute('readonly', true); 
    
        const sizeDropdown = document.getElementById('updateProductSize');
        sizeDropdown.innerHTML = ''; 
        product.size.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeDropdown.appendChild(option);
        });
    
        updateModal.style.display = 'block';
    }

// Add event listener to the "Update Product" form
    var updateModal = document.getElementById("updateModal");
    var updateCloseBtn = updateModal.querySelector(".close");

    updateCloseBtn.addEventListener("click", function() {
        updateModal.style.display = "none";
    });

    document.getElementById("updateProductForm").addEventListener("submit", function(event) {
        event.preventDefault(); 

        var formData = new FormData(this);
        var updatedProduct = {
            name: formData.get('updateProductName'),
            price: parseFloat(formData.get('updateProductPrice')),
            image: formData.get('updateProductImage'), // Include the image URL
            description: formData.get('updateProductDescription'),
            category: formData.get('updateProductCategory'),
            size: [formData.get('updateProductSize')]
        };

        var productId = formData.get('productId'); 
        console.log(productId); 

        fetch(`http://localhost:9000/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            return response.json();
        })
        .then(data => {
            console.log('Product updated:', data);
            updateModal.style.display = "none";
        })
        .catch(error => {
            console.error('Error updating product:', error);
        });
    });

// Function to show notification and update count
function showNotification(productName) {
    const notification = document.getElementById('notification');
    notification.textContent = `${productName} added to cart`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);

    count++;
    document.getElementById('count').textContent = count;
}

// Add event listener to the "Add to Cart" button
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
     showNotification(product.name);
});
}