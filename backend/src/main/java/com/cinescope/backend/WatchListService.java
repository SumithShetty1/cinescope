package com.cinescope.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class WatchListService {
    @Autowired
    private WatchListRepository watchListRepository;

    public Optional<WatchList> getWatchListByEmail(String email) {
        return watchListRepository.findWatchListByEmail(email);
    }

    public WatchList saveWatchList(WatchList watchList) {
        return watchListRepository.save(watchList);
    }
}
