// sessionStorage key for "user closed the complete-your-profile popup this session".
// Set by ProfileCompletionModal, cleared on logout (UseProfileContext) so the popup
// comes back on the next login.
export const PROFILE_POPUP_DISMISSED_KEY = "profileCompletionPopupDismissed";
