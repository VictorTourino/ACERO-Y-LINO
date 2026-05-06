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
        var existing = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === productId) { existing = items[i]; break; }
        }
        if (existing) {
            existing.cantidad += cantidad;
        } else {
            items.push({ id: productId, cantidad: cantidad });
        }
        this.saveItems(items);
        this.showNotification('Producto anadido al carrito');
    },

    removeItem: function(productId) {
        var items = this.getItems().filter(function(item) { return item.id !== productId; });
        this.saveItems(items);
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
        notif.className = 'cart-notification';
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(function() { notif.classList.add('show'); }, 10);
        setTimeout(function() {
            notif.classList.remove('show');
            setTimeout(function() { notif.remove(); }, 300);
        }, 2000);
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
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';
        if (cartActions) cartActions.style.display = 'block';

        var self = this;
        items.forEach(function(item) {
            if (!window.PRODUCTOS) return;
            var prod = window.PRODUCTOS.find(function(p) { return p.id === item.id; });
            if (!prod) return;

            var row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = 
                '<img src="' + prod.imagen + '" alt="' + prod.nombre + '" class="cart-item-img">' +
                '<div class="cart-item-info">' +
                    '<div class="cart-item-name">' + prod.nombre + '</div>' +
                    '<div class="cart-item-price">' + prod.precio + ' &euro;</div>' +
                '</div>' +
                '<div class="cart-item-controls">' +
                    '<button class="cart-qty-btn" data-action="minus" data-id="' + prod.id + '">-</button>' +
                    '<span class="cart-qty">' + item.cantidad + '</span>' +
                    '<button class="cart-qty-btn" data-action="plus" data-id="' + prod.id + '">+</button>' +
                    '<button class="cart-remove-btn" data-id="' + prod.id + '">&times;</button>' +
                '</div>';
            container.appendChild(row);
        });

        container.onclick = function(e) {
            var btn = e.target.closest('[data-id]');
            if (!btn) return;
            var id = parseInt(btn.getAttribute('data-id'));
            if (btn.classList.contains('cart-remove-btn')) {
                self.removeItem(id);
                self.renderModal();
            } else if (btn.getAttribute('data-action') === 'minus') {
                var current = self.getItems().find(function(i) { return i.id === id; });
                if (current) self.updateQuantity(id, current.cantidad - 1);
                self.renderModal();
            } else if (btn.getAttribute('data-action') === 'plus') {
                var current2 = self.getItems().find(function(i) { return i.id === id; });
                if (current2) self.updateQuantity(id, current2.cantidad + 1);
                self.renderModal();
            }
        };

        if (totalEl) totalEl.textContent = this.getTotal().toFixed(2);
    }
};
// ========================================================
// ========== SISTEMA GLOBAL DE FAVORITOS =================
// ========================================================
window.FAVORITOS = {
    items: JSON.parse(localStorage.getItem('mis_favoritos')) || [],
    
    add: function(productoId) {
        if (!window.PRODUCTOS) {
            console.error("Base de datos de productos no cargada.");
            return;
        }

        const productoDb = window.PRODUCTOS.find(p => String(p.id) === String(productoId));
        if(!productoDb) return;

        const existe = this.items.find(item => String(item.id) === String(productoId));
        if(!existe) {
            this.items.push({
                id: String(productoDb.id),
                nombre: productoDb.nombre,
                precio: productoDb.precio,
                imagen: productoDb.imagen
            });
            this.save();
            this.updateBadge(); 
            this.showNotification('¡Añadido a tus favoritos, mi señor!'); 
        } else {
            this.showNotification('Este artículo ya se encuentra en tus favoritos.');
        }
    },
    
    remove: function(id) {
        this.items = this.items.filter(item => String(item.id) !== String(id));
        this.save();
        this.renderModal(); 
        this.updateBadge(); 
    },
    
    save: function() {
        localStorage.setItem('mis_favoritos', JSON.stringify(this.items));
    },
    
    renderModal: function() {
        const container = document.getElementById('favItems');
        const emptyMsg = document.getElementById('favEmpty');
        if(!container) return;

        container.innerHTML = '';
        
        if(this.items.length === 0) {
            emptyMsg.style.display = 'block';
        } else {
            emptyMsg.style.display = 'none';
            this.items.forEach(item => {
                const div = document.createElement('div');
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.borderBottom = '1px solid rgba(131, 7, 45, 0.2)';
                div.style.padding = '15px 0';
                div.innerHTML = `
                    <img src="${item.imagen}" onerror="this.src='imagenes/placeholder-producto.svg'" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 5px; border: 1px solid var(--gold);">
                    <div style="flex: 1; text-align: left;">
                        <h4 style="margin: 0 0 5px; font-family: 'Metamorphous', cursive; font-size: 15px; color: var(--wine);">${item.nombre}</h4>
                        <p style="margin: 0; font-family: 'MedievalSharp', cursive; font-size: 14px;">${item.precio} &euro;</p>
                    </div>
                    <a href="producto.html?id=${item.id}" style="margin-right: 15px; font-size: 13px; color: var(--wine); text-decoration: underline; font-family: 'Metamorphous', cursive;">Ver</a>
                    <button onclick="window.FAVORITOS.remove('${item.id}')" style="background: none; border: none; color: #cc0000; font-size: 24px; cursor: pointer;">&times;</button>
                `;
                container.appendChild(div);
            });
        }
    },

    updateBadge: function() {
        const badge = document.getElementById('favBadge');
        if(badge) {
            const total = this.items.length;
            if(total > 0) {
                badge.textContent = total;
                badge.style.display = 'flex'; 
            } else {
                badge.style.display = 'none'; 
            }
        }
    },

    showNotification: function(msg) {
        let notification = document.getElementById('favNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'favNotification';
            notification.className = 'cart-notification'; 
            document.body.appendChild(notification);
        }
        notification.textContent = msg;
        
        notification.classList.remove('show');
        void notification.offsetWidth; 
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
};
// ========== SHARED PAGE INITIALIZATION ==========
window.initSharedUI = function() {
    var newsletterLinks = document.querySelectorAll('[data-action="newsletter"]');
    var newsletterClose = document.getElementById('newsletterClose');
    var newsletterSubmit = document.getElementById('newsletterSubmit');
    var newsletterModal = document.getElementById('newsletterModal');

    // Abrir el modal desde cualquier enlace (header o footer)
    newsletterLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (newsletterModal) newsletterModal.classList.add('active');
        });
    });

    // Cerrar el modal con la X
    if (newsletterClose) {
        newsletterClose.addEventListener('click', function() { 
            if (newsletterModal) newsletterModal.classList.remove('active'); 
        });
    }

    // Lógica de envío al pulsar SUSCRIBIRSE
    if (newsletterSubmit) {
        newsletterSubmit.addEventListener('click', function() {
            var emailInput = document.getElementById('newsletterEmail');
            var msg = document.getElementById('newsletterMsg');
            var emailValue = emailInput ? emailInput.value.trim() : '';

            // 1. Validación
            if (!emailValue || emailValue.indexOf('@') === -1) {
                if (msg) { 
                    msg.textContent = 'Introduce un email valido.'; 
                    msg.style.color = '#cc0000'; 
                }
                return;
            }

            // 2. Feedback visual (Dorado)
            if (msg) { 
                msg.textContent = 'Enviando cuervo mensajero...'; 
                msg.style.color = '#b8860b'; 
            }

            // 3. Envío con tus credenciales
            var serviceID = 'service_spleogq';
            var templateID = 'template_ntkeve4';
            var templateParams = {
                user_email: emailValue,
                reply_to: "info@aceroylino.com"
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(function() {
                    // Éxito: Usamos la notificación visual de abajo a la derecha que te gustó
                    if (window.CARRITO && window.CARRITO.showNotification) {
                        window.CARRITO.showNotification('¡Te has suscrito correctamente!');
                    }
                    
                    // Limpiar y cerrar tras 1 segundo para que de tiempo a ver que ha funcionado
                    setTimeout(function() {
                        if (emailInput) emailInput.value = '';
                        if (msg) msg.textContent = '';
                        if (newsletterModal) newsletterModal.classList.remove('active');
                    }, 1000);

                }, function(error) {
                    console.error("Error EmailJS:", error);
                    if (msg) { 
                        msg.textContent = 'Error en el envío. Reintenta.'; 
                        msg.style.color = '#cc0000'; 
                    }
                });
        });
    }
    var dropdownMenu = document.getElementById('dropdownMenu');
    var goldLine = document.getElementById('goldLine');
    var hamburger = document.getElementById('hamburger');
    var searchModal = document.getElementById('searchModal');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    var loginModal = document.getElementById('loginModal');
    var cartModal = document.getElementById('cartModal');
    var newsletterModal = document.getElementById('newsletterModal');
    var menuOpen = false;
    var searchDebounceTimer = null;

    // ========== HAMBURGER MENU ==========
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            menuOpen = !menuOpen;
            if (menuOpen) {
                dropdownMenu.classList.add('active');
                goldLine.classList.add('active');
            } else {
                dropdownMenu.classList.remove('active');
                goldLine.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (menuOpen && dropdownMenu && !dropdownMenu.contains(e.target) && !hamburger.contains(e.target)) {
            menuOpen = false;
            dropdownMenu.classList.remove('active');
            goldLine.classList.remove('active');
        }
    });

    // ========== SEARCH MODAL ==========
    var searchBtn = document.getElementById('searchBtn');
    var searchClose = document.getElementById('searchClose');

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (searchModal) searchModal.classList.add('active');
            setTimeout(function() { if (searchInput) searchInput.focus(); }, 100);
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', function() {
            if (searchModal) searchModal.classList.remove('active');
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
        });
    }

    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                if (searchInput) searchInput.value = '';
                if (searchResults) searchResults.innerHTML = '';
            }
        });
    }

    function performSearch(query) {
        if (!searchResults || !window.PRODUCTOS) return;
        var trimmed = query.trim().toLowerCase();
        if (trimmed.length === 0) { searchResults.innerHTML = ''; return; }
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
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (searchModal) searchModal.classList.remove('active');
                searchInput.value = '';
                if (searchResults) searchResults.innerHTML = '';
            }
        });
    }

    // ========== LOGIN / SESSION ==========
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
            if (loginModal) loginModal.classList.add('active');
        });
    }

    if (loginClose) {
        loginClose.addEventListener('click', function() { if (loginModal) loginModal.classList.remove('active'); });
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

    // ========== FOOTER "MI CUENTA" LINK ==========
    var footerMiCuenta = document.getElementById('footerMiCuenta');
    if (footerMiCuenta) {
        footerMiCuenta.addEventListener('click', function(e) {
            e.preventDefault();
            checkSession();
            if (loginModal) loginModal.classList.add('active');
        });
    }

    // ========== CART MODAL ==========
    var cartBtn = document.getElementById('cartBtn');
    var cartClose = document.getElementById('cartClose');
    var clearCartBtn = document.getElementById('clearCartBtn');

    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (cartModal) {
                CARRITO.renderModal();
                cartModal.classList.add('active');
            }
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', function() { if (cartModal) cartModal.classList.remove('active'); });
    }

    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) cartModal.classList.remove('active');
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            CARRITO.clear();
            CARRITO.renderModal();
        });
    }
}; // <--- ESTA LLAVE CIERRA EL initSharedUI

