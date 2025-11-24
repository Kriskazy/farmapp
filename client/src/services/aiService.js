// Simulated AI Service for Disease Detection
import { detectPlantContent } from '../utils/plantDetection';

const DISEASES = {
  'tomato_blight': {
    name: 'Early Blight (Tomato)',
    confidence: 0.94,
    symptoms: [
      'Dark, concentric rings on older leaves',
      'Yellowing of tissue around spots',
      'Premature leaf drop'
    ],
    treatment: [
      'Apply copper-based fungicides',
      'Improve air circulation',
      'Remove infected plant debris',
      'Practice crop rotation'
    ],
    severity: 'high'
  },
  'corn_rust': {
    name: 'Common Rust (Corn)',
    confidence: 0.98,
    symptoms: [
      'Small, powdery pustules on leaves',
      'Pustules turn black as plant matures',
      'Yellowing of leaf tissue'
    ],
    treatment: [
      'Apply fungicides early',
      'Plant resistant hybrids',
      'Manage nutrient levels'
    ],
    severity: 'medium'
  },
  'potato_scab': {
    name: 'Common Scab (Potato)',
    confidence: 0.89,
    symptoms: [
      'Cork-like lesions on tubers',
      'Pitted or raised spots',
      'Rough texture on skin'
    ],
    treatment: [
      'Maintain soil moisture during tuber initiation',
      'Avoid high soil pH',
      'Use resistant varieties'
    ],
    severity: 'low'
  },
  'healthy': {
    name: 'Healthy Plant',
    confidence: 0.99,
    symptoms: [],
    treatment: [
      'Continue regular care',
      'Monitor for pests',
      'Maintain watering schedule'
    ],
    severity: 'none'
  }
};

const RANDOM_DISEASES = Object.values(DISEASES).filter(d => d.name !== 'Healthy Plant');

export const analyzeImage = async (file) => {
  // Step 1: Validate that the image contains plant matter
  try {
    await detectPlantContent(file);
  } catch (error) {
    // Re-throw plant detection errors with context
    throw error;
  }

  // Step 2: Proceed with disease analysis (simulated)
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      let result;

      // Deterministic results based on filename for demo
      if (fileName.includes('blight')) {
        result = DISEASES['tomato_blight'];
      } else if (fileName.includes('rust')) {
        result = DISEASES['corn_rust'];
      } else if (fileName.includes('scab')) {
        result = DISEASES['potato_scab'];
      } else if (fileName.includes('healthy')) {
        result = DISEASES['healthy'];
      } else {
        // Random result for other files
        const isHealthy = Math.random() > 0.7;
        if (isHealthy) {
          result = DISEASES['healthy'];
        } else {
          result = RANDOM_DISEASES[Math.floor(Math.random() * RANDOM_DISEASES.length)];
        }
      }

      resolve(result);
    }, 2500); // 2.5s simulated delay
  });
};
