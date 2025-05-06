import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import HighRatedPage from "./components/pages/highRated/HighRatedPage";
import NewlyAddedPage from "./components/pages/newlyAdded/NewlyAddedPage";
import WatchListPage from "./components/pages/watchList/WatchListPage";
import GenrePage from "./components/pages/genre/GenrePage"
import SearchPage from "./components/pages/search/SearchPage";
import Trailer from "./components/trailer/Trailer";
import MovieDetails from "./components/details/MovieDetails";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import ManageMoviesPage from "./components/manageMovies/ManageMoviesPage";
import NotFound from "./components/notFound/NotFound";

// Root component of the application that sets up global layout and routing
function App() {

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/manage"
                        element={
                            <PrivateRoute requiredRole="admin">
                                <ManageMoviesPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/top-rated" element={<HighRatedPage />} />
                    <Route path="/newly-added" element={<NewlyAddedPage />} />
                    <Route path="/watchlist" element={<WatchListPage />} />
                    <Route path="/genre/:genreName" element={<GenrePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/trailer/:ytTrailerId" element={<Trailer />} />
                    <Route path="/details/:movieId" element={<MovieDetails />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
