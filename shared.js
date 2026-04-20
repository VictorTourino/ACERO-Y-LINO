// ========== CARRITO DE LA COMPRA ==========
window.CARRITO = {
    getItems: function() {
        try {
            var items = JSON.parse(sessionStorage.getItem('aceroylino_cart') || '[]');
            return Array.isArray(items) ? items : [];
        } catch(e) { return []; }
    },
    saveItems: function(items) {
        sessionStorage.setItem('aceroylino_cart', JSON.stringify(items));
        this.updateBadge();
    },
    addItem: function(productId, cantidad) {
        var items = this.getItems();
        var existing = items.find(function(i) { return i.id === productId; });
        if (existing) { existing.cantidad += (cantidad || 1); } 
        else { items.push({ id: productId, cantidad: (cantidad || 1) }); }
        this.saveItems(items);
        this.showNotification('Producto añadido al carrito');
    },
    removeItem: function(productId) {
        var items = this.getItems().filter(function(item) { return item.id !== productId; });
        this.saveItems(items);
        this.renderModal();
    },
    updateQuantity: function(productId, cantidad) {
        var items = this.getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === productId) {
                if (cantidad <= 0) { items.splice(i, 1); }
                else { items[i].cantidad = cantidad; }
                break;
            }
        }
        this.saveItems(items);
        this.renderModal();
    },
    getTotal: function() {
        var items = this.getItems();
        var total = 0;
        if (!window.PRODUCTOS) return 0;
        items.forEach(function(item) {
            var prod = window.PRODUCTOS.find(function(p) { return p.id === item.id; });
            if (prod) total += prod.precio * item.cantidad;
        });
        return total;
    },
    updateBadge: function() {
        var badge = document.getElementById('cartBadge');
        var count = 0;
        this.getItems().forEach(function(i) { count += i.cantidad; });
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },
    showNotification: function(msg) {
        var existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();
        var notif = document.createElement('div');
        notif.className = 'cart-notification show';
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(function() { notif.remove(); }, 2500);
    },
    renderModal: function() {
        var container = document.getElementById('cartItems');
        var totalEl = document.getElementById('cartTotal');
        var emptyMsg = document.getElementById('cartEmpty');
        var cartActions = document.getElementById('cartActions');
        if (!container) return;
        
        var items = this.getItems();
        container.innerHTML = '';

        if (items.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            if (cartActions) cartActions.style.display = 'none';
            if (totalEl) totalEl.textContent = '0';
        } else {
            if (emptyMsg) emptyMsg.style.display = 'none';
            if (cartActions) cartActions.style.display = 'block';
            items.forEach(function(item) {
                var prod = window.PRODUCTOS.find(function(p) { return p.id === item.id; });
                if (!prod) return;
                var row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = '<img src="' + prod.imagen + '" class="cart-item-img">' +
                    '<div class="cart-item-info"><div class="cart-item-name">' + prod.nombre + '</div><div>' + prod.precio + ' €</div></div>' +
                    '<div class="cart-item-controls">' +
                    '<button onclick="CARRITO.updateQuantity(' + prod.id + ',' + (item.cantidad-1) + ')">-</button>' +
                    '<span>' + item.cantidad + '</span>' +
                    '<button onclick="CARRITO.updateQuantity(' + prod.id + ',' + (item.cantidad+1) + ')">+</button>' +
                    '<button class="cart-remove-btn" onclick="CARRITO.removeItem(' + prod.id + ')">&times;</button></div>';
                container.appendChild(row);
            });
            if (totalEl) totalEl.textContent = this.getTotal().toFixed(2);
        }
        // Disparar Newsletter solo al abrir carrito
        var newsletterModal = document.getElementById('newsletterModal');
        if (newsletterModal) newsletterModal.classList.add('active');
    }
};

