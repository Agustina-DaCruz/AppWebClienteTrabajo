/*
const primaryNav = document.querySelector('.primary-navigation');
const menuBtn = document.querySelector('.menu-btn');

function menuPrincipal() {

    const visibility = primaryNav.getAttribute('data-visible');

    if(visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
        menuBtn.setAttribute('aria-expanded', true);
    } else if(visibility === "true") {
        primaryNav.setAttribute('data-visible', false);
        menuBtn.setAttribute('aria-expanded', false);
    }
}

menuBtn.addEventListener('click', menuPrincipal);

let productos = [];

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const contenedorCatalogo = document.querySelector(".contenedor-catalogo");

async function cargarProductos() {

    try {
        const res = await fetch("data/productos.json");
        productos = await res.json();
        renderizarCatalogo();
    }
    catch (error) {
        console.error("Error al cargar los productos", error);
    }
}

function renderizarCatalogo() {
    contenedorCatalogo.innerHTML = '';
    const catalogo = productos.map(p => `
         <div class="peliculas-container">
            <div class="pelicula">
                <img src="${p.img}" alt="${p.titulo}">
                <h2>${p.titulo}</h2>
                <p>$${p.precio.toLocaleString('es-AR')}</p>
                
                <div class="container-buttons">
                    <a href="/redirect/peliculas/redirect/${p.id}/${p.id}.html" class="btn-detalle">Detalle</a>
                    <a href="#" class="btn-fav" data-id="${p.id}">
                    <img src="${favoritos.includes(p.id) ? 'img/fav2.png' : 'img/fav.png'}" alt="Favoritos"></a>
                    <a href="#" class="btn-cart"><img src="img/cart.png" alt="Añadir al Carrito"></a>
                </div>
            </div>
        `).join('');

contenedorCatalogo.innerHTML = catalogo;

document.querySelectorAll(".btn-fav").forEach(btn => {
    btn.addEventListener("click", toggleFavorito);
})};

function toggleFavorito(e) {
    const boton = e.currentTarget;
    const id = Number(boton.dataset.id);
    const imagen = boton.querySelector("img");
    if(favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id);
        imagen.src = "img/fav.png";
        e.target.classList.remove("active");
    }
    else {
        favoritos.push(id);
        imagen.src = "img/fav2.png";
        e.target.classList.add("active");
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
};

document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
});


*/