// AHORA LAS FUNCIONES FUERA, AL FINAL DEL ARCHIVO:

document.addEventListener('DOMContentLoaded', function() {
    if (window.initSharedUI) initSharedUI();
    
    // Iniciar el numerito de Favoritos
    if (window.FAVORITOS) {
        window.FAVORITOS.updateBadge();
    }
    
    // Eventos de la ventana Modal de Favoritos
    var favBtn = document.getElementById('favBtn');
    var favModal = document.getElementById('favModal');
    var favClose = document.getElementById('favClose');

    if (favBtn && favModal) {
        favBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.FAVORITOS.renderModal();
            favModal.classList.add('active');
        });
    }

    if (favClose) {
        favClose.addEventListener('click', function() {
            if (favModal) favModal.classList.remove('active');
        });
    }

    if (favModal) {
        favModal.addEventListener('click', function(e) {
            if (e.target === favModal) favModal.classList.remove('active');
        });
    }
});
window.enviarNewsletter = function() {
    console.log("¡Cuervo mensajero activado!");
    
    var emailInput = document.getElementById('newsletterEmail');
    var msg = document.getElementById('newsletterMsg');
    var emailValue = emailInput ? emailInput.value.trim() : '';

    if (!emailValue || emailValue.indexOf('@') === -1) {
        alert("Por favor, introduce un email válido.");
        return;
    }

    if (msg) msg.textContent = 'Enviando petición al artesano...';

    emailjs.send('service_spleogq', 'template_ntkeve4', {
        user_email: emailValue,
        reply_to: "info@aceroylino.com"
    }).then(function() {
        alert('¡Suscrito con éxito, mi señor!');
        if (emailInput) emailInput.value = '';
        var modal = document.getElementById('newsletterModal');
        if (modal) modal.classList.remove('active');
    }, function(err) {
        alert('El cuervo se ha perdido (Error de envío)');
        console.error("Fallo EmailJS:", err);
    });
};

// ========================================================
// ========== SISTEMA GLOBAL DE FAVORITOS =================
// ========================================================
window.FAVORITOS = {
    items: (function() {
        var guardados = JSON.parse(localStorage.getItem('mis_favoritos')) || [];
        return guardados.map(item => typeof item === 'object' ? String(item.id) : String(item)).filter(Boolean);
    })(),
    
    showNotification: function(msg) {
        var existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();
        var notif = document.createElement('div');
        notif.className = 'cart-notification';
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(function() { notif.classList.add('show'); }, 10);
        setTimeout(function() {
            notif.classList.remove('show');
            setTimeout(function() { notif.remove(); }, 300);
        }, 2000);
    },

    add: function(id) {
        if(!id) return;
        id = String(id); 
        if(!this.items.includes(id)) {
            this.items.push(id);
            this.save();
            this.updateBadge(); // Suma el numerito
            this.showNotification('¡Añadido a favoritos!');
        } else {
            this.showNotification('Este artículo ya está en favoritos');
        }
    },
    
    remove: function(id) {
        id = String(id);
        this.items = this.items.filter(itemId => itemId !== id);
        this.save();
        this.renderModal();
        this.updateBadge(); // Resta el numerito
    },
    
    save: function() {
        localStorage.setItem('mis_favoritos', JSON.stringify(this.items));
    },

    updateBadge: function() {
        var badge = document.getElementById('favBadge');
        if(badge) {
            var count = this.items.length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },
    
    renderModal: function() {
        const container = document.getElementById('favItems');
        const emptyMsg = document.getElementById('favEmpty');
        if(!container) return;

        container.innerHTML = '';
        
        if(this.items.length === 0) {
            if(emptyMsg) emptyMsg.style.display = 'block';
        } else {
            if(emptyMsg) emptyMsg.style.display = 'none';
            
            this.items.forEach(id => {
                if (!window.PRODUCTOS) return;
                
                // Busca los datos originales (la foto PNG, el nombre, etc.)
                const prod = window.PRODUCTOS.find(p => String(p.id) === String(id));
                if (!prod) return; 

                const div = document.createElement('div');
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.borderBottom = '1px solid rgba(131, 7, 45, 0.2)';
                div.style.padding = '15px 0';
                
                div.innerHTML = `
                    <img src="${prod.imagen}" onerror="this.src='imagenes/placeholder-producto.svg'" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 5px; border: 1px solid var(--gold);">
                    <div style="flex: 1; text-align: left;">
                        <h4 style="margin: 0 0 5px; font-family: 'Metamorphous', cursive; font-size: 15px; color: var(--wine);">${prod.nombre}</h4>
                        <p style="margin: 0; font-family: 'MedievalSharp', cursive; font-size: 14px;">${prod.precio} &euro;</p>
                    </div>
                    <a href="producto.html?id=${prod.id}" style="margin-right: 15px; font-size: 13px; color: var(--wine); text-decoration: underline; font-family: 'Metamorphous', cursive;">Ver</a>
                    <button onclick="window.FAVORITOS.remove('${prod.id}')" style="background: none; border: none; color: #cc0000; font-size: 24px; cursor: pointer;" title="Eliminar">&times;</button>
                `;
                container.appendChild(div);
            });
        }
    }
};

// ========================================================
// ========== EVENTOS DE FAVORITOS (GLOBAL) ===============
// ========================================================
document.addEventListener('DOMContentLoaded', function() {
    // Al cargar la página, se actualiza el número
    if (window.FAVORITOS) {
        window.FAVORITOS.updateBadge();
    }
});

document.addEventListener('click', function(e) {
    // 1. Botón "Añadir a Favoritos" en la ficha de producto
    if (e.target.closest('#addToFavBtn')) {
        e.preventDefault();
        var id = new URLSearchParams(window.location.search).get('id');
        if (id) {
            window.FAVORITOS.add(id);
        }
    }

    // 2. Abrir la ventana de favoritos (Icono del corazón en el menú)
    if (e.target.closest('#favBtn')) {
        var favModal = document.getElementById('favModal');
        if (favModal) {
            window.FAVORITOS.renderModal();
            favModal.classList.add('active');
        }
    }

    // 3. Cerrar la ventana de favoritos (X)
    if (e.target.closest('#favClose')) {
        var favModalClose = document.getElementById('favModal');
        if (favModalClose) favModalClose.classList.remove('active');
    }

    // 4. Cerrar haciendo clic en lo negro
    var favModalTarget = document.getElementById('favModal');
    if (e.target === favModalTarget) {
        favModalTarget.classList.remove('active');
    }
});

// Cerrar con Escape
window.addEventListener('keydown', function(e) {
    var favModal = document.getElementById('favModal');
    if(e.key === 'Escape' && favModal && favModal.classList.contains('active')) {
        favModal.classList.remove('active');
    }
});
