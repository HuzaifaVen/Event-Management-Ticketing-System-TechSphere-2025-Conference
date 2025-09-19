import { useState } from 'react';
import login_img from '../../assets/login_img.png';
import InputBar from '../../components/Inputbar/InputBar';
import { Button, message } from 'antd';
import { FaGoogle } from "react-icons/fa";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { validateLogin, type FieldErrors, type LoginRequest } from '../../utils/validator/loginvalidation';



interface LoginResponse {
  message: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();



  // Define a mutation for login
  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginRequest): Promise<LoginResponse> => {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
      if (!response.ok) {
        console.log("response: ",response)
         const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      throw new Error(msg || 'Login failed');
      }
      return data;
    },
    onSuccess: (data) => {
      console.log(data.message);
      sessionStorage.setItem("email", email)
      navigate("/otp")
      message.success(data.message); 
    },
    onError: (error: any) => {
       message.error(error.message || 'Login failed');
    },
  });


  const handleLogin = () => {
    const errors: FieldErrors = validateLogin({ email, password });
    setEmailError(errors.email || '');
    setPasswordError(errors.password || '');

    if (errors.email || errors.password) return;
    loginMutation.mutate({ email, password });
  };


  return (
    <div className="w-full max-h-[100vh] overflow-y-hidden flex items-center">
      {/* Left image */}
      <div className="w-[600px] hidden md:block">
        <img src={login_img} alt="login_image" className="object-contain" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold">TechSphere 2025 Conference</h1>
          <h3 className="text-lg text-gray-600 mb-4">Sign In to TechSphere</h3>

          <>
            <InputBar
              label="Email"
              placeholder="Please enter your email address..."
              value={email}
              onChange={setEmail}
              type="email"
              inputClass={`bg-gray-100 !border-none ${emailError ? '!focus:ring-1 focus:ring-red-400 ' : ''}`}
            />
            <p className="text-left text-xs w-full text-red-600 h-5">
              {emailError || '\u00A0'}
            </p>
          </>

          <>
            <InputBar
              label="Password"
              placeholder="Enter your password..."
              value={password}
              onChange={setPassword}
              type="password"
              inputClass={`bg-gray-100 !border-none ${passwordError ? 'focus:ring-1 focus:ring-red-400 ' : ''}`}
            />
            <p className="text-left text-xs w-full text-red-600 h-5">
              {passwordError || '\u00A0'}
            </p>
          </>

          <div className="self-end w-full text-right mb-2">
            <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          <Button
            type="primary"
            className="w-full mb-2"
            onClick={handleLogin}
          // shows loading state
          >
            Sign In
          </Button>

          <Button type="default" className="flex gap-2 items-center w-full mb-4" onClick={() => {
            window.location.href = 'http://localhost:8080/auth/google';
          }}>
            <FaGoogle />
            <span>Sign In with Google</span>
          </Button>

          <div className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
