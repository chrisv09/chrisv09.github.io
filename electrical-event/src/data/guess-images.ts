/**
 * Guess locations: image path and coordinates for the map.
 * Edit this file to add or change locations.
 */
export type GuessImage = {
  url: string;
  lon: number;
  lat: number;
  question?: string;
  answer?: string;
};

export const guessImages: GuessImage[] = [
  { url: '/image_1.jpg', lon: 174.766527, lat: -36.849960, 
    question: "What year was this photo taken?", answer: "2024"}, // Cosmo (now Meeso)
  { url: '/image_2.jpg', lon: 174.772294, lat: -36.850419 }, // Bus Stop
  { url: '/image_3.jpg', lon: 174.853871, lat: -36.899247, 
    question: "What building is this?", answer: 'OGGB'
  }, // Korean Place
  { url: '/image_4.jpg', lon: 174.770918, lat: -36.852786 }, // OGGB
  { url: '/image_5.jpg', lon: 174.855942, lat: -36.906471, // Bridge
    question: "What suburb is this photo in?",
    answer: "Panmure"},
  { url: '/image_6.jpg', lon: 174.882699, lat: -36.915875 }, // Dog Walk 1
  { url: '/image_7.jpg', lon: 174.918679, lat: -36.884599,  // Picnic
  question: "What's the name of this park? (Without the 'park' part)",
    answer: "Macleans"},
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
  { url: '/image_18.jpg', lon: 174.83705745, lat: -36.92468037, 
    question: "What's the name of this cafe? (without the 'cafe') ", answer: 'Sorella' },
  { url: '/image_19.jpg', lon: 174.79100861, lat: -36.88847654 ,
    question: "What's the name of this cafe? (without the 'cafe') ", answer: 'Pikuniku'
  }, // Pikuniku
  { url: '/image_20.jpg', lon: 174.84153684, lat: -36.91337865 }, // Sylvia Carpark
  { url: '/image_21.jpg', lon: 174.8432811, lat: -36.91938182, 
    question: "What's the name of this cafe? (without the 'cafe') (Hint: There is a number in the name)", answer: 'Cloud 777' }, // Clemow Drive Cafe
  { url: '/image_22.jpg', lon: 174.83754401, lat: -36.90893459, 
    question: "What's the name of this cafe? (without the 'cafe') (Hint: Two words excl. 'cafe')", answer: 'New Classic' 
  }, // Mt Wellington Shopping Centre Cafe
  { url: '/image_23.jpg', lon: 174.83944196, lat: -36.90817290}, // Sushi Place
  { url: '/image_24.jpg', lon: 174.76630774, lat: -36.8432752,
    question: "What mall were we in?", answer: "Commercial Bay"
  }, // Camera
  { url: '/image_25.jpg', lon: 174.85243004, lat: -36.8990824}, // Sri Lankan Place
  { url: '/image_26.jpg', lon: 174.85174256, lat: -36.8987789,
    question: "What's the flavour of the pie?", answer: "pumpkin"
  },
  { url: '/image_27.jpg', lon: 174.76443832, lat: -36.8497639,
    question: "What's the name of this exercise?", answer: "calf raises"
  }, // CityFitness
  { url: '/image_28.jpg', lon: 174.84141636, lat: -36.9159612, question: "What's the name of this cafe? (without the 'cafe') ", answer: 'Filly' }, //
  { url: '/image_29.jpg', lon: 174.84152682, lat: -36.9162365}, //
  { url: '/image_30.jpg', lon: 174.84084897, lat: -36.9149028}, //
  { url: '/image_31.jpg', lon: 174.84206512, lat: -36.9158862,
    question: "How much was that Monster drink? (answer an integer only, e.g. $3 is '3')", answer: "0"
  },
  { url: '/image_32.jpg', lon: 174.80613540, lat: -36.8972325}, // Bus Stop 2
  { url: '/image_33.jpg', lon: 174.77193080, lat: -36.8515984,
    question: "What year was this taken?", answer: "2024"}, // ECU 1
  { url: '/image_34.jpg', lon: 174.77193080, lat: -36.8515984,
    question: "What year was this taken?", answer: "2024"}, // ECU 2
  { url: '/image_35.png', lon: 174.76661007, lat: -36.8560662,
      question: "What's the acronym for the building I am in?", answer: "ABI"}, // ABI
  { url: '/image_36.png', lon: 174.76804124, lat: -36.8531343} // CS Study Lab
];
