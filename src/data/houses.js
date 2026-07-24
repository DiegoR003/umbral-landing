/**
 * Las tres casas. Cada una esta escrita desde su hora: no describimos
 * amenidades, describimos la luz que hay en el patio a esa hora.
 */
export const houses = [
  {
    id: 'niebla',
    hour: '07:10',
    name: 'Casa Niebla',
    where: 'Sierra Norte, Oaxaca — 2 640 m',
    image: '/parallax/casa-niebla.svg',
    alt: 'Crestas de la Sierra Norte de Oaxaca cubiertas por capas de niebla al amanecer.',
    text: 'A esta hora la niebla todavia esta por debajo de la casa. Se ve caer sobre el valle desde la terraza de piedra volcanica, y dura unos cuarenta minutos. El desayuno se sirve cuando termina.',
    facts: [
      ['Habitaciones', 'Seis'],
      ['Muros', 'Basalto y cal'],
      ['Llegada', '2 h desde Oaxaca'],
      ['Desde', '$6 400 MXN / noche'],
    ],
  },
  {
    id: 'cal',
    hour: '13:20',
    name: 'Casa Cal',
    where: 'Valle de Guadalupe, Baja California',
    image: '/parallax/casa-cal.svg',
    alt: 'Lomas secas del Valle de Guadalupe bajo el sol alto del mediodia.',
    text: 'El patio esta encalado para esta hora exacta. La luz rebota en los muros y baja la temperatura tres grados; por eso la comida es afuera y la siesta adentro. Nadie contesta el telefono entre las dos y las cuatro.',
    facts: [
      ['Habitaciones', 'Nueve'],
      ['Muros', 'Cal viva y adobe'],
      ['Llegada', '1 h 40 desde Tijuana'],
      ['Desde', '$7 900 MXN / noche'],
    ],
  },
  {
    id: 'indigo',
    hour: '19:05',
    name: 'Casa Indigo',
    where: 'Costalegre, Jalisco',
    image: '/parallax/casa-indigo.svg',
    alt: 'Costa de Jalisco durante la hora azul, con el ultimo sol sobre el agua.',
    text: 'Once minutos. Es lo que dura la hora azul aqui antes de que el mar y el cielo tengan el mismo color y deje de haber horizonte. La alberca esta orientada para eso y para nada mas.',
    facts: [
      ['Habitaciones', 'Cuatro'],
      ['Muros', 'Concreto pulido y palma'],
      ['Llegada', '2 h 20 desde Puerto Vallarta'],
      ['Desde', '$9 200 MXN / noche'],
    ],
  },
]
