import { useState } from "react";
import { Button, message, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import login_img from '../../assets/login_img.png';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const resetPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to reset password");
      }

      return response.json();
    },
    onSuccess: () => {
      message.success("Password reset successfully!");
      navigate("/login");
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const handleSubmission = () => {
    if(!password ) {
      setPasswordError("Password field should not be empty")
    }
    if(!checkPassword){ setCheckPasswordError("Confirm Password should not be empty")}
    if(password !== checkPassword){
      setPasswordError("Password doesnt match")
      setCheckPasswordError("Password doesnt match");
    }
    resetPasswordMutation.mutate(password)

  }
  return (
    <div className="flex items-center justify-between max-h-screen overflow-y-hidden">
       <div className="w-[600px] hidden md:block">
        <img src={login_img} alt="login_image" className="object-contain" />
      </div>
      <div className="flex flex-1 items-center  justify-center">
        <div className="flex flex-col w-2/3 items-center text-center">
           <h1 className="text-2xl font-bold">Reset Password</h1>
        <Input.Password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        className="mt-4 w-2/3"
      />
       <Input.Password
        value={checkPassword}
        onChange={(e) => setCheckPassword(e.target.value)}
        placeholder="Enter new password"
        className="mt-4 w-2/3"
      />
      <Button
        type="primary"
        className="mt-4 w-2/3"
        onClick={() => handleSubmission}
        loading={resetPasswordMutation.isPending}
      >
        Reset Password
      </Button>
        </div>
       
      </div>
      
      
    </div>
  );
};

export default ResetPasswordPage;
