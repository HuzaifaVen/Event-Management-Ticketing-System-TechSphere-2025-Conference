// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './AuthContext';
// import ProtectedRoute from './ProtectedRoute';
// import HomePage from './HomePage';
// import LoginPage from './LoginPage';
// import Dashboard from './Dashboard';
// import Profile from './Profile';
import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp';
import OtpPage from './pages/Otp';
import ForgotPasswordPage from './pages/forgot-password/forgotPasswordPage';
import VerifyOtpPage from './pages/forgot-password/VerifyOtpPage';
import ResetPasswordPage from './pages/forgot-password/ResetPasswordPage';
import RoleSelectionPage from './pages/SignUp/RoleSelectionPage';
import Home from './pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path = "/signup" element={<SignupPage/> } />
          <Route path = "/otp" element={<OtpPage/>} />
          <Route path = "/forgot-password" element={<ForgotPasswordPage/>} />
          <Route path = "verify-otp" element={<VerifyOtpPage/>} />
          <Route path = "/reset-password" element={<ResetPasswordPage/>} />
          <Route path = "/role-select" element={<RoleSelectionPage/>} />

          {/* Protected Routes */}
          {/* <Route element={<ProtectedRoute />}> */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
          {/* </Route> */}
        </Routes>
      {/* // </AuthProvider> */}
    </BrowserRouter>
  );
}

export default App;