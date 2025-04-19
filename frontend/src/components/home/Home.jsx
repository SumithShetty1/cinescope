import Hero from '../hero/Hero';
import HighRated from '../highRated/HighRated';
import Genre from '../genre/Genre';
import WatchList from '../watchList/WatchList';
import NewlyAdded from '../newlyAdded/NewlyAdded';

const Home = ({ movies }) => {
  return (
    <>
      <Hero movies={movies} />
      <HighRated movies={movies} />
      <NewlyAdded movies={movies} />
      <WatchList movies={movies} />
      <Genre />
    </>
  )
}

export default Home
