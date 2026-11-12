// =========================================
// script.js
// JavaScript SOLO de la página académica (anteproyecto).
//
// Hace dos cosas:
//   1. El botón "Ver recomendación" muestra un consejo.
//   2. La encuesta comprueba las respuestas, pero NO las guarda.
//
// Este archivo no usa nada del videojuego y no toca el progreso guardado.
// =========================================


// ---------- 1. Botón de recomendación ----------

// Lista de recomendaciones. Salen de las reglas reales de los juegos.
const recomendaciones = [
    "Lee las instrucciones completas antes de empezar un juego.",
    "Juega los niveles en orden: solo pasas al siguiente cuando completas el actual.",
    "En Secuencias, espera a que termine la demostración antes de pulsar los colores.",
    "En Preguntas necesitas 7 aciertos de 10 para pasar de nivel. Lee con calma cada opción.",
    "En Laberinto mental no hay cronómetro: tómate tu tiempo para planear el camino."
];

// Posición de la recomendación que se mostrará (empieza en la primera, la 0)
let numeroDeRecomendacion = 0;

const boton = document.getElementById("consejo");
const respuesta = document.getElementById("respuesta");

// "if" comprueba que el botón y el párrafo existan antes de usarlos
if (boton && respuesta) {
    boton.addEventListener("click", function () {
        // Muestra la recomendación actual
        respuesta.textContent = recomendaciones[numeroDeRecomendacion];

        // Pasa a la siguiente. Al llegar al final, vuelve a la primera.
        numeroDeRecomendacion = numeroDeRecomendacion + 1;
        if (numeroDeRecomendacion >= recomendaciones.length) {
            numeroDeRecomendacion = 0;
        }
    });
}


// ---------- 2. Encuesta de percepción ----------

const formulario = document.getElementById("encuestaForm");
const aviso = document.getElementById("aviso");

if (formulario && aviso) {

    // Al pulsar "Comprobar respuestas"
    formulario.addEventListener("submit", function (evento) {
        // preventDefault evita que el formulario se envíe:
        // no hay servidor, así que no se puede guardar nada.
        evento.preventDefault();
        aviso.textContent = "¡Gracias! Respuestas comprobadas. No se han guardado datos.";
    });

    // Al pulsar "Limpiar" también se borra el aviso
    formulario.addEventListener("reset", function () {
        aviso.textContent = "";
    });
}
