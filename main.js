// Menus laterales

const primaryFav = document.querySelector('.primary-fav');
const favToggle = document.querySelector('.fav-btn');
const closeFav = document.querySelector('.fav-btn-cerrar');
const listaFavoritos = document.querySelector('.lista-favoritos');

const primaryCart = document.querySelector('.primary-cart');
const cartToggle = document.querySelector('.cart-btn');
const closeCart = document.querySelector('.cart-btn-cerrar');
const listaCarrito = document.querySelector('.lista-carrito');

const closeAll = document.querySelector('.contenido');

favToggle.addEventListener('click', () => {
    togglePanel(primaryFav);
    primaryCart.setAttribute('data-visible', false);
});

closeFav.addEventListener('click', () => {
    primaryFav.setAttribute('data-visible', false);
});

cartToggle.addEventListener('click', () => {
    togglePanel(primaryCart);
    primaryFav.setAttribute('data-visible', false);
});

closeCart.addEventListener('click', () => {
    primaryCart.setAttribute('data-visible', false);
});

closeAll.addEventListener('click', () => {
    primaryFav.setAttribute('data-visible', false);
    primaryCart.setAttribute('data-visible', false);
});

function togglePanel(panel) {
    const visibility = panel.getAttribute('data-visible');
    panel.setAttribute('data-visible', visibility === "false");
}

// Catalogo, favoritos y carrito

let productos = [];
let favoritos = obtenerStorage("favoritos");
let carrito = obtenerStorage("carrito");

const contenedorCatalogo = document.querySelector(".contenedor-catalogo");

function obtenerStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    }
    catch (error) {
        localStorage.removeItem(clave);
        return [];
    }
}

async function cargarProductos() {
    try {
        const res = await fetch("data/productos.json");
        productos = await res.json();
    }
    catch (error) {
        console.error("Error al cargar los productos", error);
        productos = [];
    }

    renderizarCatalogo();
    renderizarFavoritos();
    renderizarCarrito();
}

function renderizarCatalogo() {
    contenedorCatalogo.innerHTML = '';
    const catalogo = productos.map(p => `
        <div class="pelicula">
            <img src="${p.img}" alt="${p.titulo}">
            <h2>${p.titulo}</h2>
            <p>$${p.precio.toLocaleString('es-AR')}</p>
            
            <div class="container-buttons">
                <a href="${p.detalle}" class="btn-detalle">Detalle</a>
                <a href="#" class="btn-fav" data-id="${p.id}">
                    <img src="${favoritos.includes(p.id) ? 'img/fav2.png' : 'img/fav.png'}" alt="Favoritos">
                </a>
                <a href="#" class="btn-cart" data-id="${p.id}">
                    <img src="${carrito.includes(p.id) ? 'img/cart2.png' : 'img/cart.png'}" alt="Añadir al Carrito">
                </a>
            </div>
        </div>
    `).join('');

    contenedorCatalogo.innerHTML = catalogo;

    document.querySelectorAll(".btn-fav").forEach(btn => {
        btn.addEventListener("click", toggleFavorito);
    });

    document.querySelectorAll(".btn-cart").forEach(btn => {
        btn.addEventListener("click", toggleCarrito);
    });

src="${favoritos.includes(p.id) ? 'img/fav2.png' : 'img/fav.png'}"
};

function toggleFavorito(e) {
    e.preventDefault();

    const boton = e.currentTarget;
    const id = boton.dataset.id;
    const imagen = boton.querySelector("img");

    if(favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id);
        imagen.src = "img/fav.png";
    }
    else {
        favoritos.push(id);
        imagen.src = "img/fav2.png";
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    renderizarFavoritos();
};

function toggleCarrito(e) {
    e.preventDefault();

    const boton = e.currentTarget;
    const id = boton.dataset.id;
    const imagen = boton.querySelector("img");

    if(carrito.includes(id)) {
        carrito = carrito.filter(cartId => cartId !== id);
        imagen.src = "img/cart.png";
    }
    else {
        carrito.push(id);
        imagen.src = "img/cart2.png";
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
};

/*function renderizarFavoritos() {
    const productosFavoritos = productos.filter(p => favoritos.includes(p.id));

    listaFavoritos.innerHTML = productosFavoritos.map(p => `
        <li>
            <img src="${p.img}" alt="${p.titulo}">
            <span>${p.titulo}</span>
            <button class="remove-fav" data-id="${p.id}"><img src="img/delete.png" alt="eliminar-favorito"></button>
        </li>
    `).join('');
}*/

function renderizarFavoritos() {
    const productosFavoritos = productos.filter(p => favoritos.includes(p.id));

    // 1. Dibujamos la lista de favoritos en el menú lateral
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
            renderizarCatalogo();
        });
    });
}

/**********************/

function renderizarCarrito() {
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
            renderizarCatalogo();
        });
    });

}

document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
});
