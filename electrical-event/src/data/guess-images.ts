/**
 * Guess locations: image path and coordinates for the map.
 * Edit this file to add or change locations.
 */
export type GuessImage = {
  url: string;
  lon: number;
  lat: number;
};

export const guessImages: GuessImage[] = [
  { url: '/image_1.jpg', lon: 174.766527, lat: -36.849960 }, // Cosmo (now Meeso)
  { url: '/image_2.jpg', lon: 174.772294, lat: -36.850419 }, // Bus Stop
  { url: '/image_3.jpg', lon: 174.853871, lat: -36.899247 }, // Korean Place
  { url: '/image_4.jpg', lon: 174.770918, lat: -36.852786 }, // OGGB
  { url: '/image_5.jpg', lon: 174.855942, lat: -36.906471 }, // Bridge
  { url: '/image_6.jpg', lon: 174.882699, lat: -36.915875 }, // Dog Walk 1
  { url: '/image_7.jpg', lon: 174.918679, lat: -36.884599 }, // Picnic
  { url: '/image_8.jpg', lon: 174.841247, lat: -36.913549 }, // Whitcoulls
  { url: '/image_9.jpg', lon: 174.789498, lat: -36.896899 }, // Cornwall
  { url: '/image_10.jpg', lon: 174.8858018, lat: -36.920143 }, // Dog Walk 2
  { url: '/image_11.jpg', lon: 174.87609319, lat: -36.99840983 }, // Wiri
  { url: '/image_12.jpg', lon: 174.76848839, lat: -36.85298313 }, // Upstairs Science
  { url: '/image_13.jpg', lon: 174.77041663, lat: -36.85276051 }, // Outside Engineering
  { url: '/image_14.jpg', lon: 174.76716776, lat: -36.84744138 }, // Cocoa Wilds
  { url: '/image_15.jpg', lon: 174.77099667, lat: -36.84903556 }, // Waterloo Quadrant
  { url: '/image_16.jpg', lon: 174.82623384, lat: -36.91245500 }, // Big J's
  { url: '/image_17.jpg', lon: 174.83736660, lat: -36.90968758 }, // Night Market
  { url: '/image_18.jpg', lon: 174.83705745, lat: -36.92468037 }, // Sorella Cafe
  { url: '/image_19.jpg', lon: 174.79100861, lat: -36.88847654 }, // Pikuniku
  { url: '/image_20.jpg', lon: 174.84153684, lat: -36.91337865 }, // Sylvia Carpark
  { url: '/image_21.jpg', lon: 174.8432811, lat: -36.91938182 }, // Clemow Drive Cafe
  { url: '/image_22.jpg', lon: 174.83754401, lat: -36.90893459 }, // Wiri
  { url: '/image_23.jpg', lon: 174.83944196, lat: -36.90817290}, // Wiri
];
