import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container">
      <h1>Bem-vindo ao Sistema de Cancelamento</h1>
      <nav>
        <Link to="/cancelamentos">
          <button>Ir para Cancelamentos</button>
        </Link>
      </nav>
    </div>
  );
};

export default Home;