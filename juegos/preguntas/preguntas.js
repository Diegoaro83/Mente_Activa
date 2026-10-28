// =========================================
// preguntas.js
// Juego de preguntas de selección múltiple.
//
// REGLAS:
// - Hay 3 niveles con 10 preguntas cada uno (30 en total).
// - Cada respuesta correcta vale 10 puntos. Las incorrectas valen 0
//   (nunca se restan puntos).
// - Para aprobar un nivel hay que tener al menos 7 aciertos de 10 (70 %).
// - Solo al aprobar se guarda el nivel en el progreso y se puede pasar al siguiente.
// =========================================


// ---------- CONFIGURACIÓN DEL JUEGO ----------

const puntosPorAcierto = 10;      // Puntos que vale cada respuesta correcta
const aciertosParaAprobar = 7;    // Mínimo de aciertos para aprobar un nivel
const pausaEntreToques = 400;     // Milisegundos en los que se ignoran toques repetidos
const letrasDeOpciones = ["A", "B", "C", "D"];


// ---------- BANCO DE PREGUNTAS ----------
// Cada pregunta tiene:
// - tema: Matemáticas, Ciencias naturales, Español o Cultura general
// - enunciado: la pregunta
// - opciones: 4 respuestas posibles
// - correcta: posición de la respuesta correcta en "opciones" (0 = la primera)
// - explicacion: por qué esa respuesta es la correcta
//
// bancoDePreguntas[0] es el nivel 1, bancoDePreguntas[1] el nivel 2, etc.

