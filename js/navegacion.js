// =========================================
// navegacion.js
// Se encarga de moverse entre el menú principal y los juegos.
// =========================================

// Rutas de cada juego, escritas desde la carpeta principal (donde está index.html)
const rutasDeJuegos = {
    parejas: "juegos/parejas/parejas.html",
    figuras: "juegos/figuras/figuras.html",
    secuencias: "juegos/secuencias/secuencias.html",
    preguntas: "juegos/preguntas/preguntas.html",
    laberinto: "juegos/laberinto/laberinto.html"
};

// Abre el juego indicado. Se usa desde el menú principal.
// Ejemplo: irAJuego("parejas")
function irAJuego(nombreDelJuego) {
    const ruta = rutasDeJuegos[nombreDelJuego];

    if (ruta) {
        window.location.href = ruta;
    } else {
        console.log("No existe un juego llamado: " + nombreDelJuego);
    }
}

// Regresa al menú principal. Se usa desde dentro de cada juego.
// Los juegos están dos carpetas más adentro, por eso usamos "../../"
function volverAlMenu() {
    window.location.href = "../../index.html";
}
