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
        cantidad = cantidad || 1;
        var items = this.getItems();
        var existing = items.find(function(i) { return i.id === productId; });
        if (existing) { existing.cantidad += cantidad; } 
        else { items.push({ id: productId, cantidad: cantidad }); }
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
    getCount: function() {
        var items = this.getItems();
        var count = 0;
        items.forEach(function(item) { count += item.cantidad; });
        return count;
    },
    clear: function() {
        sessionStorage.removeItem('aceroylino_cart');
        this.updateBadge();
        this.renderModal();
    },
    updateBadge: function() {
        var badge = document.getElementById('cartBadge');
        var count = this.getCount();
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
        setTimeout(function() { if(notif) notif.remove(); }, 2500);
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
            var self = this;
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
        // ✅ SOLO AQUÍ se abre la Newsletter automáticamente
        var newsletterModal = document.getElementById('newsletterModal');
        if (newsletterModal) newsletterModal.classList.add('active');
    }
};

// ========== SHARED UI (Lupa, Hamburguesa, Login) ==========
window.initSharedUI = function() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    var goldLine = document.getElementById('goldLine');
    var hamburger = document.getElementById('hamburger');
    var searchModal = document.getElementById('searchModal');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    var loginModal = document.getElementById('loginModal');
    var cartModal = document.getElementById('cartModal');

    // HAMBURGER
    if (hamburger && dropdownMenu) {
        hamburger.onclick = function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
            if(goldLine) goldLine.classList.toggle('active');
        };
    }

    // SEARCH LOGIC
    var searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.onclick = function() { 
            searchModal.classList.add('active');
            setTimeout(function() { if(searchInput) searchInput.focus(); }, 100);
        };
    }

    function performSearch(query) {
        if (!searchResults || !window.PRODUCTOS) return;
        var trimmed = query.trim().toLowerCase();
        if (trimmed.length === 0) { searchResults.innerHTML = ''; return; }
        var terms = trimmed.split(/\s+/);
        var results = window.PRODUCTOS.filter(function(p) {
            var searchable = (p.nombre + ' ' + (p.descripcion || '') + ' ' + p.categoria).toLowerCase();
            return terms.every(function(t) { return searchable.indexOf(t) !== -1; });
        });
        var html = '';
        results.forEach(function(p) {
            html += '<a href="producto.html?id=' + p.id + '" class="search-result-item">' +
                '<img src="' + p.imagen + '" class="search-result-img">' +
                '<div class="search-result-info"><div class="search-result-name">' + p.nombre + '</div><small>' + p.categoria + '</small></div>' +
                '<div class="search-result-price">' + p.precio + ' €</div></a>';
        });
        searchResults.innerHTML = html || '<div class="search-no-results">No hay resultados</div>';
    }

    if (searchInput) {
        searchInput.oninput = function() { performSearch(this.value); };
    }

    // LOGIN & SESSION
    function checkSession() {
        var user = JSON.parse(sessionStorage.getItem('aceroylino_user') || 'null');
        var userBtn = document.getElementById('userBtn');
        if (user && user.loggedIn) {
            if (userBtn) userBtn.classList.add('user-logged');
            if (document.getElementById('loginForm')) document.getElementById('loginForm').style.display = 'none';
            if (document.getElementById('userInfo')) document.getElementById('userInfo').style.display = 'block';
            if (document.getElementById('welcomeText')) document.getElementById('welcomeText').textContent = 'Hola, ' + user.email;
        }
    }

    var loginSubmit = document.getElementById('loginSubmit');
    if (loginSubmit) {
        loginSubmit.onclick = function() {
            var email = document.getElementById('loginEmail').value;
            if (email.includes('@')) {
                sessionStorage.setItem('aceroylino_user', JSON.stringify({email: email, loggedIn: true}));
                checkSession();
                loginModal.classList.remove('active');
            }
        };
    }

    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            sessionStorage.removeItem('aceroylino_user');
            location.reload();
        };
    }

    var userBtn = document.getElementById('userBtn');
    if (userBtn) {
        userBtn.onclick = function() { loginModal.classList.add('active'); };
    }

    // CART MODAL
    var cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.onclick = function() { CARRITO.renderModal(); cartModal.classList.add('active'); };
    }

    // CERRAR TODO AL CLICAR FUERA
    window.onclick = function(e) {
        if (e.target.classList.contains('active')) e.target.classList.remove('active');
    };

    checkSession();
    CARRITO.updateBadge();
};

// ========== NEWSLETTER FUNCIONAL ==========
window.enviarNewsletter = function() {
    var emailInput = document.getElementById('newsletterEmail');
    var msg = document.getElementById('newsletterMsg');
    var emailValue = emailInput ? emailInput.value.trim() : '';

    if (!emailValue.includes('@')) {
        if (msg) { msg.textContent = 'Email no válido'; msg.style.color = 'red'; }
        return;
    }
    if (msg) { msg.textContent = 'Enviando...'; msg.style.color = '#b8860b'; }

    emailjs.send('service_spleogq', 'template_ntkeve4', { user_email: emailValue, reply_to: "info@aceroylino.com" })
        .then(function() {
            alert('¡Suscrito con éxito!');
            document.getElementById('newsletterModal').classList.remove('active');
        }, function() {
            alert('Error al enviar');
        });
};

document.addEventListener('DOMContentLoaded', initSharedUI);
