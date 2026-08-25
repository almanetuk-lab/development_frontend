// src/components/services/nsfwFilter.js
// Client-side NSFW filtering using nsfwjs npm package (built-in bundled model)

let modelCache = null;

const initNSFWModel = async () => {
  if (modelCache) return modelCache;

  // Dynamic import to keep it out of the initial bundle (lazy loaded)
  const [tf, nsfwjs] = await Promise.all([
    import("@tensorflow/tfjs"),
    import("nsfwjs"),
  ]);

  console.log("⚡ Initializing TensorFlow.js and NSFWJS...");
  await tf.ready();

  console.log("⚡ Loading bundled NSFWJS model (No external network request)...");
  // load() with no arguments automatically uses the built-in bundled model definitions.
  // This avoids all CORS issues, offline blocks, and 404 CDN errors.
  const model = await nsfwjs.load();
  console.log("✅ NSFWJS Model loaded successfully");
  modelCache = model;
  return model;
};

/**
 * Checks if an image File contains NSFW content (nudity, explicit, highly suggestive).
 * @param {File} imageFile - The file to check.
 * @returns {Promise<{isSafe: boolean, reason?: string, predictions?: any[]}>}
 */
export const checkImageSafety = async (imageFile) => {
  try {
    const model = await initNSFWModel();

    // Build an HTMLImageElement from the File so NSFWJS can classify it
    const imgUrl = URL.createObjectURL(imageFile);
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = imgUrl;
    });

    const predictions = await model.classify(img);
    URL.revokeObjectURL(imgUrl);

    console.log("🔍 NSFW predictions:", predictions);

    // Map predictions to easy lookup
    const scores = {};
    predictions.forEach((p) => {
      scores[p.className] = p.probability;
    });

    const isPorn   = (scores["Porn"]   || 0) > 0.30;
    const isHentai = (scores["Hentai"] || 0) > 0.35;
    const isSexy   = (scores["Sexy"]   || 0) > 0.55;

    if (isPorn || isHentai || isSexy) {
      let reason = "This image contains inappropriate content and cannot be uploaded.";
      if (isPorn)   reason = "🚫 Sexually explicit content detected. This photo cannot be uploaded.";
      if (isHentai) reason = "🚫 Explicit illustrated content detected. This photo cannot be uploaded.";
      if (isSexy)   reason = "⚠️ Highly revealing content detected. Please use an appropriate profile photo.";

      return { isSafe: false, reason, predictions };
    }

    return { isSafe: true, predictions };

  } catch (error) {
    // Fail CLOSED — if model fails, BLOCK the upload rather than silently pass
    console.error("❌ NSFW check error:", error);
    return {
      isSafe: false,
      reason: "⚠️ Photo safety check failed. Please try again or use a different photo.",
    };
  }
};
