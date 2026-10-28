// =========================================
// parejas.js
// Juego de memoria: encontrar las parejas de tarjetas iguales.
// Tiene 3 niveles: 3, 4 y 6 parejas.
// =========================================


// ---------- CONFIGURACIÓN DEL JUEGO ----------

// Emojis que se pueden usar en las tarjetas (hay 6 porque el nivel 3 usa 6 parejas)
const emojisDisponibles = ["🍎", "🐶", "⭐", "🚗", "🌙", "🎈"];

// Cantidad de parejas en cada nivel. Posición 0 = nivel 1, posición 1 = nivel 2...
const parejasPorNivel = [3, 4, 6];

// Tiempo (en milisegundos) que se ven las tarjetas antes de ocultarse si no coinciden
const tiempoParaOcultar = 1000;

// Nombre de cada emoji, para los lectores de pantalla
const nombresDeEmojis = {
    "🍎": "manzana",
    "🐶": "perro",
    "⭐": "estrella",
    "🚗": "carro",
    "🌙": "luna",
    "🎈": "globo"
};


// ---------- ESTADO DEL JUEGO (cambia mientras se juega) ----------

let nivelActual = 0;              // Empieza en 0, que es el nivel 1
let intentos = 0;                 // Intentos en el nivel actual (dos tarjetas volteadas = 1 intento)
let intentosPorNivel = [0, 0, 0]; // Intentos con los que se completó cada nivel
let parejasEncontradas = 0;       // Cuántas parejas lleva en este nivel
let primeraTarjeta = null;        // Primera tarjeta volteada en el intento
let segundaTarjeta = null;        // Segunda tarjeta volteada en el intento
let tableroBloqueado = false;     // Si es true, no se pueden voltear tarjetas
let temporizadorOcultar = null;   // Guarda la espera antes de ocultar tarjetas


// ---------- ELEMENTOS DEL HTML ----------

const tablero = document.getElementById("tablero");
const textoNivel = document.getElementById("texto-nivel");
const textoIntentos = document.getElementById("texto-intentos");
const textoParejas = document.getElementById("texto-parejas");
const mensaje = document.getElementById("mensaje");
const textoMensaje = document.getElementById("texto-mensaje");
const botonContinuar = document.getElementById("boton-continuar");
const botonReiniciar = document.getElementById("boton-reiniciar");


// ---------- FUNCIONES ----------

// Revuelve los elementos de una lista al azar (método Fisher-Yates).
// Recorre la lista desde el final y cambia cada elemento con otro al azar.
function mezclarLista(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const posicionAlAzar = Math.floor(Math.random() * (i + 1));
        const temporal = lista[i];
        lista[i] = lista[posicionAlAzar];
        lista[posicionAlAzar] = temporal;
    }
    return lista;
}

// Prepara y dibuja el nivel actual desde cero.
function iniciarNivel() {
    // Si quedaba una espera pendiente del nivel anterior, la cancelamos
    clearTimeout(temporizadorOcultar);

    // Reiniciamos el estado del nivel
    intentos = 0;
    parejasEncontradas = 0;
    primeraTarjeta = null;
    segundaTarjeta = null;
    tableroBloqueado = false;

    // Escogemos los emojis del nivel y duplicamos cada uno para formar parejas
    const cantidadDeParejas = parejasPorNivel[nivelActual];
    const emojisDelNivel = emojisDisponibles.slice(0, cantidadDeParejas);
    const emojisDeTarjetas = mezclarLista(emojisDelNivel.concat(emojisDelNivel));

    // 3 parejas (6 tarjetas) caben en 3 columnas; las demás en 4 columnas
    let columnas = 4;
    if (cantidadDeParejas === 3) {
        columnas = 3;
    }
    tablero.style.gridTemplateColumns = "repeat(" + columnas + ", 1fr)";

    // Borramos las tarjetas viejas y creamos las nuevas
    tablero.innerHTML = "";
    for (let i = 0; i < emojisDeTarjetas.length; i++) {
        tablero.appendChild(crearTarjeta(emojisDeTarjetas[i], i + 1));
    }

    mensaje.classList.add("oculto");
    actualizarMarcador();
}

// Crea una tarjeta (un botón) que guarda su emoji escondido.
// "numero" es su posición en el tablero (1, 2, 3...), para los lectores de pantalla.
function crearTarjeta(emoji, numero) {
    const tarjeta = document.createElement("button");
    tarjeta.className = "tarjeta";
    tarjeta.dataset.emoji = emoji;   // El emoji queda guardado pero no se ve
    tarjeta.dataset.numero = numero;
    tarjeta.textContent = "?";
    actualizarEtiquetaTarjeta(tarjeta);
    tarjeta.addEventListener("click", function () {
        voltearTarjeta(tarjeta);
    });
    return tarjeta;
}

// Escribe la descripción de la tarjeta para los lectores de pantalla.
// Si la tarjeta está oculta, NO dice su dibujo, para no dar pistas.
function actualizarEtiquetaTarjeta(tarjeta) {
    const nombreDelDibujo = nombresDeEmojis[tarjeta.dataset.emoji];
    let estado = "oculta";

    if (tarjeta.classList.contains("encontrada")) {
        estado = "pareja encontrada, " + nombreDelDibujo;
    } else if (tarjeta.classList.contains("descubierta")) {
        estado = "descubierta, " + nombreDelDibujo;
    }
    tarjeta.setAttribute("aria-label", "Tarjeta " + tarjeta.dataset.numero + ": " + estado);
}

// Se ejecuta cuando el jugador pulsa una tarjeta.
function voltearTarjeta(tarjeta) {
    // Regla 1: mientras se comprueba una pareja no se puede voltear otra tarjeta
    if (tableroBloqueado) {
        return;
    }
    // Regla 2: no se puede elegir una tarjeta que ya está volteada o ya tiene pareja
    // (esto también impide pulsar dos veces la misma tarjeta en un intento)
    if (tarjeta.classList.contains("descubierta") || tarjeta.classList.contains("encontrada")) {
        return;
    }

    // Mostramos el emoji
    tarjeta.classList.add("descubierta");
    tarjeta.textContent = tarjeta.dataset.emoji;
    actualizarEtiquetaTarjeta(tarjeta);

    if (primeraTarjeta === null) {
        // Es la primera tarjeta del intento: la guardamos y esperamos la segunda
        primeraTarjeta = tarjeta;
    } else {
        // Es la segunda tarjeta: bloqueamos el tablero y comprobamos
        segundaTarjeta = tarjeta;
        tableroBloqueado = true;
        intentos++;
        comprobarPareja();
    }
}

// Compara las dos tarjetas volteadas.
function comprobarPareja() {
    if (primeraTarjeta.dataset.emoji === segundaTarjeta.dataset.emoji) {
        dejarParejaDescubierta();
    } else {
        // No son iguales: esperamos un momento para que el jugador las vea
        temporizadorOcultar = setTimeout(ocultarTarjetas, tiempoParaOcultar);
    }
    actualizarMarcador();
}

// Las dos tarjetas coinciden: se quedan descubiertas para siempre.
function dejarParejaDescubierta() {
    primeraTarjeta.classList.replace("descubierta", "encontrada");
    segundaTarjeta.classList.replace("descubierta", "encontrada");
    actualizarEtiquetaTarjeta(primeraTarjeta);
    actualizarEtiquetaTarjeta(segundaTarjeta);
    parejasEncontradas++;
    terminarIntento();

    // Si ya encontró todas las parejas, el nivel está completo
    if (parejasEncontradas === parejasPorNivel[nivelActual]) {
        mostrarNivelCompletado();
    }
}

// Las dos tarjetas no coinciden: se vuelven a poner boca abajo.
function ocultarTarjetas() {
    for (const tarjeta of [primeraTarjeta, segundaTarjeta]) {
        tarjeta.classList.remove("descubierta");
        tarjeta.textContent = "?";
        actualizarEtiquetaTarjeta(tarjeta);
    }
    terminarIntento();
}

// Deja todo listo para el siguiente intento.
function terminarIntento() {
    primeraTarjeta = null;
    segundaTarjeta = null;
    tableroBloqueado = false;
}

// Escribe en pantalla el nivel, los intentos y las parejas.
function actualizarMarcador() {
    textoNivel.textContent = (nivelActual + 1) + " / " + parejasPorNivel.length;
    textoIntentos.textContent = intentos;
    textoParejas.textContent = parejasEncontradas + " / " + parejasPorNivel[nivelActual];
}

// Muestra el mensaje al terminar un nivel.
function mostrarNivelCompletado() {
    // Guardamos en el progreso general que este nivel se completó (ver progreso.js)
    registrarNivelCompletado("parejas", nivelActual + 1);

    // Guardamos los intentos de este nivel. Si se repite el nivel, se reemplazan.
    intentosPorNivel[nivelActual] = intentos;

    const esUltimoNivel = nivelActual === parejasPorNivel.length - 1;

    if (esUltimoNivel) {
        textoMensaje.textContent = "🏆 ¡Felicitaciones! Completaste los 3 niveles en " + sumarIntentosTotales() + " intentos.";
        botonContinuar.textContent = "Volver a jugar";
    } else {
        textoMensaje.textContent = "🎉 ¡Muy bien! Completaste el nivel " + (nivelActual + 1) + " en " + intentos + " intentos.";
        botonContinuar.textContent = "Siguiente nivel";
    }
    mensaje.classList.remove("oculto");
}

// Suma los intentos con los que se completó cada nivel.
function sumarIntentosTotales() {
    let total = 0;
    for (const intentosDelNivel of intentosPorNivel) {
        total += intentosDelNivel;
    }
    return total;
}

// Se ejecuta al pulsar "Siguiente nivel" o "Volver a jugar".
function continuarJuego() {
    // Seguridad: no se puede avanzar si el nivel no está completo
    if (parejasEncontradas < parejasPorNivel[nivelActual]) {
        return;
    }

    if (nivelActual < parejasPorNivel.length - 1) {
        nivelActual++;        // Pasa al siguiente nivel
    } else {
        nivelActual = 0;      // Terminó el último nivel: vuelve a empezar
        intentosPorNivel = [0, 0, 0];
    }
    iniciarNivel();
}


// ---------- INICIO ----------

// Conectamos los botones con sus funciones
botonContinuar.addEventListener("click", continuarJuego);
botonReiniciar.addEventListener("click", iniciarNivel);

// Empezamos el juego en el nivel 1
iniciarNivel();
