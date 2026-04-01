import React, { createContext, useContext, ReactNode } from 'react';

interface AuthModalContextType {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openSignup: () => void;
  closeSignup: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignupOpen, setIsSignupOpen] = React.useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const closeLogin = () => setIsLoginOpen(false);

  const openSignup = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const closeSignup = () => setIsSignupOpen(false);

  return (
    <AuthModalContext.Provider value={{ isLoginOpen, isSignupOpen, openLogin, closeLogin, openSignup, closeSignup }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
};
