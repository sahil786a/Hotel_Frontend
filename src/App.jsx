import { useEffect, useState } from "react";
import { getReviewIdeas, markCopied } from "./api";
import logo from "./assets/image.png";
import "./App.css";

// Put your logo file at: public/logo.png
const LOGO_SRC = logo;

function App() {
  const params = new URLSearchParams(window.location.search);
  const vendorId = params.get("vendorId") || "restaurant_001";

  const [vendor, setVendor] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReviewIdeas(vendorId);

        setVendor(data.vendor);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        setError(err.message || "Unable to load review suggestions.");
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, [vendorId]);

  const handleCopy = async (item) => {
    if (processing) return;

    if (!item?.text || !vendor?.googleReviewUrl) {
      setError("Review suggestion or Google Review URL is missing.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Step 1: Copy selected suggestion
      await navigator.clipboard.writeText(item.text);

      // Step 2: Save copied suggestion in MongoDB
      await markCopied(vendorId, item.text);

      // Step 3: Validate Google Review URL
      const url = new URL(vendor.googleReviewUrl);

      if (!["https:", "http:"].includes(url.protocol)) {
        throw new Error("Invalid Google Review URL.");
      }

      // Step 4: Redirect to Google Reviews
      window.location.assign(url.href);
    } catch (err) {
      setError(err.message || "Unable to copy the review.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="page-shell">
        <div className="tricolor" aria-hidden="true" />
        <div className="loading-screen">
          <img className="loading-logo" src={LOGO_SRC} alt="Logo" />
          <h2>Preparing your experience</h2>
          <p>Finding the right words for your review...</p>

          <div className="loading-progress">
            <span />
          </div>
        </div>
      </main>
    );
  }

  if (error && !vendor) {
    return (
      <main className="page-shell">
        <div className="tricolor" aria-hidden="true" />
        <div className="loading-screen">
          <img className="loading-logo" src={LOGO_SRC} alt="Logo" />
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
      <div className="tricolor" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="/" aria-label="Home">
          <img className="brand-logo" src={LOGO_SRC} alt="Logo" />
        </a>

        <span className="topbar-note">
          <span className="status-dot" />
          Your voice matters
        </span>
      </header>

      <section className="review-container">
        <section className="hero">
          <div className="hero-content">
            <h1>
              Your experience.
              <br />
              Your words.
            </h1>

            <p className="hero-description">
              Start with a suggestion, make it personal, and share what
              genuinely made your visit special.
            </p>

            <div className="restaurant-chip">
              <span className="restaurant-chip-dot" />
              {vendor?.name}
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <span className="arc arc-saffron" />
            <span className="arc arc-white" />
            <span className="arc arc-green" />
          </div>
        </section>

        <section className="suggestions-section">
          <div className="section-heading">
            <div>
              <h2>Choose your words</h2>
              <p>Pick a starting point that reflects your genuine experience.</p>
            </div>

            <div className="suggestion-count">
              <strong>{suggestions.length.toString().padStart(2, "0")}</strong>
              <span>ideas</span>
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
                key={`${index}-${item.text}`}
                disabled={processing}
                onClick={() => handleCopy(item)}
              >
                <div className="suggestion-top">
                  <span className="suggestion-quote" aria-hidden="true">
                    “
                  </span>

                  <span className="click-label">
                    {processing ? "Please wait..." : "Select & copy"}
                  </span>
                </div>

                <p className="suggestion-text">{item.text}</p>

                <div className="card-bottom">
                  <span className="card-copy-icon">↗</span>
                  <span>
                    {processing
                      ? "Processing your selection"
                      : "Copy and open Google Reviews"}
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
          <span className="guidance-icon">✓</span>
          <p>
            Make it yours. Edit the suggestion to reflect what you actually
            experienced before sharing your review.
          </p>
        </section>

        <footer className="page-footer">
          <img className="footer-logo" src={LOGO_SRC} alt="Logo" />
          <span>Thoughtfully powered by AI</span>
        </footer>
      </section>
    </main>
  );
}

export default App;