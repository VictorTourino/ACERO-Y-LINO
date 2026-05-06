document.addEventListener('DOMContentLoaded', function() {

    // ========== LOAD PRODUCT DATA ==========
    var params = new URLSearchParams(window.location.search);
    var productId = parseInt(params.get('id'));

    if (!productId || !window.PRODUCTOS) {
        document.getElementById('productName').textContent = 'Producto no encontrado';
        return;
    }

    var producto = window.PRODUCTOS.find(function(p) { return p.id === productId; });

    if (!producto) {
        document.getElementById('productName').textContent = 'Producto no encontrado';
        document.getElementById('productDescription').textContent = 'El producto que buscas no existe o ha sido retirado.';
        return;
    }

    // Fill product data
    document.title = 'ACERO Y LINO - ' + producto.nombre;
    document.getElementById('productName').textContent = producto.nombre;
    document.getElementById('productDescription').textContent = producto.descripcion;
    
    // --- NUEVA LÓGICA PARA 3D vs IMAGEN 2D ---
    var imageContainer = document.querySelector('.product-image-container');
    
    if (producto.modelo3D) {
        // Si el producto tiene ruta en modelo3D, dibujamos el visor interactivo
        imageContainer.innerHTML = '<model-viewer ' +
            'src="' + producto.modelo3D + '" ' +
            'poster="' + producto.imagen + '" ' +
            'alt="' + producto.nombre + '" ' +
            'shadow-intensity="1" ' +
            'camera-controls ' +
            'auto-rotate ' +
            'touch-action="pan-y" ' +
            'style="width: 100%; height: 500px; min-height: 50vh; outline: none;">' +
            '</model-viewer>';
    } else {
        // Si no tiene modelo 3D, dibujamos la etiqueta img clásica
        imageContainer.innerHTML = '<img id="productImage" src="' + producto.imagen + '" alt="' + producto.nombre + '">';
    }
    // -----------------------------------------

    document.getElementById('productPrice').textContent = producto.precio;
    document.getElementById('productPriceNote').textContent = producto.notaPrecio || '';

    // Colors
    var colorsContainer = document.getElementById('productColors');
    if (colorsContainer && producto.colores) {
        producto.colores.forEach(function(color) {
            var swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;
            colorsContainer.appendChild(swatch);
        });
    }

    // Specifications
    var specsTable = document.getElementById('productSpecs');
    if (specsTable && producto.especificaciones) {
        var keys = Object.keys(producto.especificaciones);
        keys.forEach(function(key) {
            var row = document.createElement('tr');
            row.innerHTML = '<td>' + key + '</td><td>' + producto.especificaciones[key] + '</td>';
            specsTable.appendChild(row);
        });
    }
    // ========== ADD TO CART ==========
    var addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn && producto) {
        addToCartBtn.addEventListener('click', function() {
            if (window.CARRITO) {
                CARRITO.addItem(producto.id, 1);
            }
        });
    }

    // ========== CART MODAL ==========
    var cartModal = document.getElementById('cartModal');
    var cartBtn = document.getElementById('cartBtn');
    var cartClose = document.getElementById('cartClose');
    var clearCartBtn = document.getElementById('clearCartBtn');

    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (cartModal && window.CARRITO) {
                CARRITO.renderModal();
                cartModal.classList.add('active');
            }
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', function() {
            if (cartModal) cartModal.classList.remove('active');
        });
    }

    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) cartModal.classList.remove('active');
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (window.CARRITO) {
                CARRITO.clear();
                CARRITO.renderModal();
            }
        });
    }

    // Update cart badge on load
    if (window.CARRITO) {
        CARRITO.updateBadge();
    }

    // ========== HAMBURGER MENU ==========
    var dropdownMenu = document.getElementById('dropdownMenu');
    var goldLine = document.getElementById('goldLine');
    var hamburger = document.getElementById('hamburger');
    var menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
        if (menuOpen) {
            dropdownMenu.classList.add('active');
            goldLine.classList.add('active');
        } else {
            dropdownMenu.classList.remove('active');
            goldLine.classList.remove('active');
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    document.addEventListener('click', function(e) {
        if (menuOpen && !dropdownMenu.contains(e.target) && !hamburger.contains(e.target)) {
            menuOpen = false;
            dropdownMenu.classList.remove('active');
            goldLine.classList.remove('active');
        }
    });

    // ========== SEARCH MODAL ==========
    var searchModal = document.getElementById('searchModal');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    var searchBtn = document.getElementById('searchBtn');
    var searchClose = document.getElementById('searchClose');
    var searchDebounceTimer = null;

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            searchModal.classList.add('active');
            setTimeout(function() { searchInput.focus(); }, 100);
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchModal.classList.remove('active');
            searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
        });
    }

    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                searchInput.value = '';
                if (searchResults) searchResults.innerHTML = '';
            }
        });
    }

    function performSearch(query) {
        if (!searchResults || !window.PRODUCTOS) return;
        var trimmed = query.trim().toLowerCase();
        if (trimmed.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        var terms = trimmed.split(/\s+/);
        var results = window.PRODUCTOS.filter(function(p) {
            var searchable = (p.nombre + ' ' + p.descripcion + ' ' + p.categoria).toLowerCase();
            return terms.every(function(term) { return searchable.indexOf(term) !== -1; });
        });
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No se encontraron productos para "' + query.trim() + '"</div>';
            return;
        }
        var html = '';
        results.forEach(function(p) {
            html += '<a href="producto.html?id=' + p.id + '" class="search-result-item">' +
                '<img src="' + p.imagen + '" alt="' + p.nombre + '" class="search-result-img">' +
                '<div class="search-result-info"><div class="search-result-name">' + p.nombre + '</div>' +
                '<div class="search-result-cat">' + p.categoria + '</div></div>' +
                '<div class="search-result-price">' + p.precio + ' &euro;</div></a>';
        });
        searchResults.innerHTML = html;
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchDebounceTimer);
            var query = searchInput.value;
            searchDebounceTimer = setTimeout(function() { performSearch(query); }, 200);
        });
    }

    // ========== LOGIN / SESSION ==========
    var loginModal = document.getElementById('loginModal');
    var userBtn = document.getElementById('userBtn');
    var loginClose = document.getElementById('loginClose');
    var loginSubmit = document.getElementById('loginSubmit');
    var loginEmail = document.getElementById('loginEmail');
    var loginPassword = document.getElementById('loginPassword');
    var loginError = document.getElementById('loginError');
    var loginForm = document.getElementById('loginForm');
    var userInfo = document.getElementById('userInfo');
    var logoutBtn = document.getElementById('logoutBtn');
    var welcomeText = document.getElementById('welcomeText');

    function checkSession() {
        var session = sessionStorage.getItem('aceroylino_user');
        if (session) {
            try {
                var user = JSON.parse(session);
                if (user && user.email) { showLoggedIn(user.email); return true; }
            } catch(e) { sessionStorage.removeItem('aceroylino_user'); }
        }
        showLoggedOut();
        return false;
    }

    function showLoggedIn(email) {
        if (loginForm) loginForm.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (welcomeText) welcomeText.textContent = 'Bienvenido, ' + email;
        if (userBtn) userBtn.classList.add('user-logged');
    }

    function showLoggedOut() {
        if (loginForm) loginForm.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (userBtn) userBtn.classList.remove('user-logged');
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
        if (loginError) loginError.textContent = '';
    }

    checkSession();

    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            checkSession();
            loginModal.classList.add('active');
        });
    }

    if (loginClose) {
        loginClose.addEventListener('click', function() { loginModal.classList.remove('active'); });
    }

    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) loginModal.classList.remove('active');
        });
    }

    if (loginSubmit) {
        loginSubmit.addEventListener('click', function() {
            var email = loginEmail ? loginEmail.value.trim() : '';
            var password = loginPassword ? loginPassword.value.trim() : '';
            if (!email || !password) { if (loginError) loginError.textContent = 'Por favor, rellena todos los campos.'; return; }
            if (email.indexOf('@') === -1 || email.indexOf('.') === -1) { if (loginError) loginError.textContent = 'Introduce un email valido.'; return; }
            sessionStorage.setItem('aceroylino_user', JSON.stringify({ email: email, loggedIn: true }));
            showLoggedIn(email);
        });
    }

    if (loginPassword) {
        loginPassword.addEventListener('keypress', function(e) { if (e.key === 'Enter' && loginSubmit) loginSubmit.click(); });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('aceroylino_user');
            showLoggedOut();
        });
    }

    // ========== NEWSLETTER MODAL ==========
    var newsletterModal = document.getElementById('newsletterModal');
    var newsletterClose = document.getElementById('newsletterClose');
    var newsletterSubmit = document.getElementById('newsletterSubmit');
    var newsletterLinks = document.querySelectorAll('[data-action="newsletter"]');

    newsletterLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (newsletterModal) newsletterModal.classList.add('active');
        });
    });

    if (newsletterClose) {
        newsletterClose.addEventListener('click', function() {
            if (newsletterModal) newsletterModal.classList.remove('active');
        });
    }

    if (newsletterModal) {
        newsletterModal.addEventListener('click', function(e) {
            if (e.target === newsletterModal) newsletterModal.classList.remove('active');
        });
    }

    if (newsletterSubmit) {
        newsletterSubmit.addEventListener('click', function() {
            var emailInput = document.getElementById('newsletterEmail');
            var msg = document.getElementById('newsletterMsg');
            if (!emailInput || !emailInput.value.trim() || emailInput.value.indexOf('@') === -1) {
                if (msg) { msg.textContent = 'Introduce un email valido.'; msg.style.color = '#cc0000'; }
                return;
            }
            if (msg) { msg.textContent = 'Te has suscrito correctamente.'; msg.style.color = '#2d8a4e'; }
            emailInput.value = '';
        });
    }

    // ========== FOOTER "MI CUENTA" LINK ==========
    var footerMiCuenta = document.getElementById('footerMiCuenta');
    if (footerMiCuenta) {
        footerMiCuenta.addEventListener('click', function(e) {
            e.preventDefault();
            checkSession();
            loginModal.classList.add('active');
        });
    }

    // ========== ESC KEY ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (searchModal && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
                searchInput.value = '';
                if (searchResults) searchResults.innerHTML = '';
            }
            if (loginModal && loginModal.classList.contains('active')) {
                loginModal.classList.remove('active');
            }
            if (cartModal && cartModal.classList.contains('active')) {
                cartModal.classList.remove('active');
            }
            if (newsletterModal && newsletterModal.classList.contains('active')) {
                newsletterModal.classList.remove('active');
            }
            if (menuOpen) {
                menuOpen = false;
                dropdownMenu.classList.remove('active');
                goldLine.classList.remove('active');
            }
        }
    });

});
