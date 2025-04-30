import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import "./ReviewItem.css";

// Displays a movie review with user information, review text, rating, and edit/delete options if allowed
const ReviewItem = ({ review, canEditReview, startEditing, deleteReview }) => {
    return (
        <div className="review-item">
            <div className="review-header">
                <div className="user-info">
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    <div>
                        <span className="user-name">
                            {review.reviewer || "Anonymous"}
                        </span>
                        <span className="review-date">
                            {new Date(review.lastModifiedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
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
                            onClick={() => deleteReview(review.reviewUid)}
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
                        className={`star ${i < Math.round(review.rating) ? "filled" : ""}`}
                    />
                ))}
            </div>
            <p className="review-text">{review.body}</p>
        </div>
    );
};

export default ReviewItem;
