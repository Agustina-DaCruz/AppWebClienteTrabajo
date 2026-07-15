
// MENÚES

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

let productos = [];
let favoritos = obtenerStorage("favoritos");
let carrito = obtenerStorage("carrito");

const contenedorCatalogo = document.querySelector(".contenedor-catalogo");
const contenedorDetalle = document.querySelector("#detalle");

function obtenerStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
        localStorage.removeItem(clave);
        return [];
    }
}

//CARGA DE PRODUCTOS


const AIRTABLE_BASE_ID = 'appqQDtcDfq4y7tBX';
const AIRTABLE_PAT = 'pat0Lt3APUTdD6yHg.5f3dfe0d54f35161b4cac81e96b4db910cc42542481c4a3267dbd26870ce0644';

async function cargarProductos() {
    try {
        const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/productos`, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_PAT}`
            }
        });

        const data = await res.json();
        
        productos = data.records.map(r => {
            return {
                ...r.fields,
                id: String(r.fields.id)
            };
        });

        console.log("PRODUCTOS DESDE AIRTABLE PROCESADOS:", productos);

        if (contenedorCatalogo) {
            renderizarCatalogo();
        }
        if (contenedorDetalle) {
            renderizarDetalle();
        }
        
        renderizarFavoritos();
        renderizarCarrito();
        actualizarContadorFavoritos();
        actualizarContadorCarrito();

    } catch (error) {
        console.error("Error al cargar los productos", error);
    }
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
                    <img src="${favoritos.includes(p.id) ? 'img/fav2.svg' : 'img/fav.svg'}" alt="Favoritos">
                </a>
                <a href="#" class="btn-cart" data-id="${p.id}">
                    <img src="${carrito.some(item => item.id === p.id) ? 'img/cart2.svg' : 'img/cart.svg'}" alt="Añadir al Carrito">
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

// FAVORITOS

