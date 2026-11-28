
const API_URL = "https://hotel-review-backend.vercel.app/api";
// const API_URL = "http://localhost:5000/api";

// Get restaurant details
export const getVendor = async (vendorId) => {
  const response = await fetch(
    `${API_URL}/vendors/${encodeURIComponent(vendorId)}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Restaurant not found");
  }

  return result.data;
};

// Generate suggestions from actual customer feedback
export const generateSuggestions = async (vendorId, originalFeedback) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      vendorId,
      originalFeedback
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not generate suggestions");
  }

  return result.data;
};

// Save only the suggestion selected and copied by the customer
export const markCopied = async (vendorId, suggestionText) => {
  const response = await fetch(
    `${API_URL}/reviews/suggestions/copied`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vendorId,
        suggestionText
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not save copied suggestion");
  }

  return result;
};

// Get 5 restaurant-specific review suggestions
export const getReviewIdeas = async (vendorId) => {
  const response = await fetch(
    `${API_URL}/reviews/ideas/${encodeURIComponent(vendorId)}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not load review ideas");
  }

  return result.data;
};
