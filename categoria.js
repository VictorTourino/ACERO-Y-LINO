document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD CATEGORY PRODUCTS ==========
    var categoria = document.body.getAttribute('data-categoria');
    var grid = document.getElementById('productsGrid');

    if (categoria && grid && window.PRODUCTOS) {
        var productos = window.PRODUCTOS.filter(function(p) { return p.categoria === categoria; });

        if (productos.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;font-family:MedievalSharp,cursive;color:var(--gray);padding:40px;">Proximamente...</p>';
        } else {
            productos.forEach(function(producto) {
                var card = document.createElement('div');
                card.className = 'product-grid-card';
                card.innerHTML =
                    '<a href="/producto.html?id=' + producto.id + '">' +
                        '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" class="product-grid-img">' +
                        '<div class="product-grid-info">' +
                            '<div class="product-grid-name">' + producto.nombre + '</div>' +
                            '<div class="product-grid-desc">' + producto.descripcion + '</div>' +
                        '</div>' +
                    '</a>' +
                    '<div class="product-grid-footer">' +
                        '<div class="product-grid-price">' + producto.precio + ' <span>&euro;</span></div>' +
                        '<button class="btn-add-grid" data-product-id="' + producto.id + '">ANADIR AL CARRITO</button>' +
                    '</div>';
                grid.appendChild(card);
            });
        }
    }

    // ========== ADD TO CART FROM GRID ==========
    if (grid) {
        grid.addEventListener('click', function(e) {
            var btn = e.target.closest('.btn-add-grid');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                var productId = parseInt(btn.getAttribute('data-product-id'));
                if (productId && window.CARRITO) {
                    CARRITO.addItem(productId, 1);
                }
            }
        });
    }

    // ========== INIT SHARED UI (from shared.js) ==========
    if (window.initSharedUI) {
        window.initSharedUI();
    }
});
