
import { useEffect, useState } from "react";
import { getReviewIdeas, markCopied } from "./api";
import "./App.css";

function App() {
  const params = new URLSearchParams(window.location.search);
  const vendorId = params.get("vendorId") || "restaurant_001";

  const [vendor, setVendor] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const data = await getReviewIdeas(vendorId);
        setVendor(data.vendor);
        setSuggestions(data.suggestions);
      } catch (err) {
        setError(err.message || "Unable to load review suggestions.");
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, [vendorId]);

  const handleCopy = async (item) => {
    if (processingId) return;

    setProcessingId(item.suggestionId);
    setError("");

    try {
      await navigator.clipboard.writeText(item.text);
      await markCopied(item.suggestionId);

      const url = new URL(vendor.googleReviewUrl);

      if (!["https:", "http:"].includes(url.protocol)) {
        throw new Error("Invalid Google Review URL.");
      }

      window.location.assign(url.href);
    } catch (err) {
      setError(err.message || "Unable to copy the review.");
      setProcessingId("");
    }
  };

  
if (loading) {
  return (
    <main className="page-shell">
      <div className="loading-screen">
        <div className="loader-scene">
          <div className="loader-orbit">
            <span className="orbit-dot" />
          </div>

          <div className="loader-plate">
            <div className="plate-inner">
              <span className="plate-sparkle">✦</span>
              <span className="plate-letter">R</span>
            </div>
          </div>

          <span className="loader-star star-one">✦</span>
          <span className="loader-star star-two">✧</span>
          <span className="loader-star star-three">✦</span>
        </div>

        <span className="loading-eyebrow">A LITTLE MOMENT</span>
        <h2>Preparing your experience</h2>
        <p>Finding the right words for your review...</p>

        <div className="loading-progress">
          <span />
        </div>

        <span className="loading-caption">
          MADE WITH CARE
        </span>
      </div>
    </main>
  );
}


  if (error && !vendor) {
    return (
      <main className="page-shell">
        <div className="loading-screen error-screen">
          <div className="loading-logo">R</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Review home">
          <span className="brand-mark">R</span>
          <span className="brand-name">REVIEW MOMENT</span>
        </a>

        <span className="topbar-note">
          <span className="status-dot" />
          YOUR VOICE MATTERS
        </span>
      </header>

      <section className="review-container">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-eyebrow">
              A MOMENT WORTH SHARING
            </span>

            <h1>
              Your experience.
              <br />
              <span>Your words.</span>
            </h1>

            <p className="hero-description">
              Start with a suggestion, make it personal,
              and share what genuinely made your visit special.
            </p>

            <div className="restaurant-chip">
              <span className="restaurant-chip-icon">✦</span>
              {vendor?.name}
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-circle art-circle-one" />
            <div className="art-circle art-circle-two" />
            <span className="art-star">✳</span>
            <span className="art-leaf">❋</span>
            <span className="art-small-star">✦</span>
          </div>

          <span className="hero-bottom-label">
            GOOD FOOD. GOOD MOMENTS. GOOD WORDS.
          </span>
        </section>

        <section className="suggestions-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">MAKE IT YOURS</span>
              <h2>Choose your words</h2>
              <p>
                Pick a starting point that reflects your genuine experience.
              </p>
            </div>

            <div className="suggestion-count">
              <strong>{suggestions.length.toString().padStart(2, "0")}</strong>
              <span>IDEAS</span>
            </div>
          </div>

          {error && (
            <div className="message error-message" role="alert">
              <span>!</span>
              {error}
            </div>
          )}

          <div className="suggestion-list">
            {suggestions.map((item, index) => (
              <button
                type="button"
                className="suggestion-card"
                key={item.suggestionId}
                disabled={Boolean(processingId)}
                onClick={() => handleCopy(item)}
              >
                <div className="suggestion-top">
                  <span className="suggestion-number">
                    0{index + 1}
                  </span>

                  <span className="click-label">
                    {processingId === item.suggestionId
                      ? "PLEASE WAIT..."
                      : "SELECT & COPY ↗"}
                  </span>
                </div>

                <p className="suggestion-text">{item.text}</p>

                <div className="card-bottom">
                  <span className="card-copy-icon">↗</span>
                  <span>
                    {processingId === item.suggestionId
                      ? "Processing your selection"
                      : "Use this suggestion"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {suggestions.length === 0 && !error && (
            <div className="empty-state">
              <span>✦</span>
              <h3>No suggestions available</h3>
              <p>Please try again in a moment.</p>
            </div>
          )}
        </section>

        <section className="guidance-note">
          <span className="guidance-icon">✳</span>
          <p>
            Make it yours. Edit the suggestion to reflect what you
            actually experienced before sharing your review.
          </p>
        </section>

        <footer className="page-footer">
          <span className="footer-brand">REVIEW MOMENT</span>
          <span>Thoughtfully powered by AI</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
