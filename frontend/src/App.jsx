import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
<<<<<<< HEAD
<<<<<<< HEAD:frontend/src/App.js
=======
<<<<<<<< HEAD:frontend/src/App.jsx
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import HighRatedMovies from './components/highRated/HighRatedMovies';
import GenreMovies from './components/genre/GenreMovies';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import NotFound from './components/notFound/NotFound';
========
>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931
import api from "./api/axiosConfig";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import GenreMovies from "./components/genre/GenreMovies";
import Trailer from "./components/trailer/Trailer";
import Reviews from "./components/reviews/Reviews";
import NotFound from "./components/notFound/NotFound";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
<<<<<<< HEAD
=======
import api from './api/axiosConfig';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import HighRatedMovies from './components/highRated/HighRatedMovies';
import GenreMovies from './components/genre/GenreMovies';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import NotFound from './components/notFound/NotFound';
>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931:frontend/src/App.jsx
=======
>>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931:frontend/src/App.js
>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931

function App() {
    const [movies, setMovies] = useState();
    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);

    const getMovies = async () => {
        try {
            const response = await api.get("/api/v1/movies");

            setMovies(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getMovieData = async (movieId) => {
        try {
            const response = await api.get(`/api/v1/movies/${movieId}`);

            const singleMovie = response.data;

            setMovie(singleMovie);

            setReviews(singleMovie.reviewIds);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMovies();
    }, []);

<<<<<<< HEAD
<<<<<<< HEAD:frontend/src/App.js
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home movies={movies} />}></Route>
                    <Route path="/genre/:genreName" element={<GenreMovies />} />
                    <Route
                        path="/Trailer/:ytTrailerId"
                        element={<Trailer />}
                    ></Route>
                    <Route
                        path="/Reviews/:movieId"
                        element={
                            <Reviews
                                getMovieData={getMovieData}
                                movie={movie}
                                reviews={reviews}
                                setReviews={setReviews}
                            />
                        }
                    ></Route>
                    <Route path="*" element={<NotFound />}></Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </div>
    );
=======
=======
<<<<<<<< HEAD:frontend/src/App.jsx
>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931
      const singleMovie = response.data;

      setMovie(singleMovie);

      setReviews(singleMovie.reviewIds);
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMovies();
  }, [])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home movies={movies} />} />
          <Route path="/top-rated" element={<HighRatedMovies />} />
          <Route path="/genre/:genreName" element={<GenreMovies />} />
          <Route path="/Trailer/:ytTrailerId" element={<Trailer />} />
          <Route path="/Reviews/:movieId" element={<Reviews getMovieData={getMovieData} movie={movie} reviews={reviews} setReviews={setReviews} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
<<<<<<< HEAD
>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931:frontend/src/App.jsx
=======
========
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home movies={movies} />}></Route>
                    <Route path="/genre/:genreName" element={<GenreMovies />} />
                    <Route
                        path="/Trailer/:ytTrailerId"
                        element={<Trailer />}
                    ></Route>
                    <Route
                        path="/Reviews/:movieId"
                        element={
                            <Reviews
                                getMovieData={getMovieData}
                                movie={movie}
                                reviews={reviews}
                                setReviews={setReviews}
                            />
                        }
                    ></Route>
                    <Route path="*" element={<NotFound />}></Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </div>
    );
>>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931:frontend/src/App.js
>>>>>>> 64d1cc3f72e6779cc343d6d21547c53b0d4b9931
}

export default App;
