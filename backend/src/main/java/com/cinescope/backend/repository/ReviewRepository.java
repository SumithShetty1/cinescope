package com.cinescope.backend.repository;

import com.cinescope.backend.entity.Review;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Review entity with custom query method.
 */
@Repository
public interface ReviewRepository extends MongoRepository<Review, ObjectId> {
    Optional<Review> findByReviewUid(String reviewUid);
}
