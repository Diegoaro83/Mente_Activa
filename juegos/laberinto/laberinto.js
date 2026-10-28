// =========================================
// laberinto.js
// Juego "Laberinto mental": llevar al personaje desde el inicio hasta la
// salida, moviéndose casilla por casilla sin atravesar las paredes.
//
// Usa funciones de otros archivos que se cargan antes en laberinto.html:
//   - volverAlMenu()            → js/navegacion.js
//   - registrarNivelCompletado() → js/progreso.js
// =========================================


// ---------- LOS LABERINTOS ----------
// Cada laberinto es una lista de filas de texto. Cada letra es una casilla:
//   "#" = pared      "." = camino libre
//   "I" = inicio     "S" = salida
// Así es fácil ver y cambiar el dibujo del laberinto directamente aquí.

const laberintos = [
    // Nivel 1 (fácil): 7 × 7, un solo camino sin desvíos
    [
        "#######",
        "#I....#",
        "#####.#",
        "#.....#",
        "#.#####",
        "#....S#",
        "#######"
    ],
    // Nivel 2 (medio): 11 × 11, con callejones sin salida
    [
        "###########",
        "#I#.....#.#",
        "#.#.###.#.#",
        "#...#.#...#",
        "###.#.#####",
        "#...#.....#",
        "#.###.###.#",
        "#.#...#...#",
        "#.#.###.###",
        "#...#....S#",
        "###########"
    ],
    // Nivel 3 (difícil): 13 × 13, recorrido largo y varios callejones
    [
        "#############",
        "#I....#.....#",
        "####.##.###.#",
        "#....#..#...#",
        "#.####.##.###",
        "#.#....#....#",
        "#.#.####.##.#",
        "#...#..#..#.#",
        "###.#.##.##.#",
        "#...#.#..#..#",
        "#.###.#.##.##",
        "#.....#....S#",
        "#############"
    ]
];

// Cada dirección dice cuánto cambian la fila y la columna al moverse.
// La fila crece hacia abajo y la columna crece hacia la derecha.
const direcciones = {
    arriba:    { fila: -1, columna: 0,  nombre: "arriba" },
    abajo:     { fila: 1,  columna: 0,  nombre: "abajo" },
    izquierda: { fila: 0,  columna: -1, nombre: "a la izquierda" },
    derecha:   { fila: 0,  columna: 1,  nombre: "a la derecha" }
};

// Tiempo mínimo (en milisegundos) entre un cambio de pantalla y el siguiente toque.
// Evita que un doble toque pulse sin querer un botón que acaba de aparecer.
const pausaEntreToques = 400;


// ---------- ESTADO DEL JUEGO (cambia mientras se juega) ----------

let nivelActual = 0;          // Empieza en 0, que es el nivel 1
let mapa = [];                // Las filas del laberinto actual
let filaPersonaje = 0;        // Fila donde está el personaje
let columnaPersonaje = 0;     // Columna donde está el personaje
let movimientos = 0;          // Pasos dados en este nivel
let nivelGanado = false;      // true cuando el personaje llegó a la salida
let casillasRecorridas = [];  // Casillas por donde ya pasó, como textos "fila,columna"
let momentoDelUltimoCambio = 0;   // Cuándo cambió la pantalla por última vez


// ---------- ELEMENTOS DEL HTML ----------

const textoNivel = document.getElementById("texto-nivel");
const textoMovimientos = document.getElementById("texto-movimientos");
const tablero = document.getElementById("tablero");
const textoEstado = document.getElementById("texto-estado");
const controles = document.getElementById("controles");
const zonaVictoria = document.getElementById("zona-victoria");
const textoVictoriaTitulo = document.getElementById("texto-victoria-titulo");
const textoVictoriaDetalle = document.getElementById("texto-victoria-detalle");
const botonSiguienteNivel = document.getElementById("boton-siguiente-nivel");
const botonRepetir = document.getElementById("boton-repetir");


// ---------- FUNCIONES DE AYUDA ----------

// Devuelve la letra de una casilla. Fuera del laberinto cuenta como pared,
// así el personaje nunca puede salirse de los bordes.
function letraDeCasilla(fila, columna) {
    if (fila < 0 || fila >= mapa.length || columna < 0 || columna >= mapa[fila].length) {
        return "#";
    }
    return mapa[fila][columna];
}

// Busca en el mapa dónde está una letra (por ejemplo "I" o "S").
function buscarLetra(letra) {
    for (let fila = 0; fila < mapa.length; fila++) {
        const columna = mapa[fila].indexOf(letra);
        if (columna !== -1) {
            return { fila: fila, columna: columna };
        }
    }
    return null;
}

