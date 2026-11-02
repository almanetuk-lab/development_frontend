// Client-side checks for the admin article forms. These mirror the backend
// (upload.js and blog.controller.js) so problems show up before the request.

export const MAX_COVER_BYTES = 5 * 1024 * 1024;
export const ALLOWED_COVER_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const TITLE_MAX = 200;
const SUBTITLE_MAX = 500;

// Returns an error message, or null when the file is acceptable.
export const validateCoverFile = (file) => {
  if (!file) return null;
  if (!ALLOWED_COVER_TYPES.includes(file.type)) {
    return "Cover image must be a JPG, PNG or WEBP file.";
  }
  if (file.size > MAX_COVER_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `Cover image is ${mb} MB. Maximum size is 5 MB.`;
  }
  return null;
};

// The editor produces HTML, so "<p></p>" must count as empty.
const hasText = (html) =>
  typeof html === "string" &&
  html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;

export const validateArticle = ({ title, subtitle, contentHtml, coverFile }) => {
  if (!title?.trim()) return "Title is required.";
  if (title.trim().length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or fewer.`;
  if (subtitle && subtitle.trim().length > SUBTITLE_MAX) {
    return `Subtitle must be ${SUBTITLE_MAX} characters or fewer.`;
  }
  if (!hasText(contentHtml)) return "Content is required.";
  return validateCoverFile(coverFile);
};

// The backend uses `message` in controllers and `error` in the global multer handler.
export const apiErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
