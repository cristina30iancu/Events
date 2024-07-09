export const setAdmin = (isAdmin) => ({
  type: 'SET_ADMIN',
  payload: isAdmin,
});

export const setAuthenticated = (isAuthenticated) => ({
  type: 'SET_AUTHENTICATED',
  payload: isAuthenticated,
});  