// Escribe un número con la palabra en singular o en plural.
// Ejemplo: escribirCantidad(1, "movimiento", "movimientos") devuelve "1 movimiento"
function escribirCantidad(numero, singular, plural) {
    if (numero === 1) {
        return numero + " " + singular;
    }
    return numero + " " + plural;
}

// Guarda el momento en que cambió la pantalla.
function marcarCambioDePantalla() {
    momentoDelUltimoCambio = Date.now();
}

// Devuelve true si el toque llegó muy poco después de un cambio de pantalla.
function esToqueRepetido() {
    return Date.now() - momentoDelUltimoCambio < pausaEntreToques;
}

// Devuelve la lista de direcciones hacia donde hay camino libre.
// Ejemplo: ["arriba", "a la derecha"]
function caminosLibres() {
    const libres = [];
    for (const clave in direcciones) {
        const d = direcciones[clave];
        if (letraDeCasilla(filaPersonaje + d.fila, columnaPersonaje + d.columna) !== "#") {
            libres.push(d.nombre);
        }
    }
    return libres;
}


// ---------- FUNCIONES DEL JUEGO ----------

// Prepara el nivel actual desde cero: personaje en el inicio y 0 movimientos.
function iniciarNivel() {
    mapa = laberintos[nivelActual];
    const inicio = buscarLetra("I");
    filaPersonaje = inicio.fila;
    columnaPersonaje = inicio.columna;
    movimientos = 0;
    nivelGanado = false;
    casillasRecorridas = [filaPersonaje + "," + columnaPersonaje];

    // Le decimos al CSS cuántas columnas tiene este laberinto
    tablero.style.setProperty("--columnas", mapa[0].length);

    // La felicitación se prepara desde ya (invisible), para que su tamaño
    // no cambie al ganar y los botones de abajo se queden quietos.
    prepararFelicitacion();
    zonaVictoria.classList.add("invisible");
    controles.classList.remove("invisible");
    activarControles(true);

    dibujarTablero();
    actualizarMarcador();
    textoEstado.textContent = "Nivel " + (nivelActual + 1) + ": usa las flechas para llegar a la salida 🏁. " +
        "Caminos libres: " + caminosLibres().join(", ") + ".";
    marcarCambioDePantalla();
}

// Dibuja todas las casillas del laberinto con el personaje en su lugar.
function dibujarTablero() {
    tablero.innerHTML = "";

    for (let fila = 0; fila < mapa.length; fila++) {
        for (let columna = 0; columna < mapa[fila].length; columna++) {
            const letra = mapa[fila][columna];
            const casilla = document.createElement("div");
            casilla.className = "casilla";

            if (letra === "#") {
                casilla.classList.add("pared");
            } else if (letra === "I") {
                casilla.classList.add("inicio");
                casilla.textContent = "🏠";
            } else if (letra === "S") {
                casilla.classList.add("salida");
                casilla.textContent = "🏁";
            } else if (casillasRecorridas.includes(fila + "," + columna)) {
                casilla.classList.add("recorrida");
            }

            // El personaje se dibuja encima de cualquier casilla donde esté
            if (fila === filaPersonaje && columna === columnaPersonaje) {
                casilla.classList.add("personaje");
                casilla.textContent = "🙂";
            }

            tablero.appendChild(casilla);
        }
    }

    // Descripción para lectores de pantalla (no ven el dibujo)
    const salida = buscarLetra("S");
    tablero.setAttribute("aria-label", "Laberinto de " + mapa.length + " filas y " + mapa[0].length +
        " columnas. Estás en la fila " + (filaPersonaje + 1) + ", columna " + (columnaPersonaje + 1) +
        ". La salida está en la fila " + (salida.fila + 1) + ", columna " + (salida.columna + 1) + ".");
}

// Intenta mover el personaje una casilla en la dirección indicada.
// Ejemplo: mover("arriba")
function mover(nombreDireccion) {
    // Si ya ganó o el toque es un doble toque accidental, no hacemos nada
    if (nivelGanado || esToqueRepetido()) {
        return;
    }

    const d = direcciones[nombreDireccion];
    const nuevaFila = filaPersonaje + d.fila;
    const nuevaColumna = columnaPersonaje + d.columna;

    // ¿Hay una pared (o el borde) en esa dirección? Entonces no se mueve.
    if (letraDeCasilla(nuevaFila, nuevaColumna) === "#") {
        dibujarTablero();
        tablero.querySelector(".personaje").classList.add("choque");
        textoEstado.textContent = "¡Hay una pared! No puedes ir " + d.nombre +
            ". Caminos libres: " + caminosLibres().join(", ") + ".";
        return;
    }

    // El camino está libre: el personaje avanza
    filaPersonaje = nuevaFila;
    columnaPersonaje = nuevaColumna;
    movimientos++;
    const posicion = filaPersonaje + "," + columnaPersonaje;
    if (!casillasRecorridas.includes(posicion)) {
        casillasRecorridas.push(posicion);
    }

    dibujarTablero();
    actualizarMarcador();

    if (letraDeCasilla(filaPersonaje, columnaPersonaje) === "S") {
        ganarNivel();
    } else {
        textoEstado.textContent = "Fila " + (filaPersonaje + 1) + ", columna " + (columnaPersonaje + 1) +
            ". Caminos libres: " + caminosLibres().join(", ") + ".";
    }
}

