
const API_URL = import.meta.env.VITE_API_URL;

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

export const generateSuggestions = async (vendorId, originalFeedback) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ vendorId, originalFeedback })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not generate suggestions");
  }

  return result.data;
};

export const markCopied = async (suggestionId) => {
  const response = await fetch(
    `${API_URL}/reviews/suggestions/${suggestionId}/copied`,
    { method: "PATCH" }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not update copy status");
  }

  return result;
};


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
