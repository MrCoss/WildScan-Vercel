import { useState } from 'react';
import { motion } from 'framer-motion';

// Animal Info Interface
interface AnimalInfo {
  common_name: string;
  scientific_name: string;
  class: string;
  subclass?: string;
  habitat: string;
  diet?: string;
  lifespan?: string;
  facts?: string[];
  image_url?: string;
}

// Prediction Interface
interface Prediction {
  label: string;
  confidence: number;
}

// PredictionResponse with optional info for top prediction
interface PredictionResponse {
  top_prediction: Prediction & { info?: AnimalInfo };
  top_5: Prediction[];
  heatmap_data: string | null;
}

// Props for ResultsPanel
interface Props {
  result: PredictionResponse;
  originalImage: string;
}

// Animal info data for 15 classes
const ANIMAL_INFO: Record<string, AnimalInfo> = {
  buffalo: {
    common_name: "Buffalo",
    scientific_name: "Bubalus bubalis",
    class: "Mammalia",
    subclass: "Bovinae",
    habitat: "Grasslands, forests, wetlands",
    diet: "Herbivore",
    lifespan: "18-25 years",
    facts: ["Excellent swimmers", "Highly social animals"],
    image_url: "https://example.com/buffalo.jpg",
  },
  cat: {
    common_name: "Cat",
    scientific_name: "Felis catus",
    class: "Mammalia",
    habitat: "Domestic environments, urban areas",
    diet: "Carnivore",
    lifespan: "12-18 years",
    facts: ["Excellent night vision", "Communicate with body language and vocalizations"],
    image_url: "https://example.com/cat.jpg",
  },
  cow: {
    common_name: "Cow",
    scientific_name: "Bos taurus",
    class: "Mammalia",
    subclass: "Bovinae",
    habitat: "Grasslands, farms",
    diet: "Herbivore",
    lifespan: "18-22 years",
    facts: ["Domesticated for milk and meat", "Social herd animals"],
    image_url: "https://example.com/cow.jpg",
  },
  deer: {
    common_name: "Deer",
    scientific_name: "Cervidae",
    class: "Mammalia",
    subclass: "Cervinae",
    habitat: "Forests, grasslands",
    diet: "Herbivore",
    lifespan: "10-20 years",
    facts: ["Have antlers that regrow annually", "Excellent runners"],
    image_url: "https://example.com/deer.jpg",
  },
  dog: {
    common_name: "Dog",
    scientific_name: "Canis lupus familiaris",
    class: "Mammalia",
    habitat: "Domestic environments",
    diet: "Omnivore",
    lifespan: "10-15 years",
    facts: ["Highly loyal and trainable", "Variety of breeds with different abilities"],
    image_url: "https://example.com/dog.jpg",
  },
  elephant: {
    common_name: "Elephant",
    scientific_name: "Elephas maximus / Loxodonta africana",
    class: "Mammalia",
    subclass: "Proboscidea",
    habitat: "Savannahs, forests",
    diet: "Herbivore",
    lifespan: "60-70 years",
    facts: ["Largest land animal", "Highly intelligent and social"],
    image_url: "https://example.com/elephant.jpg",
  },
  flamingo: {
    common_name: "Flamingo",
    scientific_name: "Phoenicopterus",
    class: "Aves",
    subclass: "Phoenicopteridae",
    habitat: "Lakes, lagoons, wetlands",
    diet: "Omnivore (algae, crustaceans)",
    lifespan: "20-30 years",
    facts: ["Pink color comes from diet", "Stand on one leg often"],
    image_url: "https://example.com/flamingo.jpg",
  },
  giraffe: {
    common_name: "Giraffe",
    scientific_name: "Giraffa camelopardalis",
    class: "Mammalia",
    subclass: "Giraffidae",
    habitat: "Savannahs, open woodlands",
    diet: "Herbivore (leaves, shoots)",
    lifespan: "25-28 years",
    facts: ["Tallest land animal", "Long neck helps reach high foliage"],
    image_url: "https://example.com/giraffe.jpg",
  },
  jaguar: {
    common_name: "Jaguar",
    scientific_name: "Panthera onca",
    class: "Mammalia",
    subclass: "Felidae",
    habitat: "Rainforests, swamps",
    diet: "Carnivore",
    lifespan: "12-15 years",
    facts: ["Excellent swimmer", "Powerful bite relative to body size"],
    image_url: "https://example.com/jaguar.jpg",
  },
  kangaroo: {
    common_name: "Kangaroo",
    scientific_name: "Macropus",
    class: "Mammalia",
    subclass: "Macropodidae",
    habitat: "Australian grasslands, forests",
    diet: "Herbivore",
    lifespan: "6-8 years",
    facts: ["Hop using strong hind legs", "Carry young in pouches"],
    image_url: "https://example.com/kangaroo.jpg",
  },
  lion: {
    common_name: "Lion",
    scientific_name: "Panthera leo",
    class: "Mammalia",
    subclass: "Felidae",
    habitat: "Savannahs, grasslands",
    diet: "Carnivore",
    lifespan: "10-14 years",
    facts: ["Known as king of the jungle", "Live in social groups called prides"],
    image_url: "https://example.com/lion.jpg",
  },
  penguin: {
    common_name: "Penguin",
    scientific_name: "Spheniscidae",
    class: "Aves",
    subclass: "Sphenisciformes",
    habitat: "Antarctic, coastal regions",
    diet: "Carnivore (fish, krill)",
    lifespan: "15-20 years",
    facts: ["Flightless birds", "Excellent swimmers"],
    image_url: "https://example.com/penguin.jpg",
  },
  sheep: {
    common_name: "Sheep",
    scientific_name: "Ovis aries",
    class: "Mammalia",
    subclass: "Caprinae",
    habitat: "Grasslands, farms",
    diet: "Herbivore",
    lifespan: "10-12 years",
    facts: ["Domesticated for wool and meat", "Gregarious herd animals"],
    image_url: "https://example.com/sheep.jpg",
  },
  tiger: {
    common_name: "Tiger",
    scientific_name: "Panthera tigris",
    class: "Mammalia",
    subclass: "Felidae",
    habitat: "Rainforests, grasslands",
    diet: "Carnivore",
    lifespan: "10-15 years",
    facts: ["Strong swimmers", "Largest cat species"],
    image_url: "https://example.com/tiger.jpg",
  },
  zebra: {
    common_name: "Zebra",
    scientific_name: "Equus quagga",
    class: "Mammalia",
    subclass: "Equidae",
    habitat: "Savannahs, grasslands",
    diet: "Herbivore",
    lifespan: "20-25 years",
    facts: ["Distinct black and white stripes", "Live in herds"],
    image_url: "https://example.com/zebra.jpg",
  },
};

