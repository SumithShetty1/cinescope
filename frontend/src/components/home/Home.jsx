import Hero from '../hero/Hero';
import HighRated from '../highRated/HighRated';
import Genre from '../genre/Genre';
import WatchList from '../watchList/WatchList';
import NewlyAdded from '../newlyAdded/NewlyAdded';
import { useSession } from "@descope/react-sdk";

const Home = () => {
  const { isAuthenticated } = useSession();

  return (
    <>
      <Hero />
      <HighRated />
      <NewlyAdded />
      {isAuthenticated && <WatchList />}
      <Genre />
    </>
  )
}

export default Home
