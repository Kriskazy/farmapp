/**
 * Plant Detection Utility
 * Analyzes images to determine if they contain plant matter using color analysis
 */

/**
 * Converts RGB color to HSL (Hue, Saturation, Lightness)
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {object} HSL values {h: 0-360, s: 0-100, l: 0-100}
 */
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
      default:
        h = 0;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Checks if a pixel color is in the green/plant range
 * @param {number} r - Red value
 * @param {number} g - Green value
 * @param {number} b - Blue value
 * @returns {boolean} True if color appears to be plant-like
 */
const isPlantColor = (r, g, b) => {
  const hsl = rgbToHsl(r, g, b);

  // Green hue range: 80-160 degrees (allows for yellow-green to blue-green)
  // Minimum saturation: 15% (exclude grays)
  // Lightness range: 20-80% (exclude very dark and very bright)
  const isGreenHue = hsl.h >= 80 && hsl.h <= 160;
  const hasSaturation = hsl.s >= 15;
  const goodLightness = hsl.l >= 20 && hsl.l <= 80;

  return isGreenHue && hasSaturation && goodLightness;
};

/**
 * Analyzes an image to detect if it contains plant matter
 * Uses color analysis to identify vegetation
 * 
 * @param {File} file - Image file to analyze
 * @returns {Promise<boolean>} Resolves to true if plant detected, rejects with error if not
 */
export const detectPlantContent = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        // Set canvas size (downsample large images for faster processing)
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Analysis variables
        let greenPixels = 0;
        let totalPixels = 0;
        const colorHistogram = new Map();

        // Sample pixels (check every 4th pixel for performance)
        for (let i = 0; i < pixels.length; i += 16) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          totalPixels++;

          // Check if pixel is green/plant-like
          if (isPlantColor(r, g, b)) {
            greenPixels++;
          }

          // Build color histogram for diversity check
          const colorKey = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
          colorHistogram.set(colorKey, (colorHistogram.get(colorKey) || 0) + 1);
        }

        // Calculate green percentage
        const greenPercentage = (greenPixels / totalPixels) * 100;

        // Calculate color diversity (number of distinct colors)
        const colorDiversity = colorHistogram.size;

        // Clean up
        URL.revokeObjectURL(img.src);

        // Detection thresholds
        const MIN_GREEN_PERCENTAGE = 12; // At least 12% green pixels
        const MIN_COLOR_DIVERSITY = 10; // At least 10 distinct color groups

        // Validation
        if (greenPercentage < MIN_GREEN_PERCENTAGE) {
          reject(
            new Error(
              `No plant matter detected. This image appears to contain insufficient vegetation (${greenPercentage.toFixed(1)}% green content). Please upload a clear photo of crop leaves or plants.`
            )
          );
          return;
        }

        if (colorDiversity < MIN_COLOR_DIVERSITY) {
          reject(
            new Error(
              'Image appears too uniform. Please upload a photo with clear plant details.'
            )
          );
          return;
        }

        // Plant detected!
        resolve(true);
      } catch (error) {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to analyze image content. Please try again.'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for analysis.'));
    };

    img.src = URL.createObjectURL(file);
  });
};
