// Configuración
const RUTA_BASE = './imagenes/salida/';

const imagenesEsperadas = [
    { nombre: 'test_1_2_copia.png', desc: '1.2 Copia de Matriz' },
    { nombre: 'test_1_3_canal_rojo.png', desc: '1.3 Canal Rojo' },
    { nombre: 'test_2_1_mas_brillante.png', desc: '2.1 Brillo Aumentado' },
    { nombre: 'test_2_1_mas_oscuro.png', desc: '2.1 Brillo Disminuido' },
    { nombre: 'test_2_2_invertida.png', desc: '2.2 Colores Invertidos' },
    { nombre: 'test_2_3_grises.png', desc: '2.3 Escala de Grises' },
    { nombre: 'test_3_1_espejo.png', desc: '3.1 Espejo Horizontal' },
    { nombre: 'test_3_2_volteo_vertical.png', desc: '3.2 Volteo Vertical' },
    { nombre: 'test_3_3_rotada_90.png', desc: '3.3 Rotación 90°' },
    { nombre: 'test_4_1_mezcla.png', desc: '4.1 Mezcla Básica' },
    { nombre: 'test_4_1_mezcla_pusheen.png', desc: '4.1 Mezcla Pusheen' },
    { nombre: 'test_4_1_mezcla_20.png', desc: '4.1 Mezcla 20%' },
    { nombre: 'test_4_1_mezcla_80.png', desc: '4.1 Mezcla 80%' },
    { nombre: 'test_4_2_sepia.png', desc: '4.2 Filtro Sepia' },
    { nombre: 'test_4_3_bordes.png', desc: '4.3 Detección de Bordes' }
];

const galeria = document.getElementById('galeria');
const zonaSeleccion = document.getElementById('zona-seleccion');
const contador = document.getElementById('contador');
let encontradas = 0;

// Función para crear tarjeta
function crearTarjeta(imagenData, index) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // --- LÓGICA DRAG & DROP ---
    // 1. Hacemos la tarjeta arrastrable
    card.setAttribute('draggable', true);
    // 2. Le damos un ID único para identificarla al soltar
    card.id = `card-${index}`;

    // Evento: Empieza el arrastre
    card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        // Guardamos el ID del elemento que estamos moviendo
        e.dataTransfer.setData('text/plain', card.id);
    });

    // Evento: Termina el arrastre (soltado o cancelado)
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });
    // ---------------------------

    const imgContainer = document.createElement('div');
    imgContainer.className = 'card-image-container';

    const img = document.createElement('img');
    img.alt = imagenData.desc;
    
    // Corrección de comillas invertidas aplicada aquí:
    const rutaImagen = `${RUTA_BASE}${imagenData.nombre}`;
    img.src = rutaImagen;

    img.onerror = () => {
        card.classList.add('missing');
        imgContainer.innerHTML = '<span style="color:#94a3b8; font-size:3rem;">⏳</span>';
        actualizarEstado(card, false);
    };

    img.onload = () => {
        encontradas++;
        actualizarContador();
        actualizarEstado(card, true);
    };

    imgContainer.appendChild(img);

    const info = document.createElement('div');
    info.className = 'card-info';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = imagenData.desc;

    const filename = document.createElement('div');
    filename.style.fontSize = '0.8rem';
    filename.style.color = '#64748b';
    filename.style.marginBottom = '0.5rem';
    filename.textContent = imagenData.nombre;

    const badge = document.createElement('span');
    badge.className = 'badge';
    // Corrección de comillas invertidas aplicada aquí:
    badge.id = `badge-${imagenData.nombre}`;
    badge.textContent = 'Cargando...';

    info.appendChild(title);
    info.appendChild(filename);
    info.appendChild(badge);

    card.appendChild(imgContainer);
    card.appendChild(info);
    
    // Añadimos inicialmente a la galería
    galeria.appendChild(card);
}

function actualizarEstado(card, exito) {
    const badge = card.querySelector('.badge');
    if (exito) {
        badge.textContent = 'Completado';
        badge.classList.add('found');
    } else {
        badge.textContent = 'Pendiente / No generado';
        badge.classList.add('missing');
        // Si no existe, quitamos la capacidad de arrastre para no confundir
        card.setAttribute('draggable', false);
        card.style.cursor = 'default';
    }
}



// --- CONFIGURACIÓN DE LAS ZONAS DE ARRASTRE ---
const contenedores = [galeria, zonaSeleccion];

contenedores.forEach(contenedor => {
    // Cuando pasamos un elemento por encima
    contenedor.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necesario para permitir el "drop"
        contenedor.classList.add('drag-over');
    });

    // Cuando salimos de la zona sin soltar
    contenedor.addEventListener('dragleave', () => {
        contenedor.classList.remove('drag-over');
    });

    // Cuando SOLTAMOS el elemento
    contenedor.addEventListener('drop', (e) => {
        e.preventDefault();
        contenedor.classList.remove('drag-over');
        
        // Recuperamos el ID del elemento que guardamos en 'dragstart'
        const idTarjeta = e.dataTransfer.getData('text/plain');
        const tarjetaArrastrada = document.getElementById(idTarjeta);

        if (tarjetaArrastrada) {
            // Si soltamos en la zona de selección, ocultamos el mensaje vacío
            if (contenedor === zonaSeleccion) {
                const mensaje = zonaSeleccion.querySelector('.mensaje-vacio');
                if (mensaje) mensaje.style.display = 'none';
            }
            
            // Movemos el elemento al nuevo contenedor
            contenedor.appendChild(tarjetaArrastrada);

            // Si la zona de selección se queda vacía, mostramos el mensaje de nuevo
            if (zonaSeleccion.children.length === 1 && zonaSeleccion.children[0].classList.contains('mensaje-vacio')) {
                 zonaSeleccion.querySelector('.mensaje-vacio').style.display = 'block';
            }
        }
    });
});

// Inicializar
imagenesEsperadas.forEach((img, index) => crearTarjeta(img, index));