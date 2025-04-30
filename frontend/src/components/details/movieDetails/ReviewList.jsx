import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews, canEditReview, startEditing, deleteReview }) => {
    return (
        <div className="reviews-list">
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <ReviewItem
                        key={review.reviewUid}
                        review={review}
                        canEditReview={canEditReview}
                        startEditing={startEditing}
                        deleteReview={deleteReview}
                    />
                ))
            ) : (
                <p className="no-reviews">
                    No reviews yet. Be the first to review!
                </p>
            )}
        </div>
    );
};

export default ReviewList;