// ========== LÓGICA DE BÚSQUEDA ==========
function performSearch(query) {
    var searchResults = document.getElementById('searchResults');
    if (!searchResults || !window.PRODUCTOS) return;
    var trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) { searchResults.innerHTML = ''; return; }
    
    var terms = trimmed.split(/\s+/);
    var results = window.PRODUCTOS.filter(function(p) {
        var searchable = (p.nombre + ' ' + p.descripcion + ' ' + p.categoria).toLowerCase();
        return terms.every(function(t) { return searchable.indexOf(t) !== -1; });
    });

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No hay resultados</div>';
        return;
    }

    var html = '';
    results.forEach(function(p) {
        html += '<a href="producto.html?id=' + p.id + '" class="search-result-item">' +
            '<img src="' + p.imagen + '" class="search-result-img">' +
            '<div class="search-result-info"><div>' + p.nombre + '</div><small>' + p.categoria + '</small></div>' +
            '<div>' + p.precio + ' €</div></a>';
    });
    searchResults.innerHTML = html;
}

// ========== LÓGICA DE SESIÓN/LOGIN ==========
function checkSession() {
    var user = JSON.parse(sessionStorage.getItem('aceroylino_user') || 'null');
    var userBtn = document.getElementById('userBtn');
    if (user && user.loggedIn) {
        if (userBtn) userBtn.classList.add('user-logged');
        if (document.getElementById('welcomeText')) document.getElementById('welcomeText').textContent = 'Bienvenido, ' + user.email;
        if (document.getElementById('loginForm')) document.getElementById('loginForm').style.display = 'none';
        if (document.getElementById('userInfo')) document.getElementById('userInfo').style.display = 'block';
    } else {
        if (userBtn) userBtn.classList.remove('user-logged');
        if (document.getElementById('loginForm')) document.getElementById('loginForm').style.display = 'block';
        if (document.getElementById('userInfo')) document.getElementById('userInfo').style.display = 'none';
    }
}

// ========== INICIALIZACIÓN GLOBAL ==========
window.initSharedUI = function() {
    // Hamburger
    var hamburger = document.getElementById('hamburger');
    var dropdownMenu = document.getElementById('dropdownMenu');
    var goldLine = document.getElementById('goldLine');
    if (hamburger) {
        hamburger.onclick = function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
            if (goldLine) goldLine.classList.toggle('active');
        };
    }

    // Search
    var searchBtn = document.getElementById('searchBtn');
    var searchInput = document.getElementById('searchInput');
    if (searchBtn) {
        searchBtn.onclick = function() { 
            document.getElementById('searchModal').classList.add('active');
            setTimeout(function() { if(searchInput) searchInput.focus(); }, 100);
        };
    }
    if (searchInput) {
        searchInput.oninput = function() { performSearch(this.value); };
    }

    // Login
    var loginSubmit = document.getElementById('loginSubmit');
    if (loginSubmit) {
        loginSubmit.onclick = function() {
            var email = document.getElementById('loginEmail').value;
            if (email.includes('@')) {
                sessionStorage.setItem('aceroylino_user', JSON.stringify({email: email, loggedIn: true}));
                checkSession();
            }
        };
    }
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            sessionStorage.removeItem('aceroylino_user');
            checkSession();
        };
    }

    // Carrito
    var cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.onclick = function() { 
            CARRITO.renderModal(); 
            document.getElementById('cartModal').classList.add('active'); 
        };
    }

    // Cerrar Modales al hacer clic fuera
    window.onclick = function(e) {
        if (e.target.classList.contains('search-modal')) e.target.classList.remove('active');
        if (e.target.classList.contains('login-modal')) e.target.classList.remove('active');
        if (e.target.classList.contains('cart-modal')) e.target.classList.remove('active');
        if (e.target.classList.contains('newsletter-modal')) e.target.classList.remove('active');
    };

    checkSession();
    CARRITO.updateBadge();
};

// ========== NEWSLETTER ==========
window.enviarNewsletter = function() {
    var email = document.getElementById('newsletterEmail').value;
    if (!email.includes('@')) { alert("Email no válido"); return; }
    emailjs.send('service_spleogq', 'template_ntkeve4', { user_email: email })
    .then(function() { 
        alert("¡Suscrito!"); 
        document.getElementById('newsletterModal').classList.remove('active');
    });
};

document.addEventListener('DOMContentLoaded', initSharedUI);
