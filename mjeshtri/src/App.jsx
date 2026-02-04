import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/header';
import Home from './pages/HomePage.jsx';
import About from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import Footer from './Components/footer.jsx';
import NoPage from './pages/NoPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import MarketplacePage from './pages/MarketplacePage.jsx';

// const Home = () => <div className="p-8 text-center text-3xl">Welcome to Mjeshtri 🛠️</div>;

function App() {
  return ( 
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/about" element={<About login={<LoginPage />} register={<SignUpPage />} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;