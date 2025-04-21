package com.cinescope.backend;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WatchListRepository extends MongoRepository<WatchList, ObjectId> {
    Optional<WatchList> findWatchListByEmail(String email);
}
