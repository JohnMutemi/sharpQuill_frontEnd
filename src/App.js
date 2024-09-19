import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import Register from './components/Register';
import ClientPortal from './components/ClientPortal';
import WriterPortal from './components/WriterPortal';
import Logout from './components/Logout';
import { UserProvider, useUser } from './components/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/services" element={<Services />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/client-portal"
            element={
              <PrivateRoute>
                <ClientPortal />
              </PrivateRoute>
            }
          />
          <Route
            path="/writer-portal"
            element={
              <PrivateRoute>
                <WriterPortal />
              </PrivateRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const { user } = useUser();
  return user && user.token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useUser();
  return !user || !user.token ? children : <Navigate to="/client-portal" />;
};

export default App;
