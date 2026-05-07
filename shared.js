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

        // === NUEVO CÁLCULO DE ENVÍO Y DISEÑO ===
        // Calculamos los números
        var subtotal = this.getTotal();
        var envio = subtotal > 0 ? 5.00 : 0; // Si no hay productos, 0€ de envío
        var totalFinal = subtotal + envio;

        // Actualizamos el número del HTML original
        if (totalEl) totalEl.textContent = totalFinal.toFixed(2);

        // Buscamos el contenedor donde están los botones y el total
        var cartActions = document.getElementById('cartActions');
        if (cartActions) {
            // Primero, borramos inyecciones viejas por si acaso (para no duplicar al sumar más cosas)
            var viejosDesgloses = cartActions.querySelectorAll('.desglose-envio');
            viejosDesgloses.forEach(function(el) { el.remove(); });

            // Buscamos la fila original del "TOTAL:"
            var totalRow = cartActions.querySelector('.cart-total-row:not(.desglose-envio)');
            
            if (totalRow && subtotal > 0) {
                // Le cambiamos el texto a "TOTAL FINAL:"
                var label = totalRow.querySelector('.cart-total-label');
                if (label) label.textContent = 'TOTAL FINAL:';

                // Creamos el HTML del subtotal y envío usando tus clases CSS originales
                var desgloseHTML = 
                    '<div class="cart-total-row desglose-envio" style="border-bottom: none; margin-bottom: 5px;">' +
                        '<span class="cart-total-label">Subtotal:</span>' +
                        '<span class="cart-total-amount">' + subtotal.toFixed(2) + ' &euro;</span>' +
                    '</div>' +
                    '<div class="cart-total-row desglose-envio" style="border-bottom: 1px solid rgba(131, 7, 45, 0.2); padding-bottom: 10px; margin-bottom: 10px;">' +
                        '<span class="cart-total-label">Gastos de envío:</span>' +
                        '<span class="cart-total-amount">' + envio.toFixed(2) + ' &euro;</span>' +
                    '</div>';
                
                // Lo insertamos justo antes de la fila del TOTAL FINAL
                totalRow.insertAdjacentHTML('beforebegin', desgloseHTML);
            }
        }
    } // <--- Cierre de la función renderModal
}; // <--- Cierre del objeto CARRITO
        // =======================================a
