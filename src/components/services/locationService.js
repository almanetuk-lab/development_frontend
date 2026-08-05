// NOTE: Uncomment this import once you install @supabase/supabase-js: npm install @supabase/supabase-js
// import { supabase } from "./supabaseClient";

/**
 * Request device location permissions and fetch current GPS coordinates
 * @returns {Promise<{ latitude: number, longitude: number }>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location permission denied. Please allow location access in your browser settings."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is currently unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("Request to get your location timed out."));
            break;
          default:
            reject(new Error("An unknown error occurred while retrieving location."));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

/**
 * Update current user's profiles row with their location using Supabase Client
 * NOTE: Uncomment and use this function once @supabase/supabase-js is installed on the frontend.
 */
export const updateUserLocationSupabase = async (userId, latitude, longitude) => {
  console.warn("updateUserLocationSupabase is a template. Install @supabase/supabase-js to enable direct client connection.");
  /*
  try {
    const pointWkt = `POINT(${longitude} ${latitude})`;

    const { data, error } = await supabase
      .from('profiles')
      .update({ location: pointWkt })
      .eq('user_id', userId);

    if (error) throw error;
    console.log("📍 Location successfully updated in Supabase direct client");
    return data;
  } catch (error) {
    console.error("❌ Failed to update location via Supabase:", error.message);
    throw error;
  }
  */
};

/**
 * Call the get_nearby_profiles Postgres function via Supabase RPC
 * NOTE: Uncomment and use this function once @supabase/supabase-js is installed on the frontend.
 */
export const fetchNearbyProfilesSupabase = async (latitude, longitude, radiusInKm = 50) => {
  console.warn("fetchNearbyProfilesSupabase is a template. Install @supabase/supabase-js to enable direct client connection.");
  return [];
  /*
  try {
    const radiusInMeters = radiusInKm * 1000;

    const { data, error } = await supabase
      .rpc('get_nearby_profiles', {
        user_lat: latitude,
        user_lon: longitude,
        radius_in_meters: radiusInMeters
      });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Failed to fetch nearby profiles via Supabase RPC:", error.message);
    throw error;
  }
  */
};
