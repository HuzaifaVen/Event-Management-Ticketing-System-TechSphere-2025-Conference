import { useState } from "react";
import { Button, message, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import login_img from '../../assets/login_img.png';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");


  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await fetch("http://localhost:8080/auth/verify-forgot-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid OTP");
      }

      return response.json();
    },
    onSuccess: () => {
      message.success("OTP verified!");
      navigate(`/reset-password?email=${encodeURIComponent(email!)}`);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  return (
    <div className="flex items-center justify-between max-h-screen overflow-hidden">
       <div className="w-[600px] hidden md:block">
        <img src={login_img} alt="login_image" className="object-contain" />
      </div>
      <div className="flex flex-1 items-center  justify-center">
        <div className="flex flex-col w-2/3 space-y-4 items-center text-center">
      <h1 className="text-2xl font-bold">Verify OTP</h1>
      <Input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="mt-4 !w-2/3"
      />
      <Button
        type="primary"
        className="mt-4 w-32"
        onClick={() => verifyOtpMutation.mutate(otp)}
        loading={verifyOtpMutation.isPending}
      >
        Verify
      </Button>
      </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
