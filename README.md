# Mente Activa

Videojuego educativo para celulares dirigido a estudiantes de **sexto grado** del **Colegio Brasilia Bosa**.
Proyecto académico desarrollado por estudiantes de **décimo grado**.

Está hecho solo con **HTML, CSS y JavaScript**, sin frameworks, sin servidor y sin instalar nada.

## Estado actual

- Menú principal con el progreso del estudiante.
- Cinco juegos terminados, cada uno con 3 niveles: **Parejas**, **Figuras**, **Secuencias**, **Preguntas** y **Laberinto mental** (15 niveles en total).
- Progreso guardado en el navegador: se conserva al cerrarlo y volver a abrirlo.

## Los juegos

| Juego | Qué entrena | Niveles | Para completar un nivel |
|---|---|---|---|
| **Parejas** | Memoria | 3, 4 y 6 parejas | Encontrar todas las parejas de tarjetas iguales. |
| **Figuras** | Atención visual | 5, 8 y 10 figuras objetivo | Pulsar todas las figuras pedidas (por ejemplo, «Encuentra todos los triángulos»). |
| **Secuencias** | Memoria y concentración | Secuencias de 3, 5 y 7 colores | Repetir correctamente 3 secuencias en el mismo orden. |
| **Preguntas** | Conocimientos de Matemáticas, Ciencias naturales, Español y Cultura general | 10 preguntas por nivel (fácil, medio y difícil) | Responder las 10 preguntas con **7 aciertos o más** (70 %). |
| **Laberinto mental** | Orientación espacial y planeación | Laberintos de 7×7, 11×11 y 13×13 casillas | Llevar al personaje 🙂 desde el inicio 🏠 hasta la salida 🏁 sin atravesar paredes. |

En todos los juegos solo se avanza de nivel después de completar el actual. Al terminar el nivel 3 aparece una felicitación y se puede volver a jugar desde el nivel 1.

### Reglas de Preguntas
- Cada pregunta tiene 4 opciones y una sola respuesta correcta. Solo se puede responder una vez.
- Cada acierto vale **10 puntos**; los errores valen 0 (no se restan puntos). Máximo: 100 puntos por nivel.
- Después de responder se muestra si fue correcta y una explicación breve. Si fue incorrecta, también se indica la respuesta correcta.
- Al terminar las 10 preguntas aparece un resumen con aciertos, errores, porcentaje y puntos.
- Las preguntas y sus opciones salen en orden al azar cada vez.
- Las 30 preguntas están en la lista `bancoDePreguntas` al inicio de `juegos/preguntas/preguntas.js`.

### Reglas de Laberinto mental
- Se mueve con los 4 botones de flecha (celular) o con las flechas del teclado (computador). Cada toque es un paso.
- Las paredes no se pueden atravesar: si se intenta, el personaje se sacude y aparece el aviso «¡Hay una pared!».
- Debajo del laberinto se indican los caminos libres desde la casilla actual (útil también para lectores de pantalla).
- No hay cronómetro ni penalizaciones: el contador de movimientos es solo informativo.
- Nivel 1: camino sencillo sin desvíos. Nivel 2: con callejones sin salida. Nivel 3: más grande y con recorrido más largo.
- Los laberintos están dibujados con texto en la lista `laberintos` al inicio de `juegos/laberinto/laberinto.js`
  (`#` pared, `.` camino, `I` inicio, `S` salida), así se pueden cambiar fácilmente.

## Estructura de carpetas

```text
mente_activa/
├── index.html              → Menú principal con el progreso
├── README.md               → Este archivo
├── css/
│   └── estilos.css         → Estilos generales compartidos
├── js/
│   ├── app.js              → Inicia el menú y muestra el progreso
│   ├── navegacion.js       → Moverse entre el menú y los juegos
│   └── progreso.js         → Guardar y leer los niveles completados
├── juegos/
│   ├── parejas/            → Juego Parejas (HTML, CSS y JS propios)
│   ├── figuras/            → Juego Figuras (HTML, CSS y JS propios)
│   ├── secuencias/         → Juego Secuencias (HTML, CSS y JS propios)
│   ├── preguntas/          → Juego Preguntas (HTML, CSS y JS propios)
│   └── laberinto/          → Juego Laberinto mental (HTML, CSS y JS propios)
└── assets/
    ├── imagenes/           → Imágenes (vacía por ahora)
    └── iconos/             → Iconos (vacía por ahora)
```

## Para qué sirve cada archivo

| Archivo | Propósito |
|---|---|
| `index.html` | Menú principal: progreso general, botones de los juegos con sus estrellas y el enlace «Reiniciar progreso». |
| `css/estilos.css` | Estilos que comparten todas las páginas: colores, botones, encabezado, panel de progreso, diseño para celular. |
| `js/app.js` | Muestra el progreso en el menú y pide confirmación antes de borrarlo. |
| `js/navegacion.js` | Funciones `irAJuego(nombre)` para abrir un juego y `volverAlMenu()` para regresar. |
| `js/progreso.js` | Guarda y lee los niveles completados. No toca la pantalla: solo maneja datos. |
| `juegos/<juego>/<juego>.html` | Página del juego. |
| `juegos/<juego>/<juego>.css` | Estilos que solo usa ese juego. |
| `juegos/<juego>/<juego>.js` | Lógica que solo usa ese juego. |

Cada juego es **independiente**: su código no se mezcla con el de los otros juegos.
Solo comparten `css/estilos.css`, `js/navegacion.js` y `js/progreso.js`.

## Cómo funciona el progreso

- Se guarda en el navegador con `localStorage`, en la clave `menteActivaProgreso`.
- Solo se guardan números de nivel, **ningún dato personal**. Ejemplo:
  `{"parejas":[1,2],"figuras":[1],"secuencias":[],"preguntas":[3],"laberinto":[1]}`
- Si los datos se guardaron antes de que existieran Preguntas o Laberinto mental (sin la clave `"preguntas"` o `"laberinto"`), se leen igual: ese juego aparece con 0 niveles.
- Cada juego llama a `registrarNivelCompletado("nombreDelJuego", numeroDeNivel)` **solo cuando el nivel se completa**. Abrir un juego no registra nada.
- Repetir un nivel ya completado no lo cuenta dos veces.
- Si **una parte** de los datos guardados está dañada, se conservan los niveles válidos y se descarta lo inválido.
  Por ejemplo, `{"parejas":[1, 9, "x"], "figuras":"dañado"}` se lee como Parejas nivel 1 y nada en los demás juegos.
- Si **todos** los datos están dañados (o no se pueden leer), el menú empieza con el progreso vacío (0 / 15) y la aplicación sigue funcionando.
  Los datos dañados se reemplazan la próxima vez que se complete un nivel.
- El enlace **Reiniciar progreso** pide confirmación antes de borrar.

## Rutas relativas

- Desde `index.html` los archivos se buscan así: `css/estilos.css`, `js/app.js`, `juegos/parejas/parejas.html`.
- Desde un juego (por ejemplo `juegos/parejas/parejas.html`) hay que **subir dos carpetas** con `../../`:
  `../../css/estilos.css`, `../../js/navegacion.js`, `../../js/progreso.js`, `../../index.html`.

## Cómo ejecutar el proyecto

**Forma recomendada: Visual Studio Code con Live Server**
1. Abrir la carpeta del proyecto en VS Code (*Archivo → Abrir carpeta*).
2. Instalar la extensión **Live Server** (de Ritwick Dey) desde el panel de extensiones.
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. La página se abre en el navegador y se actualiza sola al guardar cambios.

**Forma rápida: doble clic en `index.html`**
Funciona para jugar, pero el progreso puede no verse en el menú en algunos navegadores (por ejemplo, Firefox guarda los datos por separado en cada página abierta así). Con Chrome funciona. Para evitar problemas, usar Live Server.

**Para verlo como celular:** en el navegador presionar `F12` y luego `Ctrl + Shift + M`.

## Cómo probar el proyecto

1. Abrir el menú y comprobar que muestra **0 / 15 niveles completados**.
2. Entrar a cada juego, completar un nivel y pulsar **Volver al menú**: deben aparecer las estrellas y avanzar la barra.
3. Probar los casos difíciles de cada juego:
   - **Parejas:** pulsar tarjetas muy rápido o la misma tarjeta dos veces.
   - **Figuras:** pulsar figuras equivocadas o la misma figura dos veces.
   - **Secuencias:** pulsar colores durante la demostración o equivocarse a propósito.
   - **Preguntas:** intentar responder dos veces la misma pregunta, terminar un nivel con 6 aciertos (no debe aprobar) y con 7 (sí debe aprobar).
   - **Laberinto mental:** chocar contra las paredes, mantener presionada una flecha del teclado (solo da un paso) y llegar a la salida; después tocar dos veces seguidas «Repetir nivel».
4. Cerrar el navegador, volver a abrirlo y comprobar que el progreso sigue ahí.
5. Ver los datos guardados: `F12` → pestaña **Application** (Aplicación) → **Local Storage** → `menteActivaProgreso`.
6. Pulsar **Reiniciar progreso** y probar «Cancelar» (no borra) y «Aceptar» (borra todo).