// Se ejecuta una sola vez, cuando el personaje llega a la salida.
function ganarNivel() {
    if (nivelGanado) {
        return;
    }
    nivelGanado = true;

    // Guardamos en el progreso general que este nivel se completó (ver progreso.js).
    // Si el nivel ya estaba guardado, progreso.js no lo repite.
    registrarNivelCompletado("laberinto", nivelActual + 1);

    textoVictoriaDetalle.textContent = "Lo lograste en " +
        escribirCantidad(movimientos, "movimiento", "movimientos") + ".";
    textoEstado.textContent = "¡Llegaste a la salida!";

    // Las flechas se esconden y en su lugar aparece la felicitación
    activarControles(false);
    controles.classList.add("invisible");
    zonaVictoria.classList.remove("invisible");
    marcarCambioDePantalla();
}

// Escribe el título y el botón de la felicitación según el nivel.
function prepararFelicitacion() {
    const esUltimoNivel = nivelActual === laberintos.length - 1;
    if (esUltimoNivel) {
        textoVictoriaTitulo.textContent = "🏆 ¡Felicitaciones! Completaste los 3 laberintos";
        botonSiguienteNivel.textContent = "Volver a jugar";
    } else {
        textoVictoriaTitulo.textContent = "🎉 ¡Llegaste a la salida del nivel " + (nivelActual + 1) + "!";
        botonSiguienteNivel.textContent = "Siguiente nivel";
    }
    textoVictoriaDetalle.textContent = "Lo lograste en 0 movimientos.";
}

// Activa o desactiva los 4 botones de movimiento.
function activarControles(activos) {
    for (const boton of controles.querySelectorAll("button")) {
        boton.disabled = !activos;
    }
}

// Escribe en pantalla el nivel y los movimientos.
function actualizarMarcador() {
    textoNivel.textContent = (nivelActual + 1) + " / " + laberintos.length;
    textoMovimientos.textContent = movimientos;
}

// Pasa al siguiente nivel (o vuelve al 1 después del último), solo si se ganó.
function avanzarNivel() {
    if (!nivelGanado || esToqueRepetido()) {
        return;
    }

    if (nivelActual < laberintos.length - 1) {
        nivelActual++;
    } else {
        nivelActual = 0;      // Terminó el último nivel: vuelve a empezar
    }
    iniciarNivel();
}

// Vuelve a empezar el nivel actual desde el inicio.
function repetirNivel() {
    if (esToqueRepetido()) {
        return;
    }
    iniciarNivel();
}

// Mueve el personaje con las flechas del teclado (en computadores).
function teclaPresionada(evento) {
    const teclas = {
        ArrowUp: "arriba",
        ArrowDown: "abajo",
        ArrowLeft: "izquierda",
        ArrowRight: "derecha"
    };
    const direccion = teclas[evento.key];
    if (!direccion) {
        return;      // No es una flecha: dejamos que la tecla funcione normal
    }

    // Evita que la flecha desplace la página mientras se juega
    evento.preventDefault();

    // Si la tecla se mantiene presionada, solo cuenta el primer paso
    if (evento.repeat) {
        return;
    }
    mover(direccion);
}


// ---------- INICIO ----------

// Conectamos los botones con sus funciones
document.getElementById("boton-arriba").addEventListener("click", function () { mover("arriba"); });
document.getElementById("boton-abajo").addEventListener("click", function () { mover("abajo"); });
document.getElementById("boton-izquierda").addEventListener("click", function () { mover("izquierda"); });
document.getElementById("boton-derecha").addEventListener("click", function () { mover("derecha"); });
botonSiguienteNivel.addEventListener("click", avanzarNivel);
botonRepetir.addEventListener("click", repetirNivel);
document.addEventListener("keydown", teclaPresionada);

// Empezamos el juego en el nivel 1
iniciarNivel();
