import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./ReviewForm.css";

// A form to submit or edit movie reviews with a textarea for review text and a star rating system
const ReviewForm = ({
    revText,
    rating,
    setRating,
    editingReviewUid,
    isLoading,
    addReview,
    cancelEditing
}) => {
    const handleRatingChange = (newRating) => {
        setRating(rating === newRating ? 0 : newRating);
    };

    return (
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            className={`star ${star <= rating ? "filled" : ""}`}
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
    );
};

export default ReviewForm;
