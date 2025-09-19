import { useState } from "react";
import login_img from "../../assets/login_img.png";
import InputBar from "../../components/Inputbar/InputBar";
import { Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordResponse {
  message: string;
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const requestOtpMutation = useMutation({
    mutationFn: async (email: string): Promise<ForgotPasswordResponse> => {
      const response = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send OTP");
      }

      return response.json();
    },
    onSuccess: () => {
      message.success("OTP sent to your email");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const handleRequestOtp = () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    setEmailError("");
    requestOtpMutation.mutate(email);
  };

  return (
    <div className="w-full max-h-screen overflow-y-hidden flex items-center">
      <div className="w-[600px] hidden md:block">
        <img src={login_img} alt="login_image" className="object-contain" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <h3 className="text-lg text-gray-600 mb-4">Enter your email to receive OTP</h3>

          <InputBar
            label="Email"
            placeholder="Please enter your email address..."
            value={email}
            onChange={setEmail}
            type="email"
            inputClass={`bg-gray-100 !border-none ${
              emailError ? "!focus:ring-1 focus:ring-red-400" : ""
            }`}
          />
          <p className="text-left text-xs w-full text-red-600 h-5">
            {emailError || "\u00A0"}
          </p>

          <Button
            type="primary"
            className="w-full"
            loading={requestOtpMutation.isPending}
            onClick={handleRequestOtp}
          >
            Send OTP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
