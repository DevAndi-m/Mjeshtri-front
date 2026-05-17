import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import Header from './Components/header';
import Home from './pages/HomePage.jsx';
import About from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import Footer from './Components/footer.jsx';
import NoPage from './pages/NoPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import MarketplacePage from './pages/MarketplacePage.jsx';
import ExpertPage from './pages/ExpertPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import PlayersTeamsPage from './pages/PlayersTeamsPage.jsx';

function App() {
  const { user, isAdmin } = useAuth();

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
            <Route path="/players-teams" element={<PlayersTeamsPage />} />
            <Route path="*" element={<NoPage />} />
            <Route path="/Expert/:id" element={<ExpertPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/admin"
              element={
                isAdmin
                  ? <AdminPage />
                  : <Navigate to={user ? "/profile" : "/login"} replace />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;