function renderizarFavoritos() {

    if (!listaFavoritos) return; 

    const productosFavoritos = productos.filter(p => favoritos.includes(p.id));

    const HTMLProductos = productosFavoritos.map(p => `
        <li>
            <img class="img-fav" src="${p.img}" alt="${p.titulo}">
            <div>
                <span>${p.titulo}</span>
                <p>$${p.precio.toLocaleString('es-AR')}</p>
            </div>
            <button class="remove-fav" data-id="${p.id}">
                <img src="img/delete.svg" alt="eliminar-favorito">
            </button>
        </li>
    `).join('');

    const HTMLContenedorScroll = productosFavoritos.length > 0
        ? `
            <div class="scroll-interno-favoritos">
                ${HTMLProductos}
            </div>
          `
        : '';

    listaFavoritos.innerHTML = HTMLContenedorScroll;

    document.querySelectorAll(".remove-fav").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            favoritos = favoritos.filter(favId => favId !== id);
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            
            renderizarFavoritos();
            actualizarContadorFavoritos();
            actualizarContadorCarrito();
            
            if (contenedorCatalogo) renderizarCatalogo();
            
            if (typeof renderizarDetalle === "function" && document.querySelector("#detalle")) {
                renderizarDetalle();
            }
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
                <img class="img-cart" src="${p.img}" alt="${p.titulo}">
                <div class="text-cart">
                    <span>${p.titulo}</span>
                    <p>$${precioTotal.toLocaleString('es-AR')}</p>
                </div>
                <div class="control-cantidad">
                    <button class="btn-menos" data-id="${p.id}">-</button>
                    <span class="cantidad-num">${cantidad}</span>
                    <button class="btn-mas" data-id="${p.id}">+</button>
                </div>

                <button class="remove-cart" data-id="${p.id}">
                    <img src="img/delete.svg" alt="eliminar-carrito">
                </button>
            </li>  
        `;
    }).join('');

    const HTMLContenedorScroll = productosCarrito.length > 0
        ? `
            <div class="scroll-interno-carrito">
                ${HTMLProductos}
            </div>
          `
        : '';

    const HTMLTotal = productosCarrito.length > 0 
        ? `
            <div class="total-carrito">
                <span>Total:</span>
                <span>$${totalCompra.toLocaleString('es-AR')}</span>
            </div>
          `
        : '';

    listaCarrito.innerHTML = HTMLContenedorScroll + HTMLTotal;

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

    if (!prod) return;

    const prodIdString = String(prod.id);
    const enCarrito = carrito.some(item => String(item.id) === prodIdString);
    const enFavoritos = favoritos.includes(prodIdString);

    contenedorDetalle.innerHTML = `
        <div class="contenedor-principal-detalle">
            
            <div class="columna-imagen">
                <img src="${prod.img}" alt="${prod.titulo}">
            </div>
            
            <div class="columna-info">
                <h1>${prod.titulo}</h1>
                <p class="precio">$${prod.precio.toLocaleString('es-AR')}</p>
            
                <p class="descripcion">
                    ${prod.descripcion}
                </p>

                <div class="container-buttons">
                    <button class="btn-fav" data-id="${prod.id}">
                        <img src="${enFavoritos ? 'img/fav4.svg' : 'img/fav3.svg'}" alt="Favorito">
                    </button>
                    <button class="btn-cart" data-id="${prod.id}">
                        <img src="${enCarrito ? 'img/cart4.svg' : 'img/cart3.svg'}" alt="Carrito">
                    </button>
                </div>
            </div>

        </div>`;

    const btnFavDetalle = contenedorDetalle.querySelector(".btn-fav");
    const btnCartDetalle = contenedorDetalle.querySelector(".btn-cart");

    if (btnFavDetalle) {
        btnFavDetalle.addEventListener("click", (e) => {
            toggleFavorito(e);
            renderizarDetalle();
        });
    }

    if (btnCartDetalle) {
        btnCartDetalle.addEventListener("click", (e) => {
            toggleCarrito(e);
            renderizarDetalle();
        });
    }
}


//TOGGLES

function togglePanel(panel) {
    if (!panel) return;
    const visibility = panel.getAttribute('data-visible');
    panel.setAttribute('data-visible', visibility === "false");
}


function toggleFavorito(e) {
    e.preventDefault();
    const id = e.currentTarget.dataset.id;

    const existe = favoritos.find(favId => favId === id);

    if (existe) {
        favoritos = favoritos.filter(favId => favId !== id);
    } else {
        favoritos.push(id);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    if (contenedorCatalogo) renderizarCatalogo();
    renderizarFavoritos();
    actualizarContadorFavoritos();
}



function toggleCarrito(e) {
    e.preventDefault();
    const id = e.currentTarget.dataset.id;

    const existe = carrito.find(item => item.id === id);

    if (existe) {
        carrito = carrito.filter(item => item.id !== id);
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (contenedorCatalogo) renderizarCatalogo();
    renderizarCarrito();
    actualizarContadorCarrito();
}


/*PRUEBA*/

// NUEVA FUNCIÓN: Cuenta cuántos favoritos hay y actualiza el header
function actualizarContadorFavoritos() {
    const contador = document.getElementById("contador-favoritos");
    if (!contador) return; // Seguridad por si no estamos en una página con header

    const cantidad = favoritos.length;
    contador.textContent = cantidad;

    // Opcional: Si querés ocultar la burbuja cuando está en 0
    if (cantidad > 0) {
        contador.style.display = "flex";
    } else {
        contador.style.display = "none";
    }
}

// NUEVA FUNCIÓN: Cuenta cuántos productos hay en el carrito y actualiza el header
function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (!contador) return; // Seguridad por si no estamos en una página con header

    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = cantidad;

    // Opcional: Si querés ocultar la burbuja cuando está en 0
    if (cantidad > 0) {
        contador.style.display = "flex";
    } else {
        contador.style.display = "none";
    }
}


//---------------
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});
