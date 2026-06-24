const primaryNav = document.querySelector('.primary-navigation');
const menuBtn = document.querySelector('.menu-btn');

function menuCarrito() {

    const visibility = primaryNav.getAttribute('data-visible');

    if(visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
    } else if(visibility === "true") {
        primaryNav.setAttribute('data-visible', false);
    }
}

menuBtn.addEventListener('click', menuCarrito);

/**********************************************/

const primaryFav = document.querySelector('.primary-navigation');
const favBtn = document.querySelector('.fav-btn');

function menuFavoritos() {

    const visibility = primaryFav.getAttribute('data-visible');

    if(visibility === "false") {
        primaryFav.setAttribute('data-visible', true);
    } else if(visibility === "true") {
        primaryFav.setAttribute('data-visible', false);
    }
}

favBtn.addEventListener('click', menuFavoritos);

const productosFallback = [
    {
        id: "avengers1",
        titulo: "Avengers",
        precio: 15000,
        img: "img/posters/avengers1.jpg",
        detalle: "/redirect/peliculas/redirect/avengers1/avengers1.html"
    },
    {
        id: "hp8",
        titulo: "Harry Potter 7 pt2",
        precio: 16000,
        img: "img/posters/hp8.jpg",
        detalle: "#"
    },
    {
        id: "batman1",
        titulo: "Batman Begins",
        precio: 16000,
        img: "img/posters/batman1.jpg",
        detalle: "#"
    },
    {
        id: "sw",
        titulo: "Star Wars Episode I",
        precio: 15000,
        img: "img/posters/sw.jpg",
        detalle: "#"
    },
    {
        id: "st",
        titulo: "Stranger Things",
        precio: 15000,
        img: "img/posters/st.jpg",
        detalle: "#"
    },
    {
        id: "got",
        titulo: "Game of Thrones",
        precio: 16000,
        img: "img/posters/got.jpg",
        detalle: "#"
    },
    {
        id: "tlou",
        titulo: "The Last of Us",
        precio: 16000,
        img: "img/posters/tlou.jpg",
        detalle: "#"
    },
    {
        id: "daredevil",
        titulo: "Daredevil",
        precio: 15000,
        img: "img/posters/daredevil.jpg",
        detalle: "#"
    }
];

let productos = [];

let favoritos = obtenerFavoritos();
let carrito = obtenerCarrito();

const contenedorCatalogo = document.querySelector(".contenedor-catalogo");

function obtenerFavoritos() {
    try {
        return JSON.parse(localStorage.getItem("favoritos")) || [];
    }
    catch (error) {
        localStorage.removeItem("favoritos");
        return [];
    }
}

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    }
    catch (error) {
        localStorage.removeItem("carrito");
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
        productos = productosFallback;
    }

    renderizarCatalogo();
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
    })

    document.querySelectorAll(".btn-cart").forEach(btn => {
        btn.addEventListener("click", toggleCarrito);
    })
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
};

document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
});