const bancoDePreguntas = [
    // ===== NIVEL 1 (fácil) =====
    [
        {
            tema: "Matemáticas",
            enunciado: "¿Cuánto es 7 × 8?",
            opciones: ["54", "56", "63", "48"],
            correcta: 1,
            explicacion: "7 × 8 = 56. Un truco: 7 × 4 = 28, y el doble de 28 es 56."
        },
        {
            tema: "Matemáticas",
            enunciado: "¿Cuál de estos números es par?",
            opciones: ["37", "51", "84", "99"],
            correcta: 2,
            explicacion: "Un número es par si termina en 0, 2, 4, 6 u 8. El 84 termina en 4."
        },
        {
            tema: "Matemáticas",
            enunciado: "¿Cuál es la mitad de 50?",
            opciones: ["20", "25", "30", "15"],
            correcta: 1,
            explicacion: "La mitad es dividir entre 2: 50 ÷ 2 = 25."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "¿Qué gas del aire necesita nuestro cuerpo y tomamos al respirar?",
            opciones: ["Dióxido de carbono", "Helio", "Oxígeno", "Hidrógeno"],
            correcta: 2,
            explicacion: "Al respirar tomamos oxígeno, que las células usan para obtener energía. El dióxido de carbono es el gas que expulsamos."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "¿Qué parte de la planta absorbe el agua del suelo?",
            opciones: ["La flor", "La raíz", "La hoja", "El fruto"],
            correcta: 1,
            explicacion: "La raíz está bajo la tierra y absorbe el agua y los minerales que la planta necesita."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "Cuando el agua se convierte en hielo, ¿en qué estado se encuentra?",
            opciones: ["Líquido", "Gaseoso", "Sólido", "Plasma"],
            correcta: 2,
            explicacion: "El hielo es agua en estado sólido: tiene forma propia y no se derrama."
        },
        {
            tema: "Español",
            enunciado: "¿Cuál de estas palabras es un sustantivo?",
            opciones: ["Salta", "Mesa", "Bonito", "Rápidamente"],
            correcta: 1,
            explicacion: "Un sustantivo nombra personas, animales, cosas o lugares. «Mesa» nombra una cosa."
        },
        {
            tema: "Español",
            enunciado: "¿Cuál es un sinónimo de «feliz»?",
            opciones: ["Triste", "Cansado", "Contento", "Enojado"],
            correcta: 2,
            explicacion: "Los sinónimos son palabras que significan lo mismo o casi lo mismo. «Feliz» y «contento» significan lo mismo."
        },
        {
            tema: "Cultura general",
            enunciado: "¿Cuál es la capital de Colombia?",
            opciones: ["Medellín", "Cali", "Bogotá", "Cartagena"],
            correcta: 2,
            explicacion: "Bogotá es la capital de Colombia. Allí funcionan el Gobierno nacional y el Congreso."
        },
        {
            tema: "Cultura general",
            enunciado: "¿Cuántos colores tiene la bandera de Colombia?",
            opciones: ["2", "3", "4", "5"],
            correcta: 1,
            explicacion: "La bandera de Colombia tiene 3 colores: amarillo, azul y rojo."
        }
    ],

    // ===== NIVEL 2 (medio) =====
    [
        {
            tema: "Matemáticas",
            enunciado: "¿Cuánto es 3/4 + 1/4?",
            opciones: ["4/8", "1", "3/16", "2/4"],
            correcta: 1,
            explicacion: "Las fracciones tienen el mismo denominador, así que se suman los numeradores: 3/4 + 1/4 = 4/4, y 4/4 es igual a 1 entero."
        },
        {
            tema: "Matemáticas",
            enunciado: "¿Cuál es el perímetro de un cuadrado que mide 5 cm de lado?",
            opciones: ["25 cm", "10 cm", "20 cm", "15 cm"],
            correcta: 2,
            explicacion: "El perímetro es la suma de todos los lados. Un cuadrado tiene 4 lados iguales: 5 + 5 + 5 + 5 = 20 cm."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "¿Qué órgano bombea la sangre por todo el cuerpo?",
            opciones: ["El corazón", "Los pulmones", "El hígado", "El estómago"],
            correcta: 0,
            explicacion: "El corazón es un músculo que late para impulsar la sangre por las venas y las arterias."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "¿Cómo se llama el proceso con el que las plantas fabrican su alimento usando la luz del Sol?",
            opciones: ["Respiración", "Digestión", "Evaporación", "Fotosíntesis"],
            correcta: 3,
            explicacion: "En la fotosíntesis, las plantas usan la luz del Sol, el agua y el dióxido de carbono para fabricar su alimento y liberan oxígeno."
        },
        {
            tema: "Español",
            enunciado: "¿Cuál palabra está escrita correctamente?",
            opciones: ["Arból", "Árbol", "Arbol", "Árból"],
            correcta: 1,
            explicacion: "«Árbol» es una palabra grave (la fuerza va en «ár») que termina en «l», por eso lleva tilde en la «a»."
        },
        {
            tema: "Español",
            enunciado: "¿Cuál es el antónimo de «generoso»?",
            opciones: ["Amable", "Bondadoso", "Alegre", "Tacaño"],
            correcta: 3,
            explicacion: "Un antónimo significa lo contrario. Una persona generosa comparte; una persona tacaña no quiere compartir."
        },
        {
            tema: "Español",
            enunciado: "En la oración «El perro corre en el parque», ¿cuál es el verbo?",
            opciones: ["Perro", "Corre", "Parque", "El"],
            correcta: 1,
            explicacion: "El verbo indica la acción. En esta oración la acción es «corre»."
        },
        {
            tema: "Cultura general",
            enunciado: "¿Cuál es el océano más grande del planeta?",
            opciones: ["Atlántico", "Índico", "Pacífico", "Ártico"],
            correcta: 2,
            explicacion: "El océano Pacífico es el más grande y profundo de la Tierra. Baña la costa occidental de Colombia."
        },
        {
            tema: "Cultura general",
            enunciado: "¿Qué país de Europa tiene forma de bota en el mapa?",
            opciones: ["España", "Italia", "Francia", "Grecia"],
            correcta: 1,
            explicacion: "Italia es una península alargada que en el mapa parece una bota."
        },
        {
            tema: "Cultura general",
            enunciado: "¿Cuántos años tiene un siglo?",
            opciones: ["10", "50", "100", "1000"],
            correcta: 2,
            explicacion: "Un siglo son 100 años. 10 años son una década y 1000 años son un milenio."
        }
    ],

    // ===== NIVEL 3 (difícil) =====
    [
        {
            tema: "Matemáticas",
            enunciado: "¿Cuánto es el 25 % de 80?",
            opciones: ["20", "25", "40", "16"],
            correcta: 0,
            explicacion: "El 25 % es la cuarta parte. 80 ÷ 4 = 20."
        },
        {
            tema: "Matemáticas",
            enunciado: "Si un cuaderno cuesta $3.500, ¿cuánto cuestan 4 cuadernos?",
            opciones: ["$12.000", "$13.500", "$14.000", "$15.000"],
            correcta: 2,
            explicacion: "Se multiplica el precio por la cantidad: 3.500 × 4 = 14.000."
        },
        {
            tema: "Matemáticas",
            enunciado: "¿Cuál es el mínimo común múltiplo (m.c.m.) de 4 y 6?",
            opciones: ["2", "10", "12", "24"],
            correcta: 2,
            explicacion: "Múltiplos de 4: 4, 8, 12, 16… Múltiplos de 6: 6, 12, 18… El primero que se repite es el 12."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "¿Cuál es el planeta más cercano al Sol?",
            opciones: ["Venus", "Mercurio", "Marte", "La Tierra"],
            correcta: 1,
            explicacion: "Mercurio es el primer planeta del sistema solar. Después vienen Venus, la Tierra y Marte."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "¿Cuál es la unidad más pequeña que tiene vida y de la que están formados todos los seres vivos?",
            opciones: ["El átomo", "El órgano", "La célula", "El tejido"],
            correcta: 2,
            explicacion: "La célula es la unidad básica de la vida. Los tejidos y órganos están formados por muchas células; el átomo no tiene vida."
        },
        {
            tema: "Ciencias naturales",
            enunciado: "¿Qué tipo de animal es la ballena?",
            opciones: ["Pez", "Mamífero", "Anfibio", "Reptil"],
            correcta: 1,
            explicacion: "La ballena es un mamífero: respira aire con pulmones y alimenta a sus crías con leche."
        },
        {
            tema: "Español",
            enunciado: "¿Cuál de estas palabras es aguda (la fuerza de voz va en la última sílaba)?",
            opciones: ["Árbol", "Lápiz", "Música", "Canción"],
            correcta: 3,
            explicacion: "En «can-CIÓN» la fuerza va en la última sílaba. «Árbol» y «lápiz» son graves, y «música» es esdrújula."
        },
        {
            tema: "Español",
            enunciado: "¿En cuál oración está bien usada la palabra «tuvo»?",
            opciones: [
                "El agua sale por el tuvo.",
                "Ana tuvo un perro cuando era niña.",
                "Compré un tuvo de pegante.",
                "Se rompió el tuvo de la cocina."
            ],
            correcta: 1,
            explicacion: "«Tuvo» (con v) viene del verbo tener. «Tubo» (con b) es un objeto hueco, como el de la cocina."
        },
        {
            tema: "Cultura general",
            enunciado: "¿Quién escribió la novela «Cien años de soledad»?",
            opciones: ["Rafael Pombo", "Jorge Isaacs", "Gabriel García Márquez", "Pablo Neruda"],
            correcta: 2,
            explicacion: "Gabriel García Márquez, escritor colombiano, la publicó en 1967. Recibió el Premio Nobel de Literatura en 1982."
        },
        {
            tema: "Cultura general",
            enunciado: "¿Cuál es el país más grande del mundo por su territorio?",
            opciones: ["China", "Canadá", "Estados Unidos", "Rusia"],
            correcta: 3,
            explicacion: "Rusia es el país con mayor territorio: ocupa parte de Europa y de Asia."
        }
    ]
];


