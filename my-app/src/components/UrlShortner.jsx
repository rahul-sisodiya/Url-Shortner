import { useState } from "react";
import "./UrlShortner.css";

function UrlShortner() {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    // Local: http://localhost:8080
    // Production: your deployed Spring Boot URL
    const API_URL = import.meta.env.VITE_API_URL;

    const shortLink = shortUrl
        ? `${API_URL}/${shortUrl}`
        : "";

    const shortenUrl = async () => {
        const trimmedUrl = url.trim();

        if (!trimmedUrl) {
            setError("Please enter a URL.");
            return;
        }

        try {
            new URL(trimmedUrl);
        } catch {
            setError("Please enter a valid URL.");
            return;
        }

        setLoading(true);
        setError("");
        setShortUrl("");
        setCopied(false);

        try {
            const response = await fetch(`${API_URL}/shorten`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: trimmedUrl,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    response.status === 400
                        ? "Please provide a valid URL."
                        : "Unable to shorten the URL. Please try again."
                );
            }

            const data = await response.json();

            if (!data.shortUrl) {
                throw new Error("Invalid response from server.");
            }

            setShortUrl(data.shortUrl);
        } catch (error) {
            console.error("Shorten URL error:", error);

            if (error.name === "TypeError") {
                setError(
                    "Unable to connect to the server. Please check your backend."
                );
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const copyUrl = async () => {
        if (!shortLink) return;

        try {
            await navigator.clipboard.writeText(shortLink);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Copy error:", error);
            setError("Unable to copy the URL.");
        }
    };

    const clearUrl = () => {
        setUrl("");
        setShortUrl("");
        setError("");
        setCopied(false);
    };

    return (
        <div className="page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">
                    <div className="logo-mark">S</div>

                    <span>Shortly</span>
                </div>

                <div className="status">
                    <span className="status-dot"></span>
                    URL Shortener
                </div>
            </nav>

            {/* Main */}
            <main className="container">
                {/* Hero */}
                <section className="hero">
                    <div className="badge">
                        <span className="badge-dot"></span>
                        Simple. Fast. Reliable.
                    </div>

                    <h1>
                        Shorten your links.
                        <br />
                        <span>Share them anywhere.</span>
                    </h1>

                    <p className="subtitle">
                        Turn long URLs into short, clean and easy-to-share
                        links in seconds.
                    </p>
                </section>

                {/* Shortener Card */}
                <section className="shortener-card">
                    <div className="card-header">
                        <div>
                            <h2>Shorten a URL</h2>
                            <p>Paste your long URL below.</p>
                        </div>

                        <div className="card-number">01</div>
                    </div>

                    {/* Input */}
                    <div className="input-wrapper">
                        <div className="input-icon">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </div>

                        <input
                            type="url"
                            placeholder="https://example.com/your-long-url"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    shortenUrl();
                                }
                            }}
                            disabled={loading}
                        />

                        {url && (
                            <button
                                className="clear-button"
                                onClick={clearUrl}
                                type="button"
                                aria-label="Clear URL"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Shorten Button */}
                    <button
                        className="shorten-button"
                        onClick={shortenUrl}
                        disabled={loading}
                        type="button"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating link...
                            </>
                        ) : (
                            <>
                                Shorten URL
                                <span className="button-arrow">→</span>
                            </>
                        )}
                    </button>

                    {/* Error */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">!</span>
                            {error}
                        </div>
                    )}

                    {/* Result */}
                    {shortUrl && (
                        <div className="result-container">
                            <div className="result-header">
                                <div className="success-icon">✓</div>

                                <div>
                                    <strong>Your short link is ready</strong>
                                    <span>Copy it and share it anywhere.</span>
                                </div>
                            </div>

                            <div className="result-box">
                                <a
                                    href={shortLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="short-url"
                                >
                                    {shortLink}
                                </a>

                                <button
                                    className={`copy-button ${
                                        copied ? "copied" : ""
                                    }`}
                                    onClick={copyUrl}
                                    type="button"
                                >
                                    {copied ? "✓ Copied" : "Copy"}
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* Features */}
                <section className="features">
                    <div className="feature">
                        <div className="feature-number">01</div>

                        <div>
                            <h3>Fast</h3>
                            <p>Create short links in seconds.</p>
                        </div>
                    </div>

                    <div className="feature">
                        <div className="feature-number">02</div>

                        <div>
                            <h3>Simple</h3>
                            <p>No unnecessary steps or clutter.</p>
                        </div>
                    </div>

                    <div className="feature">
                        <div className="feature-number">03</div>

                        <div>
                            <h3>Shareable</h3>
                            <p>Clean links that are easy to share.</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer>
                <span>© 2026 Shortly</span>
                <span className="footer-separator">/</span>
                <span>Built with React & Spring Boot</span>
            </footer>
        </div>
    );
}

export default UrlShortner;