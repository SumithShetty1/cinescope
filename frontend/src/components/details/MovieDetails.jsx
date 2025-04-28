import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { getSessionToken, getRefreshToken } from "@descope/react-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEdit,
    faTrash,
    faStar,
    faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useSession, useUser } from "@descope/react-sdk";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import "./MovieDetails.css";

const MovieDetails = () => {
    // Get the session token and refresh token
    const sessionToken = getSessionToken();
    const refreshToken = getRefreshToken();

    // Create the headers object
    const headers = {
        Authorization: `Bearer ${sessionToken}`,
        "x-refresh-token": refreshToken,
    };
    const revText = useRef();
    const { movieId } = useParams();
    const { isAuthenticated } = useSession();
    const { user } = useUser();
    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);
    const [editingReviewUid, setEditingReviewUid] = useState(null);
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        variant: "success",
    });

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
        setTimeout(() => {
            setToast({ show: false, message: "", variant });
        }, 3000);
    };

    const getMovieData = async (id) => {
        try {
            const response = await api.get(`/movies/${id}`);
            setMovie(response.data);
            // Sort reviews by lastModifiedAt in descending order (newest first)
            const sortedReviews = [...(response.data.reviewIds || [])].sort(
                (a, b) =>
                    new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt)
            );
            setReviews(sortedReviews);
        } catch (err) {
            console.error("Failed to fetch movie:", err);
            showToast("Failed to load movie details", "danger");
        }
    };

    const checkWatchlistStatus = async () => {
        if (!isAuthenticated || !user?.email) {
            setIsInWatchlist(false); // Ensure watchlist state is false if not authenticated
            return;
        }
        try {
            const response = await api.get(
                `/watchlist/check/${movieId}?email=${user.email}`
            );
            setIsInWatchlist(response.data.isInWatchlist);
        } catch (err) {
            console.error("Failed to check watchlist:", err);
            showToast("Failed to check watchlist status", "danger");
        }
    };

    useEffect(() => {
        getMovieData(movieId);

        if (isAuthenticated && user?.email) {
            checkWatchlistStatus();
        } else {
            setIsInWatchlist(false); // Ensure watchlist state is reset if user logs out
        }
    }, [movieId, isAuthenticated, user?.email]);

    const handleRatingChange = (newRating) => {
        setRating(rating === newRating ? 0 : newRating);
    };

    const toggleWatchlist = async () => {
        if (!isAuthenticated) {
            showToast("Please login to manage your watchlist", "danger");
            return;
        }
        setWatchlistLoading(true);
        try {
            if (isInWatchlist) {
                await api.delete(
                    `/watchlist/remove?email=${user.email}&imdbId=${movieId}`,
                    { headers: headers }
                );
                showToast("Removed from watchlist", "success");
            } else {
                await api.post(
                    `/watchlist/add?email=${user.email}&imdbId=${movieId}`,
                    {},
                    { headers: headers }
                );
                setIsInWatchlist(true);
                showToast("Added to watchlist", "success");
            }
            setIsInWatchlist(!isInWatchlist);
        } catch (err) {
            console.error("Watchlist operation failed:", err);
            showToast("Failed to update watchlist", "danger");
        } finally {
            setWatchlistLoading(false);
        }
    };

    const addReview = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            showToast("Please login to submit a review", "danger");
            return;
        }

        const reviewText = revText.current.value.trim();
        if (!reviewText) {
            showToast("Please provide a review", "danger");
            return;
        }

        setIsLoading(true);

        try {
            const reviewData = {
                reviewBody: reviewText,
                imdbId: movieId,
                rating: rating,
                reviewer: user?.name || "Anonymous",
                email: user?.email || "Anonymous",
                lastModifiedAt: new Date().toISOString(),
            };

            if (editingReviewUid) {
                await api.put(`/reviews/${editingReviewUid}`, reviewData, {
                    headers: headers,
                });
                const updatedMovie = await api.get(`/movies/${movieId}`);
                setMovie(updatedMovie.data);
                const sortedReviews = [
                    ...(updatedMovie.data.reviewIds || []),
                ].sort(
                    (a, b) =>
                        new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt)
                );
                setReviews(sortedReviews);
                setEditingReviewUid(null);
                showToast("Review updated successfully", "success");
            } else {
                await api.post("/reviews", reviewData, {
                    headers: headers,
                });
                const updatedMovie = await api.get(`/movies/${movieId}`);
                setMovie(updatedMovie.data);
                const sortedReviews = [
                    ...(updatedMovie.data.reviewIds || []),
                ].sort(
                    (a, b) =>
                        new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt)
                );
                setReviews(sortedReviews);
                showToast("Review submitted successfully", "success");
            }

            revText.current.value = "";
            setRating(0);
        } catch (err) {
            console.error("Review submission failed:", err);
            showToast(
                err.response?.data?.message || "Failed to submit review",
                "danger"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReview = async (reviewUid) => {
        try {
            await api.delete(`/reviews/${reviewUid}?imdbId=${movieId}`, {
                headers: headers,
            });
            const updatedMovie = await api.get(`/movies/${movieId}`);
            setMovie(updatedMovie.data);
            const sortedReviews = [...(updatedMovie.data.reviewIds || [])].sort(
                (a, b) =>
                    new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt)
            );
            setReviews(sortedReviews);
            showToast("Review deleted successfully", "success");
        } catch (err) {
            console.error("Failed to delete review:", err);
            showToast("Failed to delete review", "danger");
        }
    };

    const startEditing = (review) => {
        revText.current.value = review.body;
        setRating(review.rating);
        setEditingReviewUid(review.reviewUid);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEditing = () => {
        revText.current.value = "";
        setRating(0);
        setEditingReviewUid(null);
    };

    const canEditReview = (reviewEmail) => {
        return isAuthenticated && user?.email === reviewEmail;
    };

    return (
        <div className="review-movie-details-container">
            {/* Toast Container */}
            <ToastContainer
                position="top-end"
                className="p-3 toast-container-custom"
                style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    zIndex: 9999,
                }}
            >
                <Toast
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    delay={3000}
                    autohide
                    bg={toast.variant}
                    className="custom-toast"
                >
                    <Toast.Body className="text-white">
                        {toast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Header */}
            <div className="review-movie-header">
                <h1>{movie?.title}</h1>
                <div className="review-movie-meta">
                    <span>{movie?.releaseDate?.split("-")[0]}</span>
                    <span>•</span>
                    <span>{movie?.duration}</span>
                </div>
            </div>

            <div className="review-movie-content">
                {/* Poster and Watchlist */}
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
                                        className={`star ${
                                            i < Math.round(movie?.rating || 0)
                                                ? "filled"
                                                : ""
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            className={`watchlist-button ${
                                isInWatchlist ? "in-watchlist" : ""
                            }`}
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

                {/* Movie Info */}
                <div className="review-movie-details-column">
                    {movie?.trailerLink && (
                        <div className="review-trailer-section">
                            <ReactPlayer
                                controls
                                playing
                                url={movie.trailerLink}
                                width="100%"
                                height="450px"
                                className="review-react-player-container"
                            />
                        </div>
                    )}

                    <div className="review-genres-section">
                        {movie?.genres?.map((genre, index) => (
                            <span key={index} className="genre-tag">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <div className="description-section">
                        <p>{movie?.description}</p>
                    </div>

                    <div className="crew-section">
                        {movie?.directors?.length > 0 && (
                            <div className="crew-item">
                                <span className="crew-role">Directors</span>
                                <span className="crew-name">
                                    {movie.directors.join(", ")}
                                </span>
                            </div>
                        )}
                        {movie?.writers?.length > 0 && (
                            <div className="crew-item">
                                <span className="crew-role">Writers</span>
                                <span className="crew-name">
                                    {movie.writers.join(", ")}
                                </span>
                            </div>
                        )}
                        {movie?.stars?.length > 0 && (
                            <div className="crew-item">
                                <span className="crew-role">Stars</span>
                                <span className="crew-name">
                                    {movie.stars.join(", ")}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Reviews */}
                    <div className="reviews-section">
                        <h3>Reviews</h3>
                        {isAuthenticated ? (
                            <form onSubmit={addReview} className="review-form">
                                <textarea
                                    ref={revText}
                                    placeholder="Share your thoughts..."
                                    required
                                    maxLength={500}
                                />
                                <div className="review-form-rating">
                                    <span>Your Rating:</span>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                            (star) => (
                                                <FontAwesomeIcon
                                                    key={star}
                                                    icon={faStar}
                                                    className={`star ${
                                                        star <= rating
                                                            ? "filled"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleRatingChange(star)
                                                    }
                                                />
                                            )
                                        )}
                                        <span className="rating-display">
                                            {rating}/10
                                        </span>
                                    </div>
                                </div>
                                <div className="review-form-actions">
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "Processing..."
                                            : editingReviewUid
                                            ? "Update Review"
                                            : "Submit Review"}
                                    </button>
                                    {editingReviewUid && (
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={cancelEditing}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="login-prompt">
                                <p>Please login to leave a review</p>
                                <button
                                    className="login-button"
                                    onClick={() =>
                                        (window.location.href = "/login")
                                    }
                                >
                                    Login
                                </button>
                            </div>
                        )}

                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div
                                        key={review.reviewUid}
                                        className="review-item"
                                    >
                                        <div className="review-header">
                                            <div className="user-info">
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                    className="user-icon"
                                                />
                                                <div>
                                                    <span className="user-name">
                                                        {review.reviewer ||
                                                            "Anonymous"}
                                                    </span>
                                                    <span className="review-date">
                                                        {new Date(
                                                            review.lastModifiedAt
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {canEditReview(review.email) && (
                                                <div className="review-actions">
                                                    <button
                                                        onClick={() =>
                                                            startEditing(review)
                                                        }
                                                        className="edit-button"
                                                        title="Edit review"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteReview(
                                                                review.reviewUid
                                                            )
                                                        }
                                                        className="delete-button"
                                                        title="Delete review"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="review-rating">
                                            {[...Array(10)].map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={faStar}
                                                    className={`star ${
                                                        i <
                                                        Math.round(
                                                            review.rating
                                                        )
                                                            ? "filled"
                                                            : ""
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="review-text">
                                            {review.body}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">
                                    No reviews yet. Be the first to review!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
