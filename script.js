document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos del DOM
    const activitySelect = document.getElementById('activitySelect');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskListContainer = document.getElementById('taskList'); // Contenedor inicial
    const quadrants = document.querySelectorAll('.quadrant'); // Todos los cuadrantes
    const dropZones = [taskListContainer, ...quadrants]; // Todas las zonas donde se puede soltar

    let taskIdCounter = 0; // Contador para IDs únicos de tareas

    // Datos de las actividades (podría venir de un JSON en una app más grande)
    const activities = {
        activity1: ["Tarea 1: Estudiar para un examen de química que es mañana.", "Tarea 2: Jugar videojuegos después de clases.", "Tarea 3: Ayudar a un compañero con una duda de historia.", "Tarea 4: Limpiar el cuarto (mamá lo pidió para el fin de semana).", "Tarea 5: Hacer un dibujo para el concurso del colegio (fecha límite en 2 semanas).", "Tarea 6: Ver una serie nueva en Netflix.", "Tarea 7: Preparar la mochila para mañana.", "Tarea 8: Practicar para el ensayo de la obra de teatro (en 3 días).", "Tarea 9: Responder mensajes grupo amigos de WhatsApp.", "Tarea 10: Hacer ejercicios de caligrafía (tarea pendiente de la semana pasada)."],
        activity2: ["Tarea 1: Entregar un ensayo de lenguaje (para dentro de 2 días).", "Tarea 2: Ensayar una coreografía para el festival (en 1 mes).", "Tarea 3: Comprar materiales faltantes para la feria de ciencias (mañana es la feria).", "Tarea 4: Leer un libro para el club de lectura (reunión en 10 días).", "Tarea 5: Hacer ejercicios de inglés (tarea para hoy, subir a teams).", "Tarea 6: Organizar la carpeta de arte (sin fecha específica).", "Tarea 7: Ir a una fiesta de cumpleaños (este sábado).", "Tarea 8: Reparar la bicicleta para el paseo familiar (próximo domingo).", "Tarea 9: Practicar danza (clase en 5 días).", "Tarea 10: Terminar un rompecabezas en casa (sin prisa)."],
        activity3: ["Tarea 1: Repasar los apuntes de ciencias.", "Tarea 2: Ir al partido de fútbol.", "Tarea 3: Ayudar a tu amigo con el proyecto.", "Tarea 4: Hacer la tarea de matemáticas (para mañana).", "Tarea 5: Descansar 30 minutos.", "Tarea 6: Preparar la presentación del proyecto grupal (para la próxima semana).", "Tarea 7: Limpiar el escritorio.", "Tarea 8: Ver un tutorial sobre el tema del examen.", "Tarea 9: Hablar o llamar a un familiar.", "Tarea 10: Organizar el armario de tu cuarto."],
        activity4: ["Tarea 1: Repasar 15 minutos diarios de matemáticas.", "Tarea 2: Hacer resúmenes de cada tema nuevo.", "Tarea 3: Jugar al baloncesto después de clases.", "Tarea 4: Revisar TikTok antes de dormir.", "Tarea 5: Pedir ayuda al profesor si no entiendes algo.", "Tarea 6: Organizar un grupo de estudio semanal.", "Tarea 7: Ver películas en inglés para practicar.", "Tarea 8: Dormir 8 horas diarias.", "Tarea 9: Hacer mapas mentales de historia.", "Tarea 10: Limpiar la mochila cada viernes."],
        activity5: ["Tarea 1: Repasar el tema del examen.", "Tarea 2: Preparar el experimento para el club de ciencia.", "Tarea 3: Ayudar a limpiar la casa para la visita.", "Tarea 4: Terminar la pintura del proyecto de arte.", "Tarea 5: Hacer la tarea de inglés (para el lunes).", "Tarea 6: Jugar con el perro.", "Tarea 7: Responder mensajes de Teams del módulo de arte.", "Tarea 8: Descansar 20 minutos.", "Tarea 9: Ordenar los materiales de ciencia.", "Tarea 10: Hacer una videollamada con un primo."]
    };

    // --- Funciones ---

    // Carga las tareas de la actividad seleccionada
    function loadActivity() {
        const selectedActivity = activitySelect.value;
        taskListContainer.innerHTML = ""; // Limpia la lista actual

        if (selectedActivity && activities[selectedActivity]) {
            activities[selectedActivity].forEach(taskText => {
                createTaskElement(taskText, taskListContainer); // Añade a la bandeja inicial
            });
        }
    }

    // Solicita y agrega una nueva tarea manualmente
    function addTask() {
        // Podrías añadir un límite si quieres, pero ahora no está el contador limitante.
        const taskText = prompt("Ingrese la nueva tarea:");
        if (taskText && taskText.trim() !== "") {
            createTaskElement(taskText.trim(), taskListContainer); // Añade a la bandeja inicial
        } else if (taskText !== null) { // Si no canceló pero dejó vacío
             alert("El nombre de la tarea no puede estar vacío.");
        }
    }

    // Crea el elemento HTML para una tarea
    function createTaskElement(taskText, targetContainer) {
        const task = document.createElement("div");
        task.classList.add("task");
        task.setAttribute("draggable", "true");
        task.setAttribute("id", `task-${taskIdCounter++}`); // ID único

        // Span para el texto, permite seleccionar solo el texto al editar
        const textSpan = document.createElement('span');
        textSpan.textContent = taskText;

        // Contenedor para los botones
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('task-buttons');

        // Botón Editar
        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️';
        editButton.classList.add('edit-btn');
        editButton.setAttribute('aria-label', 'Editar tarea');
        editButton.onclick = () => editTask(task); // Llama a editTask pasando el elemento tarea

        // Botón Eliminar
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '❌';
        deleteButton.classList.add('delete-btn');
        deleteButton.setAttribute('aria-label', 'Eliminar tarea');
        deleteButton.onclick = () => deleteTask(task); // Llama a deleteTask pasando el elemento tarea

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);

        task.appendChild(textSpan);
        task.appendChild(buttonsDiv);

        // Añadir listeners de drag & drop a la nueva tarea
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);

        targetContainer.appendChild(task);
    }

    // Edita el texto de una tarea
    function editTask(taskElement) {
        const textSpan = taskElement.querySelector('span');
        const currentText = textSpan.textContent;
        const newText = prompt("Editar tarea:", currentText);
        if (newText && newText.trim() !== "") {
            textSpan.textContent = newText.trim();
        } else if (newText !== null) {
            alert("El nombre de la tarea no puede estar vacío.");
        }
    }

    // Elimina una tarea
    function deleteTask(taskElement) {
        if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${taskElement.querySelector('span').textContent}"?`)) {
            taskElement.remove();
        }
    }

    // --- Funciones de Drag and Drop ---

    let draggedItem = null; // Guarda referencia al elemento arrastrado

    function dragStart(event) {
        draggedItem = event.target; // 'this' o event.target es el elemento .task
        event.dataTransfer.setData('text/plain', event.target.id);
        // Añade un estilo visual al elemento mientras se arrastra
        setTimeout(() => event.target.classList.add('dragging'), 0);
    }

    function dragEnd(event) {
        // Limpia el estilo visual al soltar
        event.target.classList.remove('dragging');
        draggedItem = null;
    }

    window.allowDrop = function(event) { // Hacer global para que funcione con ondragover en HTML
        event.preventDefault(); // Necesario para permitir el drop
    }

     // Función global para drop (porque se usa en el HTML con ondrop)
    window.drop = function(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        const taskElement = document.getElementById(taskId);
        let targetDropZone = event.target;

        // Asegurarse de que estamos soltando sobre un .quadrant o .task-list válido
        // Si soltamos sobre un h4 o una task dentro del cuadrante, subimos al contenedor padre
         if (!targetDropZone.classList.contains('quadrant') && !targetDropZone.classList.contains('task-list')) {
            targetDropZone = targetDropZone.closest('.quadrant, .task-list');
        }

        // Solo añadir si es una zona de drop válida
        if (targetDropZone && (targetDropZone.classList.contains('quadrant') || targetDropZone.classList.contains('task-list'))) {
            // Evitar añadir una tarea dentro de otra
            if (taskElement && targetDropZone !== taskElement) { // Asegura que no estamos soltando sobre sí mismo
                 targetDropZone.appendChild(taskElement);
            }
             // Limpiar resaltado de todas las zonas
            dropZones.forEach(zone => zone.classList.remove('over'));
        } else {
             console.warn("Drop target is not a valid quadrant or task list:", event.target);
        }
    }


    // Añadir listeners a las zonas de drop (cuadrantes y bandeja inicial)
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (event) => {
            event.preventDefault(); // Necesario para permitir el drop
             // Añadir clase para feedback visual SOLO a la zona actual
            dropZones.forEach(z => z.classList.remove('over')); // Limpia otras zonas
            zone.classList.add('over');
        });

        zone.addEventListener('dragenter', (event) => {
            event.preventDefault();
             // Podríamos añadir 'over' aquí también si quisiéramos
             // zone.classList.add('over');
        });

        zone.addEventListener('dragleave', (event) => {
            // Si salimos de la zona, quitar el resaltado
            // Cuidado: dragleave se dispara también al entrar en un hijo
             if (!zone.contains(event.relatedTarget)) {
                zone.classList.remove('over');
             }
        });

         // 'drop' se maneja con la función global `drop(event)` definida arriba
         // debido a que usamos ondrop="..." en el HTML.
         // Si quitáramos los ondrop del HTML, añadiríamos aquí:
         // zone.addEventListener('drop', drop);
    });


    // --- Event Listeners Iniciales ---
    activitySelect.addEventListener('change', loadActivity);
    addTaskBtn.addEventListener('click', addTask);

    // Carga inicial (si quieres que alguna actividad esté por defecto)
    // loadActivity(); // Descomentar si quieres cargar la primera actividad al inicio
});