// ---------- ESTADO DEL JUEGO (cambia mientras se juega) ----------

let nivelActual = 0;          // Empieza en 0, que es el nivel 1
let preguntasDelNivel = [];   // Las 10 preguntas del nivel, en orden al azar
let numeroDePregunta = 0;     // Posición de la pregunta actual (0 = la primera)
let aciertos = 0;             // Respuestas correctas en este nivel
let errores = 0;              // Respuestas incorrectas en este nivel
let yaRespondio = false;      // true cuando ya se respondió la pregunta actual
let momentoDelUltimoCambio = 0;   // Cuándo cambió la pantalla por última vez


// ---------- ELEMENTOS DEL HTML ----------

const textoNivel = document.getElementById("texto-nivel");
const textoPregunta = document.getElementById("texto-pregunta");
const textoAciertos = document.getElementById("texto-aciertos");
const textoPuntos = document.getElementById("texto-puntos");
const textoRegla = document.getElementById("texto-regla");
const zonaPregunta = document.getElementById("zona-pregunta");
const textoTema = document.getElementById("texto-tema");
const textoEnunciado = document.getElementById("texto-enunciado");
const contenedorOpciones = document.getElementById("opciones");
const retroalimentacion = document.getElementById("retroalimentacion");
const textoResultado = document.getElementById("texto-resultado");
const textoExplicacion = document.getElementById("texto-explicacion");
const botonContinuar = document.getElementById("boton-continuar");
const zonaResumen = document.getElementById("zona-resumen");
const textoResumenTitulo = document.getElementById("texto-resumen-titulo");
const resumenAciertos = document.getElementById("resumen-aciertos");
const resumenErrores = document.getElementById("resumen-errores");
const resumenPorcentaje = document.getElementById("resumen-porcentaje");
const resumenPuntos = document.getElementById("resumen-puntos");
const textoResumenMensaje = document.getElementById("texto-resumen-mensaje");
const botonSiguienteNivel = document.getElementById("boton-siguiente-nivel");
const botonRepetir = document.getElementById("boton-repetir");


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

