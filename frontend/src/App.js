import { Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Signup } from './pages/Signup';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import { ToastContainer } from 'react-toastify';
import { Login } from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import AddHall from './pages/AddHall';
import AddRestaurant from './pages/AddRestaurant';
import 'react-toastify/dist/ReactToastify.css';
import RestaurantDetails from './pages/RestaurantDetails';
import RestaurantList from './pages/RestaurantList';
import ServicesPage from './pages/ServicesPage';
import RezervariList from './pages/RezervariList';
import AdminUsersList from './pages/AdminUsersList';
import UserReservations from './pages/UserReservations';
import AllFeedbacks from './pages/AllFeedbacks';

const App = () => {
  const addAdmin = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          name: 'Admin', phone: '0799684883',
          password: '123456', email: 'admin@admin.com', role: 'admin'
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  useEffect(() => {
    addAdmin();
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <ToastContainer/>
        <NavigationBar />
        <Routes>
          {/* HOME */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />

          {/* AUTH */}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Signup />} />

          <Route exact path="/add-restaurant" element={<PrivateAdminRoute />}>
            <Route exact path="/add-restaurant" element={<AddRestaurant />} />
          </Route>

          <Route exact path="/add-hall" element={<PrivateAdminRoute />}>
            <Route exact path="/add-hall" element={<AddHall />} />
          </Route>

          <Route exact path="/services" element={<PrivateAdminRoute />}>
            <Route exact path="/services" element={<ServicesPage />} />
          </Route>
          
          <Route exact path="/restaurant/:id" element={<PrivateRoute />}>
            <Route exact path="/restaurant/:id" element={<RestaurantDetails />} />
          </Route>

          <Route exact path="/restaurants" element={<PrivateRoute />}>
            <Route exact path="/restaurants" element={<RestaurantList />} />
          </Route>
          
          <Route exact path="/admin/users" element={<PrivateAdminRoute />}>
            <Route exact path="/admin/users" element={<AdminUsersList />} />
          </Route>

          <Route exact path="/reservations-admin" element={<PrivateAdminRoute />}>
            <Route exact path="/reservations-admin" element={<RezervariList />} />
          </Route>

          <Route exact path="/all-feedbacks" element={<PrivateAdminRoute />}>
            <Route exact path="/all-feedbacks" element={<AllFeedbacks />} />
          </Route>

          <Route exact path="/reservations-user" element={<PrivateRoute />}>
            <Route exact path="/reservations-user" element={<UserReservations />} />
          </Route>
        
          <Route exact path="/user/:id/reservations" element={<PrivateRoute />}>
            <Route exact path="/user/:id/reservations" element={<UserReservations />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Provider>
  );
};

const PrivateRoute = () => {
  const { state } = useAuth();
  const location = useLocation();
  return state.isAuthenticated ? <Outlet /> :
    <Navigate state={{ from: location }} to="/login" />
};

const PrivateAdminRoute = () => {
  const { state } = useAuth();
  const location = useLocation()

  return state.isAuthenticated ? (
    state.isAdmin ? <Outlet /> : <Navigate to="/unauthorized" />
  ) : <Navigate state={{ from: location }} to="/login" />
};

export default App;