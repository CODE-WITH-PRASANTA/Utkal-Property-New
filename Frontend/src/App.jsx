
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
// import Home from './Pages/Home/Home';
import Topbar from './Components/Topbar/Topbar';
import Property from './Components/property/property';
import AgentsPage from './Components/AgentsPage/AgentsPage';
import Contact from './Components/Contact/Contact';
import Faq from './Components/Faq/Faq';
import FloatingIcons from './Components/FloatingIcons/FloatingIcons';

const App = () => {
  return (
    <BrowserRouter>
       <Topbar/>
      <Navbar/>
      
      <Routes>
        {/* <Route path="/" element={<Home/>} /> */}
        <Route path="/properties" element={<Property/>} />
        <Route path="/agents" element={<AgentsPage/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/faq" element={<Faq/>} />
        
      </Routes>

      <Footer/>
      <FloatingIcons/>
    </BrowserRouter>
  );
};

export default App;