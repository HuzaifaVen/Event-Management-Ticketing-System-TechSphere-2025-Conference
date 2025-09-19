// src/pages/RoleSelectionPage.tsx
import { useState } from 'react';
import { Button, Select } from 'antd';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/UserRole';

const { Option } = Select;

const RoleSelectionPage = () => {
  const [role, setRole] = useState<UserRole>(UserRole.ATTENDEE);
  const navigate = useNavigate();

  const handleGoogleSignUp = () => {
    console.log("role: ",role)
    window.location.href = `http://localhost:8080/auth/google?role=${role}`;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-md rounded-md w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Sign Up with Google</h1>
        <p className="text-center text-gray-600">
          Please select your role before continuing
        </p>

        {/* Role selection */}
        <div className="w-full">
          <label className="block mb-1 font-medium text-gray-700">Role</label>
          <Select
            value={role}
            onChange={(val) => setRole(val as UserRole)}
            className="w-full"
          >
            <Option value={UserRole.ATTENDEE}>Attendee</Option>
            <Option value={UserRole.ORGANIZER}>Organizer</Option>
          </Select>
        </div>

        {/* Google Sign Up button */}
        <Button
          type="primary"
          icon={<FaGoogle />}
          className="w-full flex justify-center gap-2 mt-4"
          onClick={handleGoogleSignUp}
        >
          Continue with Google
        </Button>

        <div className="text-center text-sm text-gray-500 mt-2">
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up with Email instead
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
