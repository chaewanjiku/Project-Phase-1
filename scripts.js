document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:9000/products')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            if (data && Array.isArray(data)) {
                const mensProductsSection = document.getElementById('mens-slider');
                const womensProductsSection = document.getElementById('womens-slider');
                const perfumesProductsSection = document.getElementById('perfumes-slider');
                const jewelleryProductsSection =document.getElementById('jewellery-slider');
                
                data.forEach(product => {
                    const productCard = createProductCard(product);
                    
                    if (product.category === 'men') {
                        mensProductsSection.appendChild(productCard);
                    } else if (product.category === 'women') {
                        womensProductsSection.appendChild(productCard);
                    } else if (product.category === 'perfumes') {
                        perfumesProductsSection.appendChild(productCard);
                    }else if (product.category === 'jewellery') {
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


    //displays card details for respective cards
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
        product.size.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeDropdown.appendChild(option);
        });
        productCard.appendChild(sizeDropdown);

        // const updateBtn = document.createElement('button');
        // updateBtn.textContent = 'Update';
        // updateBtn.classList.add('update-btn');
        // updateBtn.addEventListener('click', () => {
        //     updateProduct(product.id);
        // });
        // productCard.appendChild(updateBtn);
        
        const addToCartBtn = document.createElement('a');
        addToCartBtn.href = '#';
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.classList.add('btn');
        productCard.appendChild(addToCartBtn);

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

        return productCard;
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
        price: parseFloat(formData.get('productPrice')),
        image: formData.get('productImage'),
        description: formData.get('productDescription'),
        category: formData.get('productCategory')
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