// ========================================================
// ========== SISTEMA GLOBAL DE FAVORITOS =================
// ========================================================
window.FAVORITOS = {
    getItems: function() {
        try {
            var items = JSON.parse(localStorage.getItem('aceroylino_favoritos') || '[]');
            return Array.isArray(items) ? items : [];
        } catch(e) { return []; }
    },

    saveItems: function(items) {
        localStorage.setItem('aceroylino_favoritos', JSON.stringify(items));
        this.updateBadge();
    },
    
    add: function(productoId) {
        if (!window.PRODUCTOS) {
            console.error("Base de datos de productos no cargada.");
            return;
        }

        var productoDb = window.PRODUCTOS.find(function(p) { return String(p.id) === String(productoId); });
        if(!productoDb) return;

        var items = this.getItems();
        var existe = items.find(function(item) { return String(item.id) === String(productoId); });
        
        if(!existe) {
            items.push({
                id: String(productoDb.id),
                nombre: productoDb.nombre,
                precio: productoDb.precio,
                imagen: productoDb.imagen
            });
            this.saveItems(items);
            this.showNotification('Añadido a tus favoritos'); 
        } else {
            this.showNotification('Este articulo ya esta en favoritos.');
        }
    },
    
    remove: function(id) {
        var items = this.getItems().filter(function(item) { return String(item.id) !== String(id); });
        this.saveItems(items);
        this.renderModal(); 
    },
    
    getCount: function() {
        return this.getItems().length;
    },
    
    renderModal: function() {
        var container = document.getElementById('favItems');
        var emptyMsg = document.getElementById('favEmpty');
        if(!container) return;

        container.innerHTML = '';
        var items = this.getItems();
        
        if(items.length === 0) {
            if(emptyMsg) emptyMsg.style.display = 'block';
        } else {
            if(emptyMsg) emptyMsg.style.display = 'none';
            var self = this;
            items.forEach(function(item) {
                var div = document.createElement('div');
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.borderBottom = '1px solid rgba(131, 7, 45, 0.2)';
                div.style.padding = '15px 0';
                div.innerHTML = 
                    '<img src="' + item.imagen + '" onerror="this.src=\'imagenes/placeholder-producto.svg\'" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 5px; border: 1px solid var(--gold);">' +
                    '<div style="flex: 1; text-align: left;">' +
                        '<h4 style="margin: 0 0 5px; font-family: \'Metamorphous\', cursive; font-size: 15px; color: var(--wine);">' + item.nombre + '</h4>' +
                        '<p style="margin: 0; font-family: \'MedievalSharp\', cursive; font-size: 14px;">' + item.precio + ' &euro;</p>' +
                    '</div>' +
                    '<a href="producto.html?id=' + item.id + '" style="margin-right: 15px; font-size: 13px; color: var(--wine); text-decoration: underline; font-family: \'Metamorphous\', cursive;">Ver</a>' +
                    '<button data-fav-remove="' + item.id + '" style="background: none; border: none; color: #cc0000; font-size: 24px; cursor: pointer;">&times;</button>';
                container.appendChild(div);
            });
            
            // Event delegation for remove buttons
            container.onclick = function(e) {
                var btn = e.target.closest('[data-fav-remove]');
                if (btn) {
                    var id = btn.getAttribute('data-fav-remove');
                    self.remove(id);
                }
            };
        }
    },

    updateBadge: function() {
        var badge = document.getElementById('favBadge');
        var count = this.getCount();
        if(badge) {
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

    addCurrentProduct: function() {
        var params = new URLSearchParams(window.location.search);
        var productId = params.get('id');
        if (productId) {
            this.add(productId);
        }
    }
};

// Inicializar badge de favoritos al cargar
window.FAVORITOS.updateBadge();
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
// ========== PASARELA DE PAGO (BLINDADA) =================
// ========================================================

// 1. Función para abrir la pasarela
window.abrirPasarela = function() {
    var cartModal = document.getElementById('cartModal');
    if(cartModal) cartModal.classList.remove('active');
    
    var checkoutModal = document.getElementById('checkoutModal');
    if(checkoutModal) {
        checkoutModal.classList.add('active');
        var formContainer = document.getElementById('checkoutFormContainer');
        var successMsg = document.getElementById('checkoutSuccess');
        
        if (formContainer) formContainer.style.display = 'block';
        if (successMsg) successMsg.style.display = 'none';
    }
};

// 2. Controlar los botones de Tarjeta y PayPal
document.addEventListener('change', function(e) {
    if (e.target.id === 'radioCard') {
        var formCard = document.getElementById('formCard');
        var formPaypal = document.getElementById('formPaypal');
        if(formCard) formCard.style.display = 'block';
        if(formPaypal) formPaypal.style.display = 'none';
    } 
    else if (e.target.id === 'radioPaypal') {
        var formCard = document.getElementById('formCard');
        var formPaypal = document.getElementById('formPaypal');
        if(formCard) formCard.style.display = 'none';
        if(formPaypal) formPaypal.style.display = 'block';
    }
});

// 3. Controlar el botón de PAGAR AHORA
document.addEventListener('click', function(e) {
    // Si el usuario hace clic en el botón de pagar
    if (e.target.id === 'paySubmitBtn') {
        e.preventDefault();
        
        var formContainer = document.getElementById('checkoutFormContainer');
        var successMsg = document.getElementById('checkoutSuccess');
        
        // Ocultar formulario y mostrar mensaje de validado
        if (formContainer) formContainer.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
        
        // Vaciar el carrito
        if(window.CARRITO) {
            window.CARRITO.clear();
            window.CARRITO.renderModal();
        }
        
        // Cerrar la ventana tras 5 segundos
        setTimeout(function() {
            var checkoutModal = document.getElementById('checkoutModal');
            if(checkoutModal) checkoutModal.classList.remove('active');
        }, 5000);
    }
    
    // Si el usuario hace clic en la X de cerrar la pasarela
    if (e.target.id === 'checkoutClose') {
        var checkoutModal = document.getElementById('checkoutModal');
        if(checkoutModal) checkoutModal.classList.remove('active');
    }
});