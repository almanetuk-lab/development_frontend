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
