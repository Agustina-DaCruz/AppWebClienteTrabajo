const productosCatalogo = [

    { id: 1, nombre: "Producto 1", precio: 100 },
    { id: 2, nombre: "Producto 2", precio: 200 },
    { id: 3, nombre: "Producto 3", precio: 300 },
    { id: 4, nombre: "Producto 4", precio: 400 },
    { id: 5, nombre: "Producto 5", precio: 500 },
    { id: 6, nombre: "Producto 6", precio: 600 },
    { id: 7, nombre: "Producto 7", precio: 700 },
    { id: 8, nombre: "Producto 8", precio: 800 }

];


const catalogo = productosCatalogo.map(producto => ``).join(''); /* poner en los backticks el HTML de los productos */

document.querySelector('.contenedor-catalogo').innerHTML = catalogo; /* poner nombre de contenedor en el queryselector */