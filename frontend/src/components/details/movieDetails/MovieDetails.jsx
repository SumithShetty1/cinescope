import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams } from "react-router-dom";
import { useSession, useUser } from "@descope/react-sdk";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import MovieHeader from "./MovieHeader";
import MoviePosterSection from "./MoviePosterSection";
import MovieInfoSection from "./MovieInfoSection";
import ReviewSection from "./ReviewSection";
import "./styles/MovieDetails.css";

const MovieDetails = () => {
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
            const sortedReviews = [...(response.data.reviewIds || [])].sort(
                (a, b) => new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt)
            );
            setReviews(sortedReviews);
        } catch (err) {
            console.error("Failed to fetch movie:", err);
            showToast("Failed to load movie details", "danger");
        }
    };

    const checkWatchlistStatus = async () => {
        if (!isAuthenticated || !user?.email) {
            setIsInWatchlist(false);
            return;
        }
        try {
            const response = await api.get(`/watchlist/check/${movieId}?email=${user.email}`);
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
            setIsInWatchlist(false);
        }
    }, [movieId, isAuthenticated, user?.email]);

    const toggleWatchlist = async () => {
        if (!isAuthenticated) {
            showToast("Please login to manage your watchlist", "danger");
            return;
        }
        setWatchlistLoading(true);
        try {
            if (isInWatchlist) {
                await api.delete(`/watchlist/remove?email=${user.email}&imdbId=${movieId}`);
                showToast("Removed from watchlist", "success");
            } else {
                await api.post(`/watchlist/add?email=${user.email}&imdbId=${movieId}`);
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
                await api.put(`/reviews/${editingReviewUid}`, reviewData);
                showToast("Review updated successfully", "success");
            } else {
                await api.post("/reviews", reviewData);
                showToast("Review submitted successfully", "success");
            }

            const updatedMovie = await api.get(`/movies/${movieId}`);
            setMovie(updatedMovie.data);
            const sortedReviews = [...(updatedMovie.data.reviewIds || [])].sort(
                (a, b) => new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt)
            );
            setReviews(sortedReviews);
            
            revText.current.value = "";
            setRating(0);
            setEditingReviewUid(null);
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
            await api.delete(`/reviews/${reviewUid}?imdbId=${movieId}`);
            const updatedMovie = await api.get(`/movies/${movieId}`);
            setMovie(updatedMovie.data);
            const sortedReviews = [...(updatedMovie.data.reviewIds || [])].sort(
                (a, b) => new Date(b.lastModifiedAt) - new Date(a.lastModifiedAt)
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

            <MovieHeader movie={movie} />
            
            <div className="review-movie-content">
                <MoviePosterSection 
                    movie={movie} 
                    isInWatchlist={isInWatchlist}
                    toggleWatchlist={toggleWatchlist}
                    watchlistLoading={watchlistLoading}
                />
                
                <div className="review-movie-details-column">
                    <MovieInfoSection movie={movie} />
                    
                    <ReviewSection
                        isAuthenticated={isAuthenticated}
                        movieId={movieId}
                        reviews={reviews}
                        revText={revText}
                        rating={rating}
                        setRating={setRating}
                        editingReviewUid={editingReviewUid}
                        isLoading={isLoading}
                        addReview={addReview}
                        cancelEditing={cancelEditing}
                        canEditReview={canEditReview}
                        startEditing={startEditing}
                        deleteReview={deleteReview}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
