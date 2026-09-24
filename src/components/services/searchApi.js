import api from "./api";

/**
 * The single entry point for GET /search.
 *
 * Previously this call existed four times: in userApi.js (used by Browse
 * Members), in chatApi.js and adminApi.js (both dead), and inline in
 * SearchSection. Consolidating on the `api` instance also fixes a real bug —
 * userApi has no refresh interceptor and hard-redirects to /login on any 401,
 * so an expired access token used to eject people from Browse Members instead
 * of silently refreshing.
 *
 * @returns {Promise<{ data, pagination, filters }>}
 */
export const searchProfiles = async (params, { signal } = {}) => {
  const response = await api.get("/search", { params, signal });
  return response.data;
};

export default { searchProfiles };
