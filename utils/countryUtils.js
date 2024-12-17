const restrictedCountries = new Set([
   "Afghanistan","Iran","Syria","Pakistan","Iraq","Libya"
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
  
    const countryLower = country.trim().toLowerCase();
  
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
  