// Escribe un número con la palabra en singular o en plural.
// Ejemplo: escribirCantidad(1, "error", "errores") devuelve "1 error"
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
// Así un doble toque no pulsa sin querer el botón que aparece debajo del dedo.
function esToqueRepetido() {
    return Date.now() - momentoDelUltimoCambio < pausaEntreToques;
}

// Calcula los puntos: cada acierto vale 10, los errores valen 0.
function calcularPuntos() {
    return aciertos * puntosPorAcierto;
}

// Devuelve true si el nivel terminó y se aprobó.
function nivelAprobado() {
    return numeroDePregunta === preguntasDelNivel.length && aciertos >= aciertosParaAprobar;
}


// ---------- FUNCIONES DEL JUEGO ----------

// Prepara el nivel actual desde cero: preguntas en orden al azar y marcador en cero.
function iniciarNivel() {
    // slice() hace una copia para no desordenar el banco original
    preguntasDelNivel = mezclarLista(bancoDePreguntas[nivelActual].slice());
    numeroDePregunta = 0;
    aciertos = 0;
    errores = 0;

    textoRegla.textContent = "Nivel " + (nivelActual + 1) + ": " + preguntasDelNivel.length +
        " preguntas. Cada acierto vale " + puntosPorAcierto + " puntos. Para aprobar necesitas " +
        aciertosParaAprobar + " aciertos o más.";

    zonaResumen.classList.add("oculto");
    zonaPregunta.classList.remove("oculto");
    mostrarPregunta();
}

// Muestra la pregunta actual con sus 4 opciones.
function mostrarPregunta() {
    const pregunta = preguntasDelNivel[numeroDePregunta];
    yaRespondio = false;

    textoTema.textContent = pregunta.tema;
    textoEnunciado.textContent = pregunta.enunciado;

    // Las opciones salen en orden al azar para que no se memorice la posición.
    // Cada botón guarda la posición ORIGINAL de su opción para poder comprobarla.
    contenedorOpciones.innerHTML = "";
    const ordenDeOpciones = mezclarLista([0, 1, 2, 3]);
    for (let i = 0; i < ordenDeOpciones.length; i++) {
        contenedorOpciones.appendChild(crearBotonDeOpcion(pregunta, ordenDeOpciones[i], letrasDeOpciones[i]));
    }

    retroalimentacion.classList.add("oculto");
    botonContinuar.classList.add("oculto");
    actualizarMarcador();
    marcarCambioDePantalla();
}

// Crea el botón de una opción, con su letra (A, B, C o D) y su texto.
function crearBotonDeOpcion(pregunta, posicionOriginal, letra) {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.dataset.opcion = posicionOriginal;
    boton.dataset.letra = letra;
    boton.setAttribute("aria-label", "Opción " + letra + ": " + pregunta.opciones[posicionOriginal]);

    const circulo = document.createElement("span");
    circulo.className = "letra";
    circulo.textContent = letra;

    const texto = document.createElement("span");
    texto.className = "texto-opcion";
    texto.textContent = pregunta.opciones[posicionOriginal];

    boton.appendChild(circulo);
    boton.appendChild(texto);
    boton.addEventListener("click", function () {
        responder(boton);
    });
    return boton;
}

// Se ejecuta cuando el estudiante elige una opción.
function responder(botonElegido) {
    // Solo se puede responder una vez por pregunta
    if (yaRespondio || esToqueRepetido()) {
        return;
    }
    yaRespondio = true;

    const pregunta = preguntasDelNivel[numeroDePregunta];
    const esCorrecta = Number(botonElegido.dataset.opcion) === pregunta.correcta;

    if (esCorrecta) {
        aciertos++;
    } else {
        errores++;
    }

    marcarOpciones(botonElegido, pregunta);
    mostrarRetroalimentacion(esCorrecta, pregunta);
    actualizarMarcador();
}

// Marca las opciones: la correcta en verde con "✔ Correcta" y, si el estudiante
// se equivocó, su opción en rojo con "✘ Tu respuesta". Las demás se apagan.
function marcarOpciones(botonElegido, pregunta) {
    for (const boton of contenedorOpciones.children) {
        boton.disabled = true;
        const esLaCorrecta = Number(boton.dataset.opcion) === pregunta.correcta;
        let textoMarca = "";        // Lo que se ve en pantalla
        let textoParaLector = "";   // Lo que dice el lector de pantalla

        if (esLaCorrecta) {
            boton.classList.add("correcta");
            textoMarca = "✔ Correcta";
            textoParaLector = "respuesta correcta";
        } else if (boton === botonElegido) {
            boton.classList.add("incorrecta");
            textoMarca = "✘ Tu respuesta";
            textoParaLector = "tu respuesta, incorrecta";
        } else {
            boton.classList.add("apagada");
        }

        if (textoMarca !== "") {
            const marca = document.createElement("span");
            marca.className = "marca";
            marca.textContent = textoMarca;
            boton.appendChild(marca);
            boton.setAttribute("aria-label", boton.getAttribute("aria-label") + ". " + textoParaLector);
        }
    }
}

// Muestra si la respuesta fue correcta y la explicación.
function mostrarRetroalimentacion(esCorrecta, pregunta) {
    if (esCorrecta) {
        textoResultado.textContent = "✔ ¡Correcto! +" + puntosPorAcierto + " puntos";
        retroalimentacion.classList.remove("error");
    } else {
        // Buscamos la letra con la que se mostró la respuesta correcta
        const botonCorrecto = contenedorOpciones.querySelector(".correcta");
        textoResultado.textContent = "✘ Incorrecto. La respuesta correcta es la " +
            botonCorrecto.dataset.letra + ": " + pregunta.opciones[pregunta.correcta];
        retroalimentacion.classList.add("error");
    }
    textoExplicacion.textContent = pregunta.explicacion;
    retroalimentacion.classList.remove("oculto");

    // En la última pregunta el botón lleva a los resultados
    const esUltimaPregunta = numeroDePregunta === preguntasDelNivel.length - 1;
    if (esUltimaPregunta) {
        botonContinuar.textContent = "Ver resultados";
    } else {
        botonContinuar.textContent = "Siguiente pregunta";
    }
    botonContinuar.classList.remove("oculto");
}

// Pasa a la siguiente pregunta o, si era la última, muestra el resumen.
function continuar() {
    if (!yaRespondio || esToqueRepetido()) {
        return;
    }
    numeroDePregunta++;

    if (numeroDePregunta < preguntasDelNivel.length) {
        mostrarPregunta();
    } else {
        mostrarResumen();
    }
}

// Escribe en pantalla el nivel, la pregunta, los aciertos y los puntos.
function actualizarMarcador() {
    // Al terminar, numeroDePregunta vale 10: mostramos "10 / 10"
    const preguntaVisible = Math.min(numeroDePregunta + 1, preguntasDelNivel.length);

    textoNivel.textContent = (nivelActual + 1) + " / " + bancoDePreguntas.length;
    textoPregunta.textContent = preguntaVisible + " / " + preguntasDelNivel.length;
    textoAciertos.textContent = aciertos;
    textoPuntos.textContent = calcularPuntos();
}

// Muestra el resumen del nivel y, si se aprobó, lo guarda en el progreso.
function mostrarResumen() {
    const totalDePreguntas = preguntasDelNivel.length;
    const porcentaje = Math.round(aciertos / totalDePreguntas * 100);
    const esUltimoNivel = nivelActual === bancoDePreguntas.length - 1;

    zonaPregunta.classList.add("oculto");
    actualizarMarcador();

    resumenAciertos.textContent = aciertos;
    resumenErrores.textContent = errores;
    resumenPorcentaje.textContent = porcentaje + " %";
    resumenPuntos.textContent = calcularPuntos() + " de " + totalDePreguntas * puntosPorAcierto;

    if (nivelAprobado()) {
        // Guardamos en el progreso general que este nivel se completó (ver progreso.js)
        registrarNivelCompletado("preguntas", nivelActual + 1);

        if (esUltimoNivel) {
            textoResumenTitulo.textContent = "🏆 ¡Felicitaciones! Completaste los 3 niveles";
            textoResumenMensaje.textContent = "Aprobaste el último nivel con " +
                escribirCantidad(aciertos, "acierto", "aciertos") + ".";
            botonSiguienteNivel.textContent = "Volver a jugar";
        } else {
            textoResumenTitulo.textContent = "🎉 ¡Aprobaste el nivel " + (nivelActual + 1) + "!";
            textoResumenMensaje.textContent = "Ya puedes pasar al siguiente nivel.";
            botonSiguienteNivel.textContent = "Siguiente nivel";
        }
        botonSiguienteNivel.classList.remove("oculto");
    } else {
        textoResumenTitulo.textContent = "Nivel " + (nivelActual + 1) + " terminado";
        textoResumenMensaje.textContent = "Necesitas " + aciertosParaAprobar +
            " aciertos o más para aprobar. ¡Repite el nivel e inténtalo de nuevo!";
        botonSiguienteNivel.classList.add("oculto");
    }

    zonaResumen.classList.remove("oculto");
    marcarCambioDePantalla();
}

// Pasa al siguiente nivel (o vuelve al 1 después del último), solo si se aprobó.
function avanzarNivel() {
    if (!nivelAprobado() || esToqueRepetido()) {
        return;
    }

    if (nivelActual < bancoDePreguntas.length - 1) {
        nivelActual++;
    } else {
        nivelActual = 0;      // Terminó el último nivel: vuelve a empezar
    }
    iniciarNivel();
}

// Vuelve a empezar el nivel actual desde la primera pregunta.
function repetirNivel() {
    if (esToqueRepetido()) {
        return;
    }
    iniciarNivel();
}


// ---------- INICIO ----------

// Conectamos los botones con sus funciones
botonContinuar.addEventListener("click", continuar);
botonSiguienteNivel.addEventListener("click", avanzarNivel);
botonRepetir.addEventListener("click", repetirNivel);

// Empezamos el juego en el nivel 1
iniciarNivel();
