import HeroSection from "./HeroSection";
import QuickView from "./QuickView";
import Collections from "./Collections";

const Home = () => {
  return (
    <>
      <>
        <HeroSection />
        <QuickView />
        <div id="collections">
          <Collections />
        </div>
      </>
    </>
  );
};

export default Home;
