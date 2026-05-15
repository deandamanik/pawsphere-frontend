import Hero from '../../components/home/Hero';
import Stats from '../../components/home/Stats';
import Features from '../../components/home/Features';
import HowItWorks from '../../components/home/HowItWorks';
import Testimonials from '../../components/home/Testimonials';

const Home = () => {
  return (
    <div className="flex flex-col font-poppins">
      <Hero />
      <Stats />
      <Features /> 
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default Home;