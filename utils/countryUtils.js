// utils/countryUtils.js

// List of restricted countries
const restrictedCountries = new Set([
   "Afganistan","Iran","Syria","Pakistan","Iraq","Libya"
  ]);
  
  /**
   * Check if a country is restricted.
   * @param {string} country - The country to validate.
   * @returns {{allowed: boolean, message: string}} - Validation result.
   */
  function checkCountryRestriction(country) {
    console.log("CheckCountryRestriction called", country);
    if (!country || typeof country !== 'string') {
      throw new Error('Invalid country name provided.');
    }
  
    // Convert the provided country name and the countries in the restricted list to lowercase for case-insensitive comparison
    const countryLower = country.trim().toLowerCase();
  
    // Iterate through the restricted countries and check if the lowercase version of the country is in the set
    for (let restrictedCountry of restrictedCountries) {
      if (restrictedCountry.toLowerCase() === countryLower) {
        return { allowed: false, message: "Registration restricted: country is in the restricted list." };
      }
    }
    return { allowed: true, message: "Registration allowed: country is not restricted." };
  }
  
  module.exports = {
    checkCountryRestriction,
  };
  