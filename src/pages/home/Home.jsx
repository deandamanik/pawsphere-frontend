import Hero from '../../components/home/Hero';
import NearestClinics from '../../components/home/NearestClinics';
import Features from '../../components/home/Features';
import HowItWorks from '../../components/home/HowItWorks';
import Testimonials from '../../components/home/Testimonials';

function Home() {
  return (
      <div className="flex flex-col font-poppins">
        <Hero />
        <NearestClinics />
        <Features /> 
        <HowItWorks />
        <Testimonials />
      </div>
  );
}

export default Home;