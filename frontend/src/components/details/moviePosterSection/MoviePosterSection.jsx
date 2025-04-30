import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./MoviePosterSection.css";

// Displays the movie poster, rating, and a button to add/remove the movie from the watchlist
const MoviePosterSection = ({ movie, isInWatchlist, toggleWatchlist, watchlistLoading }) => {
    return (
        <div className="review-movie-poster-column">
            <img
                src={movie?.poster}
                alt={movie?.title}
                className="review-movie-poster"
            />
            <div className="rating-section">
                <div className="rating">
                    <h4>RATING</h4>
                    <div className="rating-value">
                        <span>{movie?.rating?.toFixed(1)}</span>
                        <span>/10</span>
                    </div>
                    <div className="star-rating">
                        {[...Array(10)].map((_, i) => (
                            <FontAwesomeIcon
                                key={i}
                                icon={faStar}
                                className={`star ${i < Math.round(movie?.rating || 0) ? "filled" : ""}`}
                            />
                        ))}
                    </div>
                </div>
                <button
                    className={`watchlist-button ${isInWatchlist ? "in-watchlist" : ""}`}
                    onClick={toggleWatchlist}
                    disabled={watchlistLoading}
                >
                    <FontAwesomeIcon icon={faBookmark} />
                    <span>
                        {watchlistLoading
                            ? "Processing..."
                            : isInWatchlist
                                ? "In Watchlist"
                                : "Add to Watchlist"}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default MoviePosterSection;
