/**
 * El recorrido completo de la pagina. Cada parada es una pantalla: un
 * kicker, un titular y una linea de apoyo. Van en el orden en que pasan
 * en la salida real, de la marina al Arco y de regreso.
 */
export const brand = {
  name: 'Finisterra',
  place: 'Cabo San Lucas · Baja California Sur',
  tagline: 'Donde termina el desierto, empieza el mar.',
}

export const nav = [
  { href: '#la-ruta', label: 'La ruta' },
  { href: '#el-arco', label: 'El Arco' },
  { href: '#reservar', label: 'Reservar' },
]

export const stops = [
  {
    id: 'bienvenida',
    kicker: 'Los Cabos · Baja California Sur',
    title: 'Finisterra',
    text: 'Una lancha, dos horas y media, y el punto exacto donde el desierto se rompe en mar.',
  },
  {
    id: 'la-ruta',
    kicker: 'La salida · Marina Cabo San Lucas',
    title: 'Zarpamos antes que el calor',
    text: 'Salimos de la marina a las siete, con la bahía todavía en sombra y el agua sin una sola arruga.',
  },
  {
    id: 'el-arco',
    kicker: 'El Arco · Land’s End',
    title: 'Aquí termina México',
    text: 'Dos rocas y un arco de piedra caliza marcan el punto exacto donde el Golfo de California se encuentra con el Pacífico.',
  },
  {
    id: 'lobos',
    kicker: 'Playa del Amor · Lobos marinos',
    title: 'Un lado en calma, el otro salvaje',
    text: 'Snorkel en agua transparente de un lado del Arco; una colonia de lobos marinos tomando el sol del otro.',
  },
  {
    id: 'regreso',
    kicker: 'La hora dorada',
    title: 'Volvemos con el cielo encendido',
    text: 'La ruta de vuelta cruza la bahía justo cuando el sol se mete detrás de la sierra de La Laguna.',
  },
]

export const trip = {
  kicker: 'Reserva tu salida',
  title: 'Sube a la lancha',
  text: 'Grupos pequeños, máximo diez personas. Chaleco, snorkel y agua incluidos.',
  stats: [
    ['Desde', '$950 MXN / persona'],
    ['Salidas', '7:00 y 15:00 h'],
    ['Duración', '2.5 h'],
  ],
  departures: ['7:00 h — sale con la bahía en sombra', '15:00 h — vuelve con la hora dorada'],
}

/**
 * TODO: confirmar fuente/licencia de public/images.jpg (foto aerea con
 * lanchas en El Arco) antes de publicar. Mientras no se confirme, no hay
 * credito que mostrar — dejar en null, no inventar uno.
 */
export const credit = null
