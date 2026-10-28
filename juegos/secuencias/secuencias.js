// =========================================
// secuencias.js
// Juego de memoria: observar una secuencia de colores y repetirla
// en el mismo orden.
//
// REGLAS:
// - Hay 3 niveles. Las secuencias tienen 3, 5 y 7 colores.
// - En cada nivel hay que superar 3 rondas. Cada ronda tiene una secuencia nueva.
// - Si el estudiante se equivoca, puede repetir la misma ronda sin perder
//   las rondas que ya superó.
// =========================================


// ---------- CONFIGURACIÓN DEL JUEGO ----------

// Cantidad de colores de la secuencia en cada nivel (posición 0 = nivel 1)
const coloresPorNivel = [3, 5, 7];

// Rondas que hay que superar para completar cada nivel
const rondasPorNivel = 3;

// Tiempos de la demostración (en milisegundos)
const duracionLuz = 600;            // Cuánto tiempo se ilumina cada color
const pausaEntreColores = 300;      // Pausa entre un color y el siguiente
const esperaAntesDeEmpezar = 700;   // Pausa antes del primer color
const esperaEntreRondas = 1500;     // Pausa después de acertar una ronda
const duracionLuzAlPulsar = 250;    // Destello cuando el estudiante pulsa un color
const pausaAntesDelBotonEmpezar = 600;  // Evita que un doble toque pulse "Empezar" sin querer


// ---------- ESTADO DEL JUEGO (cambia mientras se juega) ----------

let nivelActual = 0;          // Empieza en 0, que es el nivel 1
let rondasSuperadas = 0;      // Rondas superadas en el nivel actual
let aciertos = 0;             // Rondas acertadas en todo el juego
let errores = 0;              // Veces que el estudiante se equivocó
let secuencia = [];           // Colores de la ronda, como números del 0 al 3
let posicionRespuesta = 0;    // Qué color de la secuencia toca pulsar ahora
let puedeResponder = false;   // true solo cuando es el turno del estudiante
let temporizadores = [];      // Esperas pendientes, para poder cancelarlas


// ---------- ELEMENTOS DEL HTML ----------

// Los 4 botones de colores: 0 = rojo, 1 = azul, 2 = verde, 3 = amarillo
const botonesDeColor = document.querySelectorAll(".boton-color");
const textoNivel = document.getElementById("texto-nivel");
const textoRonda = document.getElementById("texto-ronda");
const textoAciertos = document.getElementById("texto-aciertos");
const textoRegla = document.getElementById("texto-regla");
const textoMensaje = document.getElementById("texto-mensaje");
const botonAccion = document.getElementById("boton-accion");
const botonReiniciar = document.getElementById("boton-reiniciar");


// ---------- FUNCIONES DE AYUDA ----------

// Crea una secuencia aleatoria de colores (números del 0 al 3).
function crearSecuencia(cantidadDeColores) {
    const nuevaSecuencia = [];
    for (let i = 0; i < cantidadDeColores; i++) {
        nuevaSecuencia.push(Math.floor(Math.random() * botonesDeColor.length));
    }
    return nuevaSecuencia;
}

// Escribe un número con la palabra en singular o en plural según corresponda.
// Ejemplos: escribirCantidad(1, "error", "errores") devuelve "1 error"
//           escribirCantidad(3, "error", "errores") devuelve "3 errores"
function escribirCantidad(numero, singular, plural) {
    if (numero === 1) {
        return numero + " " + singular;
    }
    return numero + " " + plural;
}

// Ejecuta una función después de un tiempo y guarda la espera
// para poder cancelarla si se reinicia el juego.
function esperar(milisegundos, funcion) {
    temporizadores.push(setTimeout(funcion, milisegundos));
}

// Cancela todas las esperas pendientes y apaga todos los colores.
// Así ninguna secuencia anterior sigue ejecutándose.
function detenerSecuencia() {
    for (const temporizador of temporizadores) {
        clearTimeout(temporizador);
    }
    temporizadores = [];

    for (const boton of botonesDeColor) {
        boton.classList.remove("iluminado");
    }
}

