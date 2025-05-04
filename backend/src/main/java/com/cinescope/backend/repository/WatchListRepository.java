package com.cinescope.backend.repository;

import com.cinescope.backend.entity.WatchList;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for WatchList entity with custom query method.
 */
@Repository
public interface WatchListRepository extends MongoRepository<WatchList, ObjectId> {
    Optional<WatchList> findWatchListByEmail(String email);

    @Query(value = "{ 'email' : ?0 }", fields = "{ 'movies' : { '$slice' : ?1 } }")
    Optional<WatchList> findWatchListByEmailWithLimit(String email, int limit);
}
