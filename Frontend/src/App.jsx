import { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Topbar from './Components/Topbar/Topbar';
import AgentsPage from './Components/AgentsPage/AgentsPage';
import Contact from './Components/Contact/Contact';
import FloatingIcons from './Components/FloatingIcons/FloatingIcons';
import PageLoader from './Components/PageLoader/PageLoader'; // Adjust path to where your PageLoader is saved

import About from './Pages/About/About';
import Home from './Pages/Home/Home';
import OurTeam from './Pages/Ourteam/OurTeam';

import PropertyMain from './Pages/PropertyMain/PropertyMain';
import Breadcrumb from './Components/Breadcrumb/Breadcrumb';
import FaqMain from './Pages/FaqMain/FaqMain';
import BlogMain from './Pages/BlogMain/BlogMain';
import BlogDetailsMain from './Pages/BlogDetailsMain/BlogDetailsMain';
import PropertyDetails from './Pages/PropertyDetails/PropertyDetails';
import Enquiry from './Components/Enquiry/Enquiry';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import TermAndCondition from './Pages/TermAndCondition/TermAndCondition';

// How long the loader animation plays (ms)
const LOADER_TIME = 3000;
// Extra time so the loader's fade-out animation can finish (ms)
const LOADER_EXIT_TIME = 700;

// Scrolls the window to the top every time the page (route) changes
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  // stop the browser from restoring the old scroll position on back/forward
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // if the link has a #section, scroll to that section instead
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    // "instant" ignores any CSS `scroll-behavior: smooth`, so it jumps straight to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, hash]);

  return null;
};

// Wrapper component so we can use the useLocation hook inside BrowserRouter
const AppContent = () => {
  // start as true so the loader shows on the very first paint (no flash of page)
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    // must be >= loader duration, otherwise the loader gets removed early
    const timer = setTimeout(() => {
      setLoading(false);
    }, LOADER_TIME + LOADER_EXIT_TIME);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* scroll to top on every page change */}
      <ScrollToTop />

      {/* key restarts the loader animation on every page change */}
      {loading && <PageLoader key={location.pathname} duration={LOADER_TIME} />}

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


        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/terms" element={<TermAndCondition/>} />
      </Routes>

      <Enquiry/>
      <Footer />
      <FloatingIcons />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
       <Topbar/>
      <Navbar/>
      <Routes>
         <Route path="/breadcrumb" element={<Breadcrumb/>} />
         <Route path="/about" element={<About/>} />
         <Route path="/" element={<Home/>} />
        <Route path="/agents" element={<AgentsPage/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/faq" element={<FaqMain/>} /> 
        <Route path="/blog-details" element={<BlogDetailsMain/>} />
        <Route path="/blog" element={<BlogMain/>} />
        <Route path='/our-team' element={<OurTeam/>}/>
        <Route path='/properties' element={<PropertyMain/>}/>
      </Routes>
      <Footer/>
      <FloatingIcons/>/
      <AppContent />
    </BrowserRouter>
  );
};

export default App;