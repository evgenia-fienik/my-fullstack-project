import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Join from '@/components/Join/Join';
import PopularStories from '@/components/PopularStories/PopularStories';
import TravellersList from '@/components/TravellersList/TravellersList'
import Footer from '@/components/Footer/Footer';


export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <PopularStories />
      <TravellersList/>
      <Join/>
      <Footer/>
    </main>
  );
}