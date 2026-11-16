
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Topbar from './Components/Topbar/Topbar';
import AgentsPage from './Components/AgentsPage/AgentsPage';
import Contact from './Components/Contact/Contact';
import FloatingIcons from './Components/FloatingIcons/FloatingIcons';

import About from './Pages/About/About';
import Home from './Pages/Home/Home';
import OurTeam from './Pages/Ourteam/OurTeam';

import PropertyMain from './Pages/PropertyMain/PropertyMain';
import Breadcrumb from './Components/Breadcrumb/Breadcrumb';
import FaqMain from './Pages/FaqMain/FaqMain';
import BlogMain from './Pages/BlogMain/BlogMain';
import BlogDetailsMain from './Pages/BlogDetailsMain/BlogDetailsMain';

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
    </BrowserRouter>
  );
};

export default App;