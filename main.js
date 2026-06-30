
// 1. MENÚES

const primaryFav = document.querySelector('.primary-fav');
const favToggle = document.querySelector('.fav-btn');
const closeFav = document.querySelector('.fav-btn-cerrar');
const listaFavoritos = document.querySelector('.lista-favoritos');

const primaryCart = document.querySelector('.primary-cart');
const cartToggle = document.querySelector('.cart-btn');
const closeCart = document.querySelector('.cart-btn-cerrar');
const listaCarrito = document.querySelector('.lista-carrito');

const closeAll = document.querySelector('.contenido');

if (favToggle) {
    favToggle.addEventListener('click', () => {
       togglePanel(primaryFav);
        primaryCart.setAttribute('data-visible', false);
    });
}
if (closeFav) {
    closeFav.addEventListener('click', () => primaryFav.setAttribute('data-visible', false));
}
if (cartToggle) {
    cartToggle.addEventListener('click', () => {
    togglePanel(primaryCart);
        primaryFav.setAttribute('data-visible', false);
    });
}
if (closeCart) {
    closeCart.addEventListener('click', () => primaryCart.setAttribute('data-visible', false));
}
if (closeAll) {
    closeAll.addEventListener('click', () => {
        primaryFav.setAttribute('data-visible', false);
        primaryCart.setAttribute('data-visible', false);
    });
}

function togglePanel(panel) {
    if (!panel) return;
    const visibility = panel.getAttribute('data-visible');
    panel.setAttribute('data-visible', visibility === "false");
}

let productos = [];
let favoritos = obtenerStorage("favoritos");
let carrito = obtenerStorage("carrito");

const contenedorCatalogo = document.querySelector(".contenedor-catalogo");
const contenedorDetalle = document.querySelector("#detalle"); // Capturamos el contenedor de detalles

function obtenerStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
        localStorage.removeItem(clave);
        return [];
    }
}

//CARGA DE PRODUCTOS

async function cargarProductos() {
    try {
        const res = await fetch("data/productos.json");
        productos = await res.json();
    } catch (error) {
        console.error("Error al cargar los productos", error);
        productos = [];
    }

    if (contenedorCatalogo) {
        renderizarCatalogo();
    }
    if (contenedorDetalle) {
        renderizarDetalle();
    }
    

    renderizarFavoritos();
    renderizarCarrito();
}

//CATÁLOGO

function renderizarCatalogo() {
    contenedorCatalogo.innerHTML = productos.map(p => `
        <div class="pelicula">
            <img src="${p.img}" alt="${p.titulo}">
            <h2>${p.titulo}</h2>
            <p>$${p.precio.toLocaleString('es-AR')}</p>
            
            <div class="container-buttons">
                <!-- Cambiado: Ahora va a detalle.html a secas y lleva el data-id -->
                <a href="detalle.html" class="btn-detalle" data-id="${p.id}">Detalle</a>
                <a href="#" class="btn-fav" data-id="${p.id}">
                    <img src="${favoritos.includes(p.id) ? 'img/fav2.png' : 'img/fav.png'}" alt="Favoritos">
                </a>
                <a href="#" class="btn-cart" data-id="${p.id}">
                    <img src="${carrito.includes(p.id) ? 'img/cart2.png' : 'img/cart.png'}" alt="Añadir al Carrito">
                </a>
            </div>
        </div>
    `).join('');

    document.querySelectorAll(".btn-detalle").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            localStorage.setItem("productoDetalleId", id);
        });
    });

    document.querySelectorAll(".btn-fav").forEach(btn => btn.addEventListener("click", toggleFavorito));
    document.querySelectorAll(".btn-cart").forEach(btn => btn.addEventListener("click", toggleCarrito));
}

//FAVORITOS

function renderizarFavoritos() {

    if (!listaFavoritos) return; 

    const productosFavoritos = productos.filter(p => favoritos.includes(p.id));

    listaFavoritos.innerHTML = productosFavoritos.map(p => `
        <li>

            <img src="${p.img}" alt="${p.titulo}">
            <span>${p.titulo}</span>
            <button class="remove-fav" data-id="${p.id}">
                <img src="img/delete.png" alt="eliminar-favorito">
            </button>
        </li>
    `).join('');

    document.querySelectorAll(".remove-fav").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
        favoritos = favoritos.filter(favId => favId !== id);
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            renderizarFavoritos();
            if (contenedorCatalogo) renderizarCatalogo();
        });
    });
}

//CARRITO

function renderizarCarrito() {
    if (!listaCarrito) return;

    const productosCarrito = productos.filter(p => carrito.includes(p.id));

    listaCarrito.innerHTML = productosCarrito.map(p => `
        <li>
            <img src="${p.img}" alt="${p.titulo}">
            <span>${p.titulo}</span>
            <button class="remove-cart" data-id="${p.id}">
                <img src="img/delete.png" alt="eliminar-carrito">
            </button>
        </li>
    `).join('');

    document.querySelectorAll(".remove-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            carrito = carrito.filter(cartId => cartId !== id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderizarCarrito();
            if (contenedorCatalogo) renderizarCatalogo();
        });
    });
}


//DETALLE
function renderizarDetalle() {
    const idGuardado = localStorage.getItem("productoDetalleId");
    const id = Number(idGuardado); 
    
    const prod = productos.find(p => Number(p.id) === id);
    
    if (!contenedorDetalle) return;

    if (!prod) {   return;
    }

    const enCarrito = carrito.some(item => Number(item) === Number(prod.id));

    contenedorDetalle.innerHTML = `
        <div class="contenedor-principal-detalle">
            
            <div class="columna-imagen">
                <img src="${prod.img}" alt="${prod.titulo}">
            </div>
            
            <div class="columna-info">
                <h1>${prod.titulo}</h1>
                <p class="precio">$${prod.precio.toLocaleString('es-AR')}</p>
            
                <p class="descripcion" style="margin-top: 20px; font-family: sans-serif;">
                    ${prod.descripcion || "Sin descripción disponible."}
                </p>

                <div class="container-buttons">
                    <button class="btn-fav" data-id="${prod.id}">
                        <img src="${favoritos.includes(prod.id) ? 'img/fav4.png' : 'img/fav3.png'}" alt="Favorito">
                    </button>
                    <button class="btn-cart" data-id="${prod.id}">
                        <img src="${enCarrito ? 'img/cart4.png' : 'img/cart3.png'}" alt="Carrito">
                    </button>
                </div>
            </div>

        </div>`;
}


// 5. TOGGLES

function toggleFavorito(e) {
    e.preventDefault();
    const id = e.currentTarget.dataset.id;

    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id);
    } else {
        favoritos.push(id);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    if (contenedorCatalogo) renderizarCatalogo();
    renderizarFavoritos();
}
//-------------
function toggleCarrito(e) {
    e.preventDefault();
    const id = e.currentTarget.dataset.id;

    if (carrito.includes(id)) {
        carrito = carrito.filter(cartId => cartId !== id);
    } else {
        carrito.push(id);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (contenedorCatalogo) renderizarCatalogo();
    renderizarCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});