// Activa o desactiva los botones de colores.
function activarBotonesDeColor(activar) {
    puedeResponder = activar;
    for (const boton of botonesDeColor) {
        boton.disabled = !activar;
    }
}

// Enciende un color durante un tiempo y luego lo apaga.
function iluminarColor(numeroDeColor, duracion) {
    const boton = botonesDeColor[numeroDeColor];
    boton.classList.add("iluminado");
    esperar(duracion, function () {
        boton.classList.remove("iluminado");
    });
}

// Escribe un mensaje. El tipo puede ser "", "correcto" o "error" (cambia el color).
function mostrarMensaje(texto, tipo) {
    textoMensaje.textContent = texto;
    textoMensaje.className = "mensaje " + tipo;
}

// Muestra el botón de acción con un texto y la función que hará al pulsarlo.
function mostrarBotonAccion(texto, funcionAlPulsar) {
    botonAccion.textContent = texto;
    botonAccion.onclick = funcionAlPulsar;
    botonAccion.classList.remove("oculto");
    botonAccion.style.visibility = "visible";
    botonAccion.disabled = false;
}

// Esconde el botón de acción y lo desactiva.
// Usamos "visibility" en vez de quitarlo: así el botón sigue ocupando su
// lugar y los botones de abajo no se mueven. Si se movieran, un doble toque
// podría caer sin querer sobre "Reiniciar juego".
function ocultarBotonAccion() {
    botonAccion.classList.remove("oculto");
    botonAccion.style.visibility = "hidden";
    botonAccion.disabled = true;
}

// Escribe en pantalla el nivel, la ronda y los aciertos.
function actualizarMarcador() {
    // La ronda actual es la siguiente a las superadas (sin pasar de 3)
    const rondaActual = Math.min(rondasSuperadas + 1, rondasPorNivel);

    textoNivel.textContent = (nivelActual + 1) + " / " + coloresPorNivel.length;
    textoRonda.textContent = rondaActual + " / " + rondasPorNivel;
    textoAciertos.textContent = aciertos;
}


// ---------- FUNCIONES DEL JUEGO ----------

// Empieza el juego completo desde el nivel 1.
function iniciarJuego() {
    nivelActual = 0;
    aciertos = 0;
    errores = 0;
    iniciarNivel();
}

// Prepara el nivel actual y espera a que el estudiante pulse "Empezar".
function iniciarNivel() {
    detenerSecuencia();
    activarBotonesDeColor(false);
    rondasSuperadas = 0;
    secuencia = [];

    textoRegla.textContent = "Nivel " + (nivelActual + 1) + ": secuencias de " +
        escribirCantidad(coloresPorNivel[nivelActual], "color", "colores") + ". Supera " +
        escribirCantidad(rondasPorNivel, "ronda", "rondas") + " para completarlo.";
    mostrarMensaje("Pulsa «Empezar» cuando estés listo.", "");
    actualizarMarcador();

    // El botón "Empezar" aparece tras una pausa corta. Si el estudiante tocó dos
    // veces "Siguiente nivel" o "Volver a jugar", el segundo toque no lo pulsa.
    // La espera se cancela si se reinicia el juego (ver detenerSecuencia).
    ocultarBotonAccion();
    esperar(pausaAntesDelBotonEmpezar, function () {
        mostrarBotonAccion("Empezar", iniciarRonda);
    });
}

// Crea una secuencia nueva y la muestra.
function iniciarRonda() {
    secuencia = crearSecuencia(coloresPorNivel[nivelActual]);
    mostrarSecuencia();
}

