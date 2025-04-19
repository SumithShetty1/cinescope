import Hero from '../hero/Hero';
import HighRated from '../highRated/HighRated';
import Genre from '../genre/Genre';
import WatchList from '../watchList/WatchList';

const Home = ({ movies }) => {
  return (
    <>
      <Hero movies={movies} />
      <HighRated movies={movies} />
      <WatchList movies={movies} />
      <Genre />
    </>
  )
}

export default Home
