
import { useState, useEffect, useLayoutEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Topbar from './Components/Topbar/Topbar';
import AgentsPage from './Components/AgentsPage/AgentsPage';
import Contact from './Components/Contact/Contact';
import FloatingIcons from './Components/FloatingIcons/FloatingIcons';
import PageLoader from './Components/PageLoader/PageLoader';

import About from './Pages/About/About';
import Home from './Pages/Home/Home';
import OurTeam from './Pages/OurTeam/OurTeam';
import PropertyMain from './Pages/PropertyMain/PropertyMain';
import Breadcrumb from './Components/Breadcrumb/Breadcrumb';
import FaqMain from './Pages/FaqMain/FaqMain';
import BlogMain from './Pages/BlogMain/BlogMain';
import BlogDetailsMain from './Pages/BlogDetailsMain/BlogDetailsMain';
import PropertyDetails from './Pages/PropertyDetails/PropertyDetails';
import Enquiry from './Components/Enquiry/Enquiry';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import TermAndCondition from './Pages/TermAndCondition/TermAndCondition';
import SellAndRentProperty from './Pages/SellAndRentProperty/SellAndRentProperty';

const LOADER_TIME = 3000;
const LOADER_EXIT_TIME = 700;

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));

      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

  }, [pathname, hash]);

  return null;
};

// Main App Content
const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Loader only on initial website load / browser refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, LOADER_TIME + LOADER_EXIT_TIME);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollToTop />

      {/* Loader only once when website opens */}
      {loading && (
        <PageLoader
          duration={LOADER_TIME}
        />
      )}

      <Topbar />
      <Navbar />

      <Routes>
        <Route path="/breadcrumb" element={<Breadcrumb />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FaqMain />} />

        <Route path="/blog-details" element={<BlogDetailsMain />} />
        <Route path="/blog" element={<BlogMain />} />

        <Route path="/our-team" element={<OurTeam />} />

        <Route path="/properties" element={<PropertyMain />} />
        <Route path="/properties-details" element={<PropertyDetails />} />

        <Route path="/sell-property" element={<SellAndRentProperty/>} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermAndCondition />} />
      </Routes>

      <Enquiry />
      <Footer />
      <FloatingIcons />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
