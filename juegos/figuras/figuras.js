// =========================================
// figuras.js
// Juego de atención visual: encontrar todas las figuras de un tipo
// entre otras figuras parecidas. Tiene 3 niveles.
// =========================================


// ---------- CONFIGURACIÓN DEL JUEGO ----------

// Nombre en plural de cada forma, con su artículo, para escribir la instrucción
// ("todas las" para estrellas porque es femenino)
const nombresDeFormas = {
    triangulo: "todos los triángulos",
    cuadrado: "todos los cuadrados",
    circulo: "todos los círculos",
    rombo: "todos los rombos",
    estrella: "todas las estrellas",
    pentagono: "todos los pentágonos",
    hexagono: "todos los hexágonos",
    octagono: "todos los octágonos"
};

// Nombre en singular de cada forma, para los lectores de pantalla
const nombresEnSingular = {
    triangulo: "triángulo",
    cuadrado: "cuadrado",
    circulo: "círculo",
    rombo: "rombo",
    estrella: "estrella",
    pentagono: "pentágono",
    hexagono: "hexágono",
    octagono: "octágono"
};

// Datos de cada nivel:
// - formaObjetivo: la figura que hay que encontrar
// - cantidadObjetivo: cuántas figuras objetivo hay en la cuadrícula
// - totalFiguras: cuántas figuras hay en total
// - columnas: columnas de la cuadrícula
// - formasDistractoras: otras figuras para despistar
// - colores: colores que pueden tener las figuras
const niveles = [
    {
        // Nivel 1: pocas figuras y muy diferentes entre sí
        formaObjetivo: "triangulo",
        cantidadObjetivo: 5,
        totalFiguras: 12,
        columnas: 3,
        formasDistractoras: ["circulo", "cuadrado"],
        colores: ["#e03131", "#1971c2", "#f08c00"]
    },
    {
        // Nivel 2: más figuras, más formas y más colores
        formaObjetivo: "estrella",
        cantidadObjetivo: 8,
        totalFiguras: 20,
        columnas: 4,
        formasDistractoras: ["circulo", "cuadrado", "triangulo", "rombo", "pentagono"],
        colores: ["#e03131", "#1971c2", "#f08c00", "#2f9e44", "#9c36b5", "#e64980"]
    },
    {
        // Nivel 3: figuras muy parecidas y colores casi iguales
        formaObjetivo: "hexagono",
        cantidadObjetivo: 10,
        totalFiguras: 30,
        columnas: 5,
        formasDistractoras: ["pentagono", "octagono", "circulo"],
        colores: ["#1971c2", "#1c7ed6"]
    }
];


// ---------- ESTADO DEL JUEGO (cambia mientras se juega) ----------

let nivelActual = 0;          // Empieza en 0, que es el nivel 1
let aciertos = 0;             // Figuras objetivo encontradas
let errores = 0;              // Figuras equivocadas pulsadas
let aciertosPorNivel = [0, 0, 0];   // Aciertos con los que se completó cada nivel
let erroresPorNivel = [0, 0, 0];    // Errores con los que se completó cada nivel
let nivelTerminado = false;   // true cuando ya se encontraron todas


// ---------- ELEMENTOS DEL HTML ----------

const cuadricula = document.getElementById("cuadricula");
const figuraEjemplo = document.getElementById("figura-ejemplo");
const textoInstruccion = document.getElementById("texto-instruccion");
const textoNivel = document.getElementById("texto-nivel");
const textoAciertos = document.getElementById("texto-aciertos");
const textoErrores = document.getElementById("texto-errores");
const resumen = document.getElementById("resumen");
const textoResumenTitulo = document.getElementById("texto-resumen-titulo");
const textoResumenDetalle = document.getElementById("texto-resumen-detalle");
const botonSiguiente = document.getElementById("boton-siguiente");
const botonReiniciar = document.getElementById("boton-reiniciar");


// ---------- FUNCIONES DE AYUDA ----------

// Revuelve los elementos de una lista al azar (método Fisher-Yates).
function mezclarLista(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const posicionAlAzar = Math.floor(Math.random() * (i + 1));
        const temporal = lista[i];
        lista[i] = lista[posicionAlAzar];
        lista[posicionAlAzar] = temporal;
    }
    return lista;
}

// Devuelve un elemento cualquiera de una lista.
function elegirAlAzar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}


// ---------- FUNCIONES DEL JUEGO ----------

// Crea la lista de formas del nivel: primero las objetivo y luego las
// distractoras, y al final las mezcla. Así siempre hay la cantidad exacta.
function crearListaDeFormas(nivel) {
    const formas = [];

    for (let i = 0; i < nivel.cantidadObjetivo; i++) {
        formas.push(nivel.formaObjetivo);
    }
    while (formas.length < nivel.totalFiguras) {
        formas.push(elegirAlAzar(nivel.formasDistractoras));
    }
    return mezclarLista(formas);
}

// Suma todos los números de una lista.
function sumarLista(lista) {
    let total = 0;
    for (const numero of lista) {
        total += numero;
    }
    return total;
}

// Crea una casilla (un botón) con una figura de la forma y color indicados.
// "numero" es su posición en la cuadrícula (1, 2, 3...), para los lectores de pantalla.
function crearCasilla(forma, color, numero) {
    const casilla = document.createElement("button");
    casilla.className = "casilla";
    casilla.dataset.forma = forma;   // Guardamos la forma para comprobarla al pulsar
    casilla.dataset.numero = numero;
    actualizarEtiquetaCasilla(casilla);

    const figura = document.createElement("span");
    figura.className = "forma forma-" + forma;
    figura.style.backgroundColor = color;
    casilla.appendChild(figura);

    casilla.addEventListener("click", function () {
        pulsarCasilla(casilla);
    });
    return casilla;
}

