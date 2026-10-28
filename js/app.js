// =========================================
// app.js
// Inicializa el menú principal y muestra el progreso del estudiante.
// Usa las funciones de progreso.js (por eso progreso.js se carga antes).
// =========================================

// Devuelve estrellas según los niveles completados.
// Ejemplo: crearEstrellas(2, 3) devuelve "★★☆"
function crearEstrellas(completados, total) {
    return "★".repeat(completados) + "☆".repeat(total - completados);
}

// Escribe en el menú el progreso de cada juego y el progreso general.
function mostrarProgresoEnMenu() {
    // Progreso de cada juego
    for (const juego of juegosConProgreso) {
        const completados = contarNivelesCompletados(juego);
        const textoDelJuego = document.getElementById("progreso-" + juego);
        textoDelJuego.textContent = crearEstrellas(completados, nivelesPorJuego) +
            "  " + completados + " / " + nivelesPorJuego + " niveles";
    }

    // Progreso general de todos los juegos
    const general = calcularProgresoGeneral();
    const porcentaje = Math.round(general.completados / general.total * 100);

    document.getElementById("texto-progreso-general").textContent =
        general.completados + " / " + general.total + " niveles completados";
    document.getElementById("barra-progreso-general").style.width = porcentaje + "%";
}

// Pregunta antes de borrar el progreso. Si el estudiante acepta, lo borra.
function pedirReinicioDeProgreso() {
    const aceptado = confirm("¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.");
    if (aceptado) {
        reiniciarProgreso();
        mostrarProgresoEnMenu();
    }
}

// Función que se ejecuta al abrir el menú principal
function iniciarAplicacion() {
    document.getElementById("boton-reiniciar-progreso").addEventListener("click", pedirReinicioDeProgreso);
    mostrarProgresoEnMenu();
}

// Esperamos a que todo el HTML esté cargado antes de iniciar
document.addEventListener("DOMContentLoaded", iniciarAplicacion);

// "pageshow" ocurre cada vez que se muestra el menú, también al volver con
// el botón "atrás" del navegador. Así el progreso siempre está actualizado.
window.addEventListener("pageshow", mostrarProgresoEnMenu);
