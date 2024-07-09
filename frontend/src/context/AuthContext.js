import React, { createContext, useContext, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
export const AuthContext = createContext();

const initialState = { isAdmin: false, isAuthenticated: false, id: undefined }
try {
  const decoded = jwtDecode(localStorage.getItem('token'));
  initialState.isAdmin = decoded.isAdmin;
  initialState.isAuthenticated = true;
  initialState.id = decoded.id;
} catch (e) {

}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_ID':
      return { ...state, id: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};