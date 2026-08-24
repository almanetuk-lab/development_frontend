// src/components/services/nsfwFilter.js
// Lightweight client-side NSFW filtering utility using TensorFlow.js and NSFWJS from CDN

let modelPromise = null;

// Dynamically load scripts from CDN
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
};

// Ensure TensorFlow.js and NSFWJS are loaded and initialize the model
const initNSFWModel = async () => {
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    try {
      console.log("⚡ Loading TensorFlow.js & NSFWJS from CDN...");
      
      // Load TensorFlow.js first
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js");
      
      // Load NSFWJS
      await loadScript("https://cdn.jsdelivr.net/npm/nsfwjs@2.4.2/dist/index.js");

      if (!window.nsfwjs) {
        throw new Error("NSFWJS library failed to initialize on window object");
      }

      console.log("⚡ Initializing NSFWJS MobileNetV2 model...");
      // MobileNetV2 is lightweight (~5MB) and executes quickly in-browser
      const model = await window.nsfwjs.load("mobilenet_v2", { size: 224 });
      console.log("✅ NSFWJS Model initialized successfully");
      return model;
    } catch (error) {
      modelPromise = null; // reset for retries
      console.error("❌ NSFWJS initialization failed:", error);
      throw error;
    }
  })();

  return modelPromise;
};

/**
 * Checks if an image file contains NSFW (nude, explicit, or highly suggestive) content.
 * @param {File} imageFile - The file to check.
 * @returns {Promise<{isSafe: boolean, reason?: string, predictions?: any[]}>}
 */
export const checkImageSafety = async (imageFile) => {
  try {
    const model = await initNSFWModel();

    // Create an HTML Image element to pass to the model
    const imgUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    img.src = imgUrl;

    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image for safety analysis"));
    });

    // Run prediction
    const predictions = await model.classify(img);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imgUrl);

    console.log("🔍 NSFW Detections:", predictions);

    // Map predictions to a simpler key-value object for quick checks
    const scores = {};
    predictions.forEach(p => {
      scores[p.className] = p.probability;
    });

    // Safety Threshold limits:
    // - Porn: > 35% probability is highly likely sexually explicit
    // - Hentai: > 40% probability is explicit illustrations
    // - Sexy: > 60% probability is highly revealing or suggestive undergarments
    const isPorn = (scores["Porn"] || 0) > 0.35;
    const isHentai = (scores["Hentai"] || 0) > 0.40;
    const isSexy = (scores["Sexy"] || 0) > 0.60;

    if (isPorn || isHentai || isSexy) {
      let reason = "This image appears to contain suggestive or explicit content.";
      if (isPorn) reason = "This photo matches content flagged as sexually explicit.";
      if (isHentai) reason = "This image matches content flagged as sexually explicit illustrations.";
      if (isSexy) reason = "This photo matches content flagged as highly revealing or suggestive.";

      return {
        isSafe: false,
        reason,
        predictions
      };
    }

    return {
      isSafe: true,
      predictions
    };
  } catch (error) {
    console.warn("⚠️ NSFW validation failed, bypassing filter to ensure uptime:", error);
    // Return safe if model fails to load, preventing user blockage during network issues
    return {
      isSafe: true,
      error: error.message
    };
  }
};
