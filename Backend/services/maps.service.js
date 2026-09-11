const axios = require('axios');
const captainModel = require('../models/captain.model');

// ─────────────────────────────────────────────────────────────
// ⚠️  STUB MODE — Google Maps API calls are disabled.
//     To switch back to real Google Maps:
//       1. Uncomment each "REAL" block
//       2. Comment out (or delete) each "STUB" block
//       3. Ensure GOOGLE_MAPS_API is set in .env
//       4. Restart the backend
// ─────────────────────────────────────────────────────────────

module.exports.getAddressCoordinate = async (address) => {
    // ═══════════════ REAL IMPLEMENTATION (commented) ═══════════════
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    //
    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         const location = response.data.results[0].geometry.location;
    //         return {
    //             ltd: location.lat,
    //             lng: location.lng
    //         };
    //     } else {
    //         throw new Error('Unable to fetch coordinates');
    //     }
    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // }

    // ═══════════════ STUB IMPLEMENTATION (active) ═══════════════
    console.log(`[STUB] getAddressCoordinate("${address}")`);
    return {
        ltd: 22.5726,     // ← change to your actual latitude if needed
        lng: 88.3639      // ← change to your actual longitude if needed
    };
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // ═══════════════ REAL IMPLEMENTATION (commented) ═══════════════
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    //
    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
    //             throw new Error('No routes found');
    //         }
    //         return response.data.rows[0].elements[0];
    //     } else {
    //         throw new Error('Unable to fetch distance and time');
    //     }
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }

    // ═══════════════ STUB IMPLEMENTATION (active) ═══════════════
    console.log(`[STUB] getDistanceTime("${origin}" → "${destination}")`);
    return {
        distance: { text: '12.5 km', value: 12500 },
        duration: { text: '25 mins', value: 1500 }
    };
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    // ═══════════════ REAL IMPLEMENTATION (commented) ═══════════════
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    //
    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         return response.data.predictions.map(prediction => prediction.description).filter(value => value);
    //     } else {
    //         throw new Error('Unable to fetch suggestions');
    //     }
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }

    // ═══════════════ STUB IMPLEMENTATION (active) ═══════════════
    console.log(`[STUB] getAutoCompleteSuggestions("${input}")`);
    return [
        `${input}, Kolkata, West Bengal, India`,
        `${input} Railway Station, Kolkata, WB, India`,
        `${input} Bus Stop, Kolkata, WB, India`,
        `${input} Main Road, Kolkata, WB, India`,
        `${input} Market, Kolkata, WB, India`
    ];
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371]
            }
        }
    });
    return captains;
};