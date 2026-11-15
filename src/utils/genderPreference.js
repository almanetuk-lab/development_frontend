// Mirrors development_backend/utils/genderPreference.js for UI messaging only.
// The server applies the actual filter.

const INTEREST_LABEL = {
  Man: "men",
  Woman: "women",
  "Non-Binary": "non-binary people",
};

/**
 * Empty-state hint shown when the preferred-gender filter is narrowing results,
 * or null when no filter is active.
 */
export function genderFilterNote(profile) {
  if (!profile || profile.show_only_preferred_gender === false) return null;
  const label = INTEREST_LABEL[profile.interested_in];
  return label
    ? `You're only seeing ${label}, based on your "Interested In" setting. You can change this in Edit Profile.`
    : null;
}
