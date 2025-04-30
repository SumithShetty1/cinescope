import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const ReviewSection = ({
    isAuthenticated,
    reviews,
    revText,
    rating,
    setRating,
    editingReviewUid,
    isLoading,
    addReview,
    cancelEditing,
    canEditReview,
    startEditing,
    deleteReview
}) => {
    return (
        <div className="reviews-section">
            <h3>Reviews</h3>
            
            {isAuthenticated ? (
                <ReviewForm
                    revText={revText}
                    rating={rating}
                    setRating={setRating}
                    editingReviewUid={editingReviewUid}
                    isLoading={isLoading}
                    addReview={addReview}
                    cancelEditing={cancelEditing}
                />
            ) : (
                <div className="login-prompt">
                    <p>Please login to leave a review</p>
                    <button
                        className="login-button"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Login
                    </button>
                </div>
            )}

            <ReviewList
                reviews={reviews}
                canEditReview={canEditReview}
                startEditing={startEditing}
                deleteReview={deleteReview}
            />
        </div>
    );
};

export default ReviewSection;
