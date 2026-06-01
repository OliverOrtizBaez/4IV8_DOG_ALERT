let tipoSeleccionado = null;

const cards      = document.querySelectorAll('.tipo-card');
const btnCont    = document.getElementById('btn-continuar');

// Rutas a cada menú
const rutas = {
  dueno:      '../Dueño_de_Perro/menu_duenoperro.html',
  rescatador: '../Rescatador_Albergue/menu_rescaoalber.html',
};

cards.forEach(function(card) {
  card.addEventListener('click', function() {
    // Quitar selección anterior
    cards.forEach(function(c) { c.classList.remove('seleccionado'); });

    // Seleccionar esta
    card.classList.add('seleccionado');
    tipoSeleccionado = card.dataset.tipo;

    // Habilitar botón
    btnCont.disabled = false;
  });
});

btnCont.addEventListener('click', function() {
  if (!tipoSeleccionado) return;
  window.location.href = rutas[tipoSeleccionado];
});