// Escribe la descripción de la casilla para los lectores de pantalla.
// Ejemplo: "Figura 4: triángulo, correcta"
function actualizarEtiquetaCasilla(casilla) {
    let etiqueta = "Figura " + casilla.dataset.numero + ": " + nombresEnSingular[casilla.dataset.forma];

    if (casilla.classList.contains("correcta")) {
        etiqueta += ", correcta";
    } else if (casilla.classList.contains("incorrecta")) {
        etiqueta += ", incorrecta";
    }
    casilla.setAttribute("aria-label", etiqueta);
}

// Prepara y dibuja el nivel actual desde cero.
function iniciarNivel() {
    const nivel = niveles[nivelActual];

    // Reiniciamos el estado del nivel
    aciertos = 0;
    errores = 0;
    nivelTerminado = false;

    mostrarInstruccion(nivel);

    // Dibujamos la cuadrícula con sus columnas y figuras
    cuadricula.style.gridTemplateColumns = "repeat(" + nivel.columnas + ", 1fr)";
    cuadricula.innerHTML = "";
    const formas = crearListaDeFormas(nivel);
    for (let i = 0; i < formas.length; i++) {
        cuadricula.appendChild(crearCasilla(formas[i], elegirAlAzar(nivel.colores), i + 1));
    }

    resumen.classList.add("oculto");
    botonSiguiente.disabled = true;     // No se puede avanzar hasta terminar
    botonSiguiente.textContent = "Siguiente nivel";
    actualizarMarcador();
}

// Escribe la instrucción y muestra la figura de ejemplo.
function mostrarInstruccion(nivel) {
    textoInstruccion.textContent = "Encuentra " + nombresDeFormas[nivel.formaObjetivo];
    figuraEjemplo.className = "forma forma-" + nivel.formaObjetivo;
}

// Se ejecuta cuando el estudiante pulsa una casilla.
function pulsarCasilla(casilla) {
    // Si el nivel ya terminó, no se puede seguir pulsando
    if (nivelTerminado) {
        return;
    }
    // Si la casilla ya se pulsó antes, no se cuenta otra vez
    if (casilla.classList.contains("correcta") || casilla.classList.contains("incorrecta")) {
        return;
    }

    if (casilla.dataset.forma === niveles[nivelActual].formaObjetivo) {
        marcarAcierto(casilla);
    } else {
        marcarError(casilla);
    }
    actualizarMarcador();
}

// La figura era la correcta: se marca en verde y se suma un acierto.
function marcarAcierto(casilla) {
    casilla.classList.add("correcta");
    actualizarEtiquetaCasilla(casilla);
    aciertos++;

    // Si ya encontró todas las figuras objetivo, el nivel termina
    if (aciertos === niveles[nivelActual].cantidadObjetivo) {
        terminarNivel();
    }
}

// La figura no era la correcta: se marca en rojo y se suma un error.
function marcarError(casilla) {
    casilla.classList.add("incorrecta");
    actualizarEtiquetaCasilla(casilla);
    errores++;
}

// Escribe en pantalla el nivel, los aciertos y los errores.
function actualizarMarcador() {
    textoNivel.textContent = (nivelActual + 1) + " / " + niveles.length;
    textoAciertos.textContent = aciertos + " / " + niveles[nivelActual].cantidadObjetivo;
    textoErrores.textContent = errores;
}

// Termina el nivel: muestra el resumen y activa el botón para continuar.
function terminarNivel() {
    nivelTerminado = true;
    // Guardamos en el progreso general que este nivel se completó (ver progreso.js)
    registrarNivelCompletado("figuras", nivelActual + 1);

    // Guardamos el resultado de este nivel. Si se repite el nivel, se reemplaza.
    aciertosPorNivel[nivelActual] = aciertos;
    erroresPorNivel[nivelActual] = errores;

    const esUltimoNivel = nivelActual === niveles.length - 1;

    if (esUltimoNivel) {
        // Resumen de los 3 niveles juntos
        textoResumenTitulo.textContent = "🏆 ¡Felicitaciones! Completaste los 3 niveles";
        textoResumenDetalle.textContent = "Total de los 3 niveles. Aciertos: " + sumarLista(aciertosPorNivel) +
            " · Errores: " + sumarLista(erroresPorNivel);
        botonSiguiente.textContent = "Volver a jugar";
    } else {
        // Resumen solo de este nivel
        textoResumenTitulo.textContent = "🎉 ¡Nivel " + (nivelActual + 1) + " completado!";
        textoResumenDetalle.textContent = "Aciertos: " + aciertos + " · Errores: " + errores;
    }

    resumen.classList.remove("oculto");
    botonSiguiente.disabled = false;
}

// Se ejecuta al pulsar "Siguiente nivel" o "Volver a jugar".
function avanzarNivel() {
    // Seguridad: no se puede avanzar si el nivel no está terminado
    if (!nivelTerminado) {
        return;
    }

    if (nivelActual < niveles.length - 1) {
        nivelActual++;        // Pasa al siguiente nivel
    } else {
        nivelActual = 0;      // Terminó el último nivel: vuelve a empezar
        aciertosPorNivel = [0, 0, 0];
        erroresPorNivel = [0, 0, 0];
    }
    iniciarNivel();
}


// ---------- INICIO ----------

// Conectamos los botones con sus funciones
botonSiguiente.addEventListener("click", avanzarNivel);
botonReiniciar.addEventListener("click", iniciarNivel);

// Empezamos el juego en el nivel 1
iniciarNivel();
