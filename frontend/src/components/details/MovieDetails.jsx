import { useEffect, useRef, useState } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { useSession } from '@descope/react-sdk';
import './MovieDetails.css';

const MovieDetails = () => {
    const revText = useRef();
    const { movieId } = useParams();
    const { isAuthenticated, user } = useSession();
    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getMovieData = async (id) => {
        try {
            const response = await api.get(`/api/v1/movies/${id}`);
            setMovie(response.data);
            setReviews(response.data.reviewIds || []);
        } catch (err) {
            console.error("Failed to fetch movie:", err);
            setError('Failed to load movie details');
        }
    };

    useEffect(() => {
        getMovieData(movieId);
    }, [movieId]);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const addReview = async (e) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated) {
            setError('Please login to submit a review');
            return;
        }

        const reviewText = revText.current.value.trim();
        if (!reviewText || rating === 0) {
            setError('Please provide both a review and rating');
            return;
        }

        setIsLoading(true);

        try {
            const reviewData = {
                reviewBody: reviewText,
                imdbId: movieId,
                rating: rating,
                reviewer: user?.name || 'Anonymous',
                email: user?.email || 'Anonymous',
                timestamp: new Date().toISOString()
            };

            if (editingReviewId) {
                const response = await api.put(`/api/v1/reviews/${editingReviewId}`, reviewData);
                setReviews(reviews.map(r =>
                    r._id === editingReviewId ? {
                        ...r,
                        body: response.data.body,
                        rating: response.data.rating
                    } : r
                ));
                setEditingReviewId(null);
            } else {
                const response = await api.post("/api/v1/reviews", reviewData);
                setReviews([{
                    _id: response.data.id,
                    body: response.data.body,
                    reviewer: response.data.reviewer,
                    email: response.data.email,
                    rating: response.data.rating,
                    createdAt: response.data.timestamp
                }, ...reviews]);
            }

            revText.current.value = "";
            setRating(0);
        } catch (err) {
            console.error("Review submission failed:", err);
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await api.delete(`/api/v1/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r._id !== reviewId));
        } catch (err) {
            console.error("Failed to delete review:", err);
            setError('Failed to delete review');
        }
    };

    const startEditing = (review) => {
        revText.current.value = review.body;
        setRating(review.rating);
        setEditingReviewId(review._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        revText.current.value = "";
        setRating(0);
        setEditingReviewId(null);
    };

    const canEditReview = (reviewEmail) => {
        return isAuthenticated && user?.email === reviewEmail;
    };

    return (
        <div className="review-movie-details-container">
            {/* Movie Header Section */}
            <div className="review-movie-header">
                <h1>{movie?.title}</h1>
                <div className="review-movie-meta">
                    <span>{movie?.releaseDate?.split('-')[0]}</span>
                    <span>•</span>
                    <span>{movie?.duration}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="review-movie-content">
                {/* Left Column - Poster and Rating */}
                <div className="review-movie-poster-column">
                    <img src={movie?.poster} alt={movie?.title} className="review-movie-poster" />

                    <div className="rating-section">
                        <div className="rating">
                            <h4>RATING</h4>
                            <div className="rating-value">
                                <span>{movie?.rating?.toFixed(1)}</span>
                                <span>/10</span>
                            </div>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={faStar}
                                        className={`star ${star <= Math.round(movie?.rating || 0) ? 'filled' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details and Reviews */}
                <div className="review-movie-details-column">
                    {/* Trailer Section */}
                    {movie?.trailerLink && (
                        <div className="review-trailer-section">
                            <div className="react-player-container">
                                <ReactPlayer
                                    controls={true}
                                    playing={true}
                                    url={movie.trailerLink}
                                    width='100%'
                                    height='450px'
                                />
                            </div>
                        </div>
                    )}

                    {/* Genres */}
                    <div className="review-genres-section">
                        {movie?.genres?.map((genre, index) => (
                            <span key={index} className="genre-tag">{genre}</span>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="description-section">
                        <p>{movie?.description}</p>
                    </div>

                    {/* Crew Information */}
                    <div className="crew-section">
                        {movie?.directors?.length > 0 && (
                            <div className="crew-item">
                                <span className="crew-role">Directors</span>
                                <span className="crew-name">{movie.directors.join(', ')}</span>
                            </div>
                        )}
                        {movie?.writers?.length > 0 && (
                            <div className="crew-item">
                                <span className="crew-role">Writers</span>
                                <span className="crew-name">{movie.writers.join(', ')}</span>
                            </div>
                        )}
                        {movie?.stars?.length > 0 && (
                            <div className="crew-item">
                                <span className="crew-role">Stars</span>
                                <span className="crew-name">{movie.stars.join(', ')}</span>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h3>Reviews</h3>

                        {isAuthenticated ? (
                            <form onSubmit={addReview} className="review-form">
                                <textarea
                                    ref={revText}
                                    placeholder="Share your thoughts about this movie..."
                                    required
                                    maxLength={500}
                                />
                                <div className="review-form-rating">
                                    <span>Your Rating: </span>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                            <FontAwesomeIcon
                                                key={star}
                                                icon={faStar}
                                                className={`star ${star <= rating ? 'filled' : ''}`}
                                                onClick={() => handleRatingChange(star)}
                                            />
                                        ))}
                                        <span className="rating-display">{rating}/10</span>
                                    </div>
                                </div>
                                <div className="review-form-actions">
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            'Processing...'
                                        ) : editingReviewId ? (
                                            'Update Review'
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </button>
                                    {editingReviewId && (
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
                                    onClick={() => window.location.href = '/login'}
                                >
                                    Login
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && <div className="error-message">{error}</div>}

                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review._id} className="review-item">
                                        <div className="review-header">
                                            <div className="user-info">
                                                <FontAwesomeIcon icon={faUser} className="user-icon" />
                                                <div>
                                                    <span className="user-name">{review.reviewer || 'Anonymous'}</span>
                                                    <span className="review-date">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            {canEditReview(review.email) && (
                                                <div className="review-actions">
                                                    <button
                                                        onClick={() => startEditing(review)}
                                                        className="edit-button"
                                                        title="Edit review"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteReview(review._id)}
                                                        className="delete-button"
                                                        title="Delete review"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="review-rating">
                                            {[...Array(10)].map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={faStar}
                                                    className={`star ${i < Math.round(review.rating) ? 'filled' : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="review-text">{review.body}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
