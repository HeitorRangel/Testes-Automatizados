import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorProvider } from './contexts/ErrorContext';
import Home from './pages/Home';
import Cancelamento from './pages/Cancelamento';

const App: React.FC = () => {
  return (
    <ErrorProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cancelamentos" element={<Cancelamento />} />
        </Routes>
      </Router>
    </ErrorProvider>
  );
};

export default App;