// Demostración: ilumina los colores de la secuencia uno por uno.
// Mientras tanto los botones están desactivados.
function mostrarSecuencia() {
    detenerSecuencia();
    activarBotonesDeColor(false);
    ocultarBotonAccion();
    posicionRespuesta = 0;
    mostrarMensaje("👀 Observa la secuencia...", "");

    // Cada color ocupa su tiempo de luz más una pausa
    const tiempoPorColor = duracionLuz + pausaEntreColores;

    for (let i = 0; i < secuencia.length; i++) {
        const numeroDeColor = secuencia[i];
        esperar(esperaAntesDeEmpezar + i * tiempoPorColor, function () {
            iluminarColor(numeroDeColor, duracionLuz);
        });
    }

    // Cuando termina el último color, es el turno del estudiante
    esperar(esperaAntesDeEmpezar + secuencia.length * tiempoPorColor, permitirRespuesta);
}

// Activa los botones para que el estudiante repita la secuencia.
function permitirRespuesta() {
    activarBotonesDeColor(true);
    mostrarMensaje("👉 Tu turno: 0 / " + secuencia.length, "");
}

// Se ejecuta cuando el estudiante pulsa un color.
function pulsarColor(numeroDeColor) {
    // Si no es su turno (por ejemplo, durante la demostración), no hace nada
    if (!puedeResponder) {
        return;
    }

    iluminarColor(numeroDeColor, duracionLuzAlPulsar);

    // Comparamos con el color que toca en este momento (orden exacto)
    if (numeroDeColor !== secuencia[posicionRespuesta]) {
        rondaIncorrecta();
        return;
    }

    posicionRespuesta++;
    if (posicionRespuesta === secuencia.length) {
        rondaCorrecta();
    } else {
        mostrarMensaje("👉 Tu turno: " + posicionRespuesta + " / " + secuencia.length, "");
    }
}

// El estudiante repitió toda la secuencia bien.
function rondaCorrecta() {
    activarBotonesDeColor(false);
    aciertos++;
    rondasSuperadas++;
    actualizarMarcador();

    if (rondasSuperadas === rondasPorNivel) {
        terminarNivel();
    } else {
        mostrarMensaje("✅ ¡Correcto! Prepárate para la siguiente ronda.", "correcto");
        esperar(esperaEntreRondas, iniciarRonda);
    }
}

// El estudiante se equivocó: puede volver a ver la misma secuencia.
function rondaIncorrecta() {
    activarBotonesDeColor(false);
    errores++;
    mostrarMensaje("❌ Ese no era el color. ¡No pasa nada! Mira la secuencia otra vez.", "error");
    mostrarBotonAccion("Repetir ronda", mostrarSecuencia);
}

// Se superaron todas las rondas del nivel.
function terminarNivel() {
    // Guardamos en el progreso general que este nivel se completó (ver progreso.js)
    registrarNivelCompletado("secuencias", nivelActual + 1);

    const esUltimoNivel = nivelActual === coloresPorNivel.length - 1;

    if (esUltimoNivel) {
        mostrarMensaje("🏆 ¡Felicitaciones! Completaste los 3 niveles con " +
            escribirCantidad(aciertos, "acierto", "aciertos") + " y " +
            escribirCantidad(errores, "error", "errores") + ".", "correcto");
        mostrarBotonAccion("Volver a jugar", iniciarJuego);
    } else {
        mostrarMensaje("🎉 ¡Nivel " + (nivelActual + 1) + " completado!", "correcto");
        mostrarBotonAccion("Siguiente nivel", avanzarNivel);
    }
}

// Pasa al siguiente nivel, solo si se superaron todas las rondas
// y si todavía queda un nivel por jugar.
function avanzarNivel() {
    const esUltimoNivel = nivelActual === coloresPorNivel.length - 1;
    if (rondasSuperadas < rondasPorNivel || esUltimoNivel) {
        return;
    }
    nivelActual++;
    iniciarNivel();
}


// ---------- INICIO ----------

// Conectamos cada botón de color con su número (0, 1, 2 o 3)
botonesDeColor.forEach(function (boton, numeroDeColor) {
    boton.addEventListener("click", function () {
        pulsarColor(numeroDeColor);
    });
});

botonReiniciar.addEventListener("click", iniciarJuego);

// Empezamos el juego en el nivel 1
iniciarJuego();
