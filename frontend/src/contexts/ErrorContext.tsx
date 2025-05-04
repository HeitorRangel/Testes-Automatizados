import React, { createContext, useState, useContext } from 'react';

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export const ErrorProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
      {error && (
        <div style={{ color: 'red', position: 'fixed', top: 0, right: 0 }}>
          {error}
          <button onClick={() => setError(null)}>Fechar</button>
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);