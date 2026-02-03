import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/header';
import Home from './Components/Home/Home';

// const Home = () => <div className="p-8 text-center text-3xl">Welcome to Mjeshtri 🛠️</div>;
const Marketplace = () => <div className="p-8 text-center text-3xl">Expert Marketplace 👷‍♂️</div>;
const About = () => <div className="p-8 text-center text-3xl">About Us 📖</div>;
const Contact = () => <div className="p-8 text-center text-3xl">Contact Support 📧</div>;

function App() {
  return ( 
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;