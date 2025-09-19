import { useState } from 'react';
import signup_img from '../../assets/signup_img.png'; // You can reuse the login image
import InputBar from '../../components/Inputbar/InputBar';
import { Button, Select } from 'antd';
import { FaGoogle } from "react-icons/fa";
import { validateSignup, type FieldErrors, type SignupRequest } from '../../utils/validator/SignupValidator';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/UserRole';

const { Option } = Select;

interface SignupResponse {
  message: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ATTENDEE);

  const SignUpMutation = useMutation({
    mutationFn: async (SignupData: SignupRequest): Promise<SignupResponse> => {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(SignupData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Signup Failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log(data);
      navigate('/login');
    },
    onError: (error: any) => {
      console.log(error);
      console.error(error.message)

    }
  })
  const handleSignup = () => {
    const errors: FieldErrors = validateSignup({ name, email, password, role })

    setNameError(errors.name || '');
    setEmailError(errors.email || '');
    setPasswordError(errors.password || '');

    if (errors.email || errors.password || errors.name) return;
    console.log({ name, email, password, role })
    SignUpMutation.mutate({ name, email, password, role });
    // console.log({ name, email, password, role });
  };

  return (
    <div className="w-full max-h-screen overflow-y-hidden flex items-center">
      {/* Left image */}
      <div className="w-[600px] hidden md:block">
        <img src={signup_img} alt="signup_image" className="object-contain" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold">TechSphere 2025 Conference</h1>
          <h3 className="text-lg text-gray-600 mb-4">Create Your Account</h3>

          {/* Name input */}
          <InputBar
            label="Name"
            placeholder="Enter your full name..."
            value={name}
            onChange={setName}
            inputClass="bg-gray-100 !border-none"
          />

          {/* Email input */}
          <InputBar
            label="Email"
            placeholder="Enter your email..."
            value={email}
            onChange={setEmail}
            type="email"
            inputClass="bg-gray-100 !border-none"
          />

          {/* Password input */}
          <InputBar
            label="Password"
            placeholder="Enter a password..."
            value={password}
            onChange={setPassword}
            type="password"
            inputClass="bg-gray-100 !border-none"
          />

          {/* Role dropdown */}
          <div className="w-full">
            <label className="block mb-1 font-medium text-gray-700">Role</label>
            <Select
              value={role}
              onChange={(val) => setRole(val as UserRole)}
              className="w-full bg-gray-100"
            >
              <Option value={UserRole.ATTENDEE}>Attendee</Option>
              <Option value={UserRole.ORGANIZER}>Organizer</Option>
            </Select>
          </div>

          {/* Sign Up button */}
          <Button type="primary" className="w-full mt-4" onClick={handleSignup}>
            Sign Up
          </Button>

          {/* Sign up with Google */}
          <Button type="default" className="flex gap-2 items-center w-full mt-2"
          onClick={()=>navigate('/role-select')}
          >
            <FaGoogle />
            <span>Sign Up with Google</span>
          </Button>

          {/* Link to login */}
          <div className="text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
