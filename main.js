
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
        <div class="producto">
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
                    <img src="${carrito.some(item => item.id === p.id) ? 'img/cart2.png' : 'img/cart.png'}" alt="Añadir al Carrito">
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

    // Generamos los elementos individuales de la lista
    const HTMLProductos = productosFavoritos.map(p => `
        <li style="display: flex; align-items: center; gap: 12px; width: 100%;">
            <img src="${p.img}" alt="${p.titulo}">
            <div>
                <span>${p.titulo}</span>
                <p>$${p.precio.toLocaleString('es-AR')}</p>
            </div>
            <button class="remove-fav" data-id="${p.id}">
                <img src="img/delete.png" alt="eliminar-favorito">
            </button>
        </li>
    `).join('');

    // Envolvemos los productos en el contenedor de scroll idéntico al carrito
    const HTMLContenedorScroll = productosFavoritos.length > 0
        ? `
            <div class="scroll-interno-favoritos">
                ${HTMLProductos}
            </div>
          `
        : '';

    // Inyectamos la estructura limpia sin romper la jerarquía del menú
    listaFavoritos.innerHTML = HTMLContenedorScroll;

    // Escuchadores de eventos para eliminar
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

    const productosCarrito = productos.filter(p => 
        carrito.some(item => item.id === p.id)
    );

    let totalCompra = 0;

    const HTMLProductos = productosCarrito.map(p => {
        const itemCarrito = carrito.find(item => item.id === p.id);
        const cantidad = itemCarrito ? itemCarrito.cantidad : 1;

        const precioTotal = p.precio * cantidad;
        
        totalCompra += precioTotal;

        return `
            <li>
                <img src="${p.img}" alt="${p.titulo}">
                <div class="text-cart">
                    <span>${p.titulo}</span>
                    <p>$${precioTotal.toLocaleString('es-AR')}</p>
                </div>
                <div class="control-cantidad" style="display: inline-flex; align-items: center; gap: 5px; margin: 0 10px;">
                    <button class="btn-menos" data-id="${p.id}" style="cursor:pointer; padding: 2px 6px;">-</button>
                    <span class="cantidad-num">${cantidad}</span>
                    <button class="btn-mas" data-id="${p.id}" style="cursor:pointer; padding: 2px 5px;">+</button>
                </div>

                <button class="remove-cart" data-id="${p.id}">
                    <img src="img/delete.png" alt="eliminar-carrito">
                </button>
            </li>  
        `;
    }).join('');

    const HTMLTotal = productosCarrito.length > 0 
        ? `
            <div class="total-carrito">
                <span>Total:</span>
                <span>$${totalCompra.toLocaleString('es-AR')}</span>
            </div>
          `
        : '';

    listaCarrito.innerHTML = HTMLProductos + HTMLTotal;

    /*Botón (-)*/
    document.querySelectorAll(".btn-menos").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            const item = carrito.find(item => item.id === id);
            
            if (item) {
                if (item.cantidad > 1) {
                    item.cantidad--;
                }
                guardarCarrito();
            }
        });
    });

    /*Botón (+)*/
    document.querySelectorAll(".btn-mas").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            const item = carrito.find(item => item.id === id);
            
            if (item) {
                if (item.cantidad < 9) { item.cantidad++; }
                guardarCarrito();
            }
        });
    });

    document.querySelectorAll(".remove-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            carrito = carrito.filter(item => item.id !== id);
            guardarCarrito();
        });
    });
}




/*guardar carrito*/
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    if (contenedorCatalogo) renderizarCatalogo();
    if (typeof renderizarDetalle === "function" && document.querySelector("#detalle")) renderizarDetalle();
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
                    ${prod.descripcion}
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

    // Verificamos si ya existe el objeto con ese id en el carrito
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        // Si ya existía en el catálogo y le vuelve a dar click, lo saca (comportamiento toggle original)
        carrito = carrito.filter(item => item.id !== id);
    } else {
        // Si no existía, lo añade como un nuevo objeto iniciando en cantidad 1
        carrito.push({ id: id, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (contenedorCatalogo) renderizarCatalogo();
    renderizarCarrito();
}
//---------------
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});