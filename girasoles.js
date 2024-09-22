const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let numPetalos = 20;  // Número de pétalos grandes
let anguloActual = 0;  // Ángulo para la animación
let radioCentro = 30;  // Tamaño del centro del girasol principal
let longitudPetalo = 200;  // Longitud de los pétalos grandes
let nivelRecursion = 3;  // Nivel de recursión (cuántas versiones más pequeñas de cada pétalo)
let numSemillas = 0;  // Contador para semillas
let totalSemillas = 500;  // Número total de semillas
let semillaAngulo = 137.5;  // Ángulo para distribuir semillas en espiral
let girasolesPequenos = [];  // Lista para almacenar las posiciones de los girasoles pequeños

// Configurar las posiciones de los girasoles pequeños alrededor de la pantalla
function inicializarGirasolesPequenos() {
    let numGirasoles = 8;  // Número de girasoles pequeños
    let radioPantalla = canvas.width / 2 - 50;  // Distancia desde el centro hacia los bordes de la pantalla

    for (let i = 0; i < numGirasoles; i++) {
        let angulo = (2 * Math.PI / numGirasoles) * i;
        let x = canvas.width / 2 + radioPantalla * Math.cos(angulo);
        let y = canvas.height / 2 + radioPantalla * Math.sin(angulo);
        girasolesPequenos.push({ x, y });
    }
}

// Función para dibujar un pétalo puntiagudo usando curvas de Bézier
function dibujarPetalo(x, y, angulo, escala, nivel) {
    if (nivel <= 0 || escala < 0.01) return;  // Detener si el nivel es 0 o la escala es muy pequeña
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(50 * escala, -longitudPetalo / 2 * escala, 100 * escala, -longitudPetalo / 2 * escala, 0, -longitudPetalo * escala);
    ctx.bezierCurveTo(-100 * escala, -longitudPetalo / 2 * escala, -50 * escala, -longitudPetalo / 2 * escala, 0, 0);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    let nuevaEscala = escala * 0.7;
    dibujarPetalo(x, y, angulo, nuevaEscala, nivel - 1);  // Recursión
}


// Función para generar colores para las semillas
function colorSemilla(n) {
    const baseBrown = [139, 69, 19];  // Marrón oscuro (RGB)
    const baseYellow = [218, 165, 32];  // Dorado (RGB)
    
    // Interpolar entre marrón oscuro y dorado para una variación suave
    const factor = n / totalSemillas;
    const r = Math.floor(baseBrown[0] * (1 - factor) + baseYellow[0] * factor);
    const g = Math.floor(baseBrown[1] * (1 - factor) + baseYellow[1] * factor);
    const b = Math.floor(baseBrown[2] * (1 - factor) + baseYellow[2] * factor);
    
    return `rgb(${r},${g},${b})`;
}

// Función para dibujar el centro del girasol con varios círculos (semillas)
function dibujarCentro(x, y, radio, escala) {
    let semillasEnEscala = totalSemillas * escala;  // Ajustar el número de semillas según el tamaño del girasol

    for (let i = 0; i < semillasEnEscala; i++) {
        let angulo = i * semillaAngulo * (Math.PI / 180);  // Convertir a radianes
        let r = Math.sqrt(i) * 3 * escala;  // Ajustar el radio según el tamaño del girasol
        let xSemilla = x + r * Math.cos(angulo);
        let ySemilla = y + r * Math.sin(angulo);
        
        ctx.beginPath();
        ctx.arc(xSemilla, ySemilla, radio * 0.08 * escala, 0, 2 * Math.PI);  // Ajustar el tamaño de las semillas
        ctx.fillStyle = colorSemilla(i);  // Color de la semilla
        ctx.fill();
    }
}

// Dibujar un girasol completo (pétalos y centro)
function dibujarGirasol(x, y, escala) {
    // Dibujar pétalos
    for (let i = 0; i < numPetalos; i++) {
        let angulo = (2 * Math.PI / numPetalos) * i;
        dibujarPetalo(x, y, angulo, escala, nivelRecursion);
    }
    // Dibujar centro
    dibujarCentro(x, y, radioCentro * escala, escala);
}

// Animación del girasol principal y los pequeños
function animarGirasol() {
    let xCentro = canvas.width / 2;
    let yCentro = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas

    // Dibujar el girasol principal, pero mostrar progresivamente los pétalos con animación
    if (anguloActual < numPetalos) {
        for (let i = 0; i < Math.min(anguloActual, numPetalos); i++) {
            let angulo = (2 * Math.PI / numPetalos) * i;
            dibujarPetalo(xCentro, yCentro, angulo, 1, nivelRecursion);
        }
    } else {
        dibujarGirasol(xCentro, yCentro, 1);  // Dibujar el girasol completo cuando la animación termine
    }

    // Dibujar los girasoles pequeños alrededor del canvas
    for (let girasol of girasolesPequenos) {
        dibujarGirasol(girasol.x, girasol.y, 0.4);  // Escala más pequeña para los girasoles alrededor
    }

    // Aumentar el número de pétalos visibles del girasol principal
    if (anguloActual < numPetalos) {
        anguloActual += 0.1;  // Velocidad de la animación
    }

    // Solicitar la siguiente animación
    requestAnimationFrame(animarGirasol);
}

// Inicializar los girasoles pequeños y empezar la animación
inicializarGirasolesPequenos();
animarGirasol();
