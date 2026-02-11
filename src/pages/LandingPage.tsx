import CinematicHero from '../components/home/CinematicHero';
import { ValueProp, FeaturedCategories, TrustSection, BottomCTA } from '../components/home/HomeSections';
import '../styles/landing-page.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <CinematicHero />
            <ValueProp />
            <FeaturedCategories />
            <TrustSection />
            <BottomCTA />
        </div>
    );
};

export default LandingPage;
