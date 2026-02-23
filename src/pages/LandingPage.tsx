import { useState } from 'react';
import CinematicHero from '../components/home/CinematicHero';
import { ValueProp, FeaturedCategories, TrustSection, BottomCTA } from '../components/home/HomeSections';
import { AuthModals } from '../components/auth/AuthModals';
import '../styles/landing-page.css';

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className="landing-page">
            <CinematicHero />
            <ValueProp />
            <FeaturedCategories />
            <TrustSection />
            <BottomCTA onApplyAccess={() => setIsAuthModalOpen(true)} />
            <AuthModals
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode="signup"
            />
        </div>
    );
};

export default LandingPage;