const ResultsPanel = ({ result, originalImage }: Props) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { top_prediction, top_5 } = result;

  const info = ANIMAL_INFO[top_prediction.label];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto"
    >
      {/* Image + Heatmap */}
      <div className="relative mb-6 hover:scale-105 transition-transform duration-300">
        <img
          src={originalImage}
          alt="Scanned animal"
          className="w-full h-auto rounded-xl object-contain max-h-96 border border-gray-200 dark:border-gray-700"
        />
        {result.heatmap_data && (
          <motion.img
            key={showHeatmap ? 'heatmap' : 'no-heatmap'}
            src={result.heatmap_data}
            alt="Heatmap"
            className="absolute top-0 left-0 w-full h-full rounded-xl object-contain mix-blend-multiply pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: showHeatmap ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Top Prediction */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold capitalize text-gradient bg-clip-text text-transparent from-green-400 via-green-500 to-green-600 dark:from-green-300 dark:via-green-400 dark:to-green-500">
          {top_prediction.label.replace(/_/g, ' ')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
          Confidence: {(top_prediction.confidence * 100).toFixed(2)}%
        </p>
      </div>

      {/* Animal Info */}
      {info && (
        <div className="mt-6 bg-green-50 dark:bg-gray-800 p-4 rounded-xl shadow-inner flex flex-col md:flex-row gap-4">
          {info.image_url && (
            <img
              src={info.image_url}
              alt={info.common_name}
              className="w-full md:w-48 h-auto rounded-lg object-cover border border-gray-300 dark:border-gray-700"
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              {info.common_name} <span className="italic text-sm">({info.scientific_name})</span>
            </h3>
            <p><strong>Class:</strong> {info.class}</p>
            {info.subclass && <p><strong>Subclass:</strong> {info.subclass}</p>}
            <p><strong>Habitat:</strong> {info.habitat}</p>
            {info.diet && <p><strong>Diet:</strong> {info.diet}</p>}
            {info.lifespan && <p><strong>Lifespan:</strong> {info.lifespan}</p>}
            {info.facts && info.facts.length > 0 && (
              <div className="mt-2">
                <strong>Fun Facts:</strong>
                <ul className="list-disc list-inside text-sm mt-1">
                  {info.facts.map((fact, idx) => <li key={idx}>{fact}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Heatmap Toggle */}
      {result.heatmap_data && (
        <div className="flex items-center justify-center my-6">
          <label htmlFor="heatmap-toggle" className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Show Heatmap
          </label>
          <input
            type="checkbox"
            id="heatmap-toggle"
            className="sr-only peer"
            checked={showHeatmap}
            onChange={() => setShowHeatmap(!showHeatmap)}
          />
          <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative cursor-pointer peer-checked:bg-green-500 transition-colors">
            <span className="absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-6 transition-transform"></span>
          </div>
        </div>
      )}

      {/* Top 5 Predictions */}
      <div>
        <h3 className="font-semibold mb-3 text-left text-lg">Top Predictions</h3>
        {top_5.map((pred: Prediction) => (
          <div key={pred.label} className="mb-3">
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span className="capitalize">{pred.label.replace(/_/g, ' ')}</span>
              <span>{(pred.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="rounded-full h-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 dark:from-green-300 dark:via-green-400 dark:to-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${pred.confidence * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultsPanel;
