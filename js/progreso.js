// =========================================
// progreso.js
// Guarda qué niveles ha completado el estudiante en cada juego.
//
// Los datos se guardan en el navegador con localStorage, así que no se
// pierden al cerrarlo. Solo se guardan números de nivel: ningún nombre,
// correo ni dato personal.
//
// Ejemplo de cómo quedan guardados los datos:
//   { "parejas": [1, 2], "figuras": [], "secuencias": [1], "preguntas": [], "laberinto": [] }
//
// Este archivo NO toca la pantalla: solo lee y guarda datos.
// Lo usan el menú (app.js) y los juegos.
// =========================================


// Nombre con el que se guardan los datos en localStorage
const CLAVE_DEL_PROGRESO = "menteActivaProgreso";

// Juegos que guardan progreso
const juegosConProgreso = ["parejas", "figuras", "secuencias", "preguntas", "laberinto"];

// Cada juego tiene 3 niveles
const nivelesPorJuego = 3;


// Crea un progreso vacío: ningún nivel completado en ningún juego.
function crearProgresoVacio() {
    return { parejas: [], figuras: [], secuencias: [], preguntas: [], laberinto: [] };
}

// Comprueba que un número de nivel sea 1, 2 o 3.
function esNivelValido(numeroDeNivel) {
    return Number.isInteger(numeroDeNivel) && numeroDeNivel >= 1 && numeroDeNivel <= nivelesPorJuego;
}

// Lee el progreso guardado. Si no hay nada guardado o los datos están
// dañados, devuelve un progreso vacío para que la aplicación siga funcionando.
function leerProgreso() {
    const progreso = crearProgresoVacio();
    let datosGuardados;

    try {
        datosGuardados = JSON.parse(localStorage.getItem(CLAVE_DEL_PROGRESO));
    } catch (error) {
        // El texto guardado no es válido o el navegador bloquea localStorage
        return progreso;
    }

    // Si no hay datos o no tienen forma de objeto, empezamos vacíos
    if (datosGuardados === null || typeof datosGuardados !== "object") {
        return progreso;
    }

    // Copiamos solo los niveles válidos y sin repetir
    for (const juego of juegosConProgreso) {
        const nivelesGuardados = datosGuardados[juego];
        if (Array.isArray(nivelesGuardados)) {
            for (const nivel of nivelesGuardados) {
                if (esNivelValido(nivel) && !progreso[juego].includes(nivel)) {
                    progreso[juego].push(nivel);
                }
            }
            progreso[juego].sort();
        }
    }
    return progreso;
}

// Guarda el progreso en el navegador.
function guardarProgreso(progreso) {
    try {
        localStorage.setItem(CLAVE_DEL_PROGRESO, JSON.stringify(progreso));
    } catch (error) {
        // Si el navegador no deja guardar, el juego sigue funcionando igual
        console.warn("No se pudo guardar el progreso.");
    }
}

// Registra que se completó un nivel de un juego.
// Ejemplo: registrarNivelCompletado("parejas", 2)
// Devuelve true si el nivel es nuevo y false si ya estaba registrado.
function registrarNivelCompletado(juego, numeroDeNivel) {
    if (!juegosConProgreso.includes(juego) || !esNivelValido(numeroDeNivel)) {
        return false;
    }

    const progreso = leerProgreso();

    // Si ya estaba completado, no lo guardamos otra vez
    if (progreso[juego].includes(numeroDeNivel)) {
        return false;
    }

    progreso[juego].push(numeroDeNivel);
    progreso[juego].sort();
    guardarProgreso(progreso);
    return true;
}

// Devuelve cuántos niveles se han completado en un juego (de 0 a 3).
function contarNivelesCompletados(juego) {
    return leerProgreso()[juego].length;
}

// Devuelve el progreso de todos los juegos juntos.
// Ejemplo: { completados: 4, total: 15 }
function calcularProgresoGeneral() {
    let completados = 0;
    for (const juego of juegosConProgreso) {
        completados += contarNivelesCompletados(juego);
    }
    return {
        completados: completados,
        total: juegosConProgreso.length * nivelesPorJuego
    };
}

// Borra todo el progreso guardado.
function reiniciarProgreso() {
    try {
        localStorage.removeItem(CLAVE_DEL_PROGRESO);
    } catch (error) {
        console.warn("No se pudo borrar el progreso.");
    }
}
