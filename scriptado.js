document.addEventListener('DOMContentLoaded', function() {
    
    // ========== VARIABLES GLOBALES ==========
    var dropdownMenu = document.getElementById('dropdownMenu');
    var goldLine = document.getElementById('goldLine');
    var hamburger = document.getElementById('hamburger');
    var searchModal = document.getElementById('searchModal');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    var loginModal = document.getElementById('loginModal');
    var cartModal = document.getElementById('cartModal');
    var menuOpen = false;
    var searchDebounceTimer = null;

    // ========== DYNAMIC PRODUCT LOADING ==========
    function loadProducts() {
        if (!window.PRODUCTOS) return;

        var ofertasContainer = document.getElementById('carousel-ofertas');
        var novedadesContainer = document.getElementById('carousel-novedades');

        if (ofertasContainer) {
            var ofertasProducts = window.PRODUCTOS.filter(function(p) { return p.seccion === 'ofertas'; });
            ofertasContainer.innerHTML = '';
            ofertasProducts.forEach(function(producto) {
                ofertasContainer.innerHTML += createProductCard(producto);
            });
        }

        if (novedadesContainer) {
            var novedadesProducts = window.PRODUCTOS.filter(function(p) { return p.seccion === 'novedades'; });
            novedadesContainer.innerHTML = '';
            novedadesProducts.forEach(function(producto) {
                novedadesContainer.innerHTML += createProductCard(producto);
            });
        }
    }

    function createProductCard(producto) {
        return '<div class="product-card">' +
            '<a href="producto.html?id=' + producto.id + '">' +
            '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
            '<div class="product-card-name">' + producto.nombre + '</div>' +
            '<div class="product-card-price">' + producto.precio + ' &euro;</div>' +
            '</a></div>';
    }

    loadProducts();

    // Carousel state
    var carousels = {
        ofertas: { currentIndex: 0 },
        novedades: { currentIndex: 0 }
    };

    // ========== HAMBURGER MENU ==========
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
    var searchBtn = document.getElementById('searchBtn');
    var searchClose = document.getElementById('searchClose');

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

    // ========== EFFICIENT SEARCH WITH DEBOUNCE ==========
    function performSearch(query) {
        if (!searchResults || !window.PRODUCTOS) return;

        var trimmed = query.trim().toLowerCase();
        if (trimmed.length === 0) {
            searchResults.innerHTML = '';
            return;
        }

        var terms = trimmed.split(/\s+/);
        var results = window.PRODUCTOS.filter(function(producto) {
            var searchable = (producto.nombre + ' ' + producto.descripcion + ' ' + producto.categoria).toLowerCase();
            return terms.every(function(term) {
                return searchable.indexOf(term) !== -1;
            });
        });

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No se encontraron productos para "' + query.trim() + '"</div>';
            return;
        }

        var html = '';
        results.forEach(function(producto) {
            html += '<a href="/producto.html?id=' + producto.id + '" class="search-result-item">' +
                '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" class="search-result-img">' +
                '<div class="search-result-info">' +
                '<div class="search-result-name">' + producto.nombre + '</div>' +
                '<div class="search-result-cat">' + producto.categoria + '</div>' +
                '</div>' +
                '<div class="search-result-price">' + producto.precio + ' &euro;</div>' +
                '</a>';
        });
        searchResults.innerHTML = html;
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchDebounceTimer);
            var query = searchInput.value;
            searchDebounceTimer = setTimeout(function() {
                performSearch(query);
            }, 200);
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchModal.classList.remove('active');
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
                if (user && user.email) {
                    showLoggedIn(user.email);
                    return true;
                }
            } catch(e) {
                sessionStorage.removeItem('aceroylino_user');
            }
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

    // Check session on load
    checkSession();

    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            checkSession();
            loginModal.classList.add('active');
        });
    }

    if (loginClose) {
        loginClose.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    if (loginSubmit) {
        loginSubmit.addEventListener('click', function() {
            var email = loginEmail ? loginEmail.value.trim() : '';
            var password = loginPassword ? loginPassword.value.trim() : '';

            if (!email || !password) {
                if (loginError) loginError.textContent = 'Por favor, rellena todos los campos.';
                return;
            }

            // Simple email format check
            if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
                if (loginError) loginError.textContent = 'Introduce un email valido.';
                return;
            }

            // Demo login - accept any valid format
            sessionStorage.setItem('aceroylino_user', JSON.stringify({ email: email, loggedIn: true }));
            showLoggedIn(email);
        });
    }

    if (loginPassword) {
        loginPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && loginSubmit) {
                loginSubmit.click();
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('aceroylino_user');
            showLoggedOut();
        });
    }

    // ========== CART MODAL ==========
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

    // ========== CLOSE MODALS WITH ESC ==========
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
            if (menuOpen) {
                menuOpen = false;
                dropdownMenu.classList.remove('active');
                goldLine.classList.remove('active');
            }
        }
    });

    // ========== CAROUSEL FUNCTIONALITY ==========
    function getVisibleItems() {
        if (window.innerWidth < 768) return 2;
        if (window.innerWidth < 1200) return 3;
        return 3;
    }

    function moveCarousel(carouselId, direction) {
        var carousel = document.getElementById('carousel-' + carouselId);
        if (!carousel) return;

        var cards = carousel.querySelectorAll('.product-card');
        if (cards.length === 0) return;

        var visibleItems = getVisibleItems();
        var maxIndex = Math.max(0, cards.length - visibleItems);
        
        carousels[carouselId].currentIndex += direction;
        
        if (carousels[carouselId].currentIndex < 0) {
            carousels[carouselId].currentIndex = maxIndex;
        } else if (carousels[carouselId].currentIndex > maxIndex) {
            carousels[carouselId].currentIndex = 0;
        }

        var cardWidth = cards[0].offsetWidth; 
        var gap = 20;
        var moveAmount = (cardWidth + gap) * carousels[carouselId].currentIndex;
        
        carousel.style.transform = 'translateX(-' + moveAmount + 'px)';
    }

    var carouselButtons = document.querySelectorAll('.carousel-btn');
    carouselButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var carouselId = btn.getAttribute('data-carousel');
            var directionStr = btn.getAttribute('data-dir');
            var direction = directionStr === 'prev' ? -1 : 1;
            moveCarousel(carouselId, direction);
        });
    });

    window.addEventListener('resize', function() {
        Object.keys(carousels).forEach(function(id) {
            carousels[id].currentIndex = 0;
            var carousel = document.getElementById('carousel-' + id);
            if (carousel) carousel.style.transform = 'translateX(0px)';
        });
    });

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

    // Add newsletter modal to ESC handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (newsletterModal && newsletterModal.classList.contains('active')) {
                newsletterModal.classList.remove('active');
            }
        }
    });

});
