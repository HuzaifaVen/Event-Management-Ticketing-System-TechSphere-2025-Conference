import { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import login_img from '../../assets/login_img.png';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

const OtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [email, setEmail] = useState<string | null>(null);
  const [resendButtonDisabled, setResendButtonDisabled] = useState(false);
  const location = useLocation();


useEffect(() => {
  const params = new URLSearchParams(location.search);
  const emailParam = params.get('email') || sessionStorage.getItem('email');

  if (emailParam) {
    setEmail(emailParam);
    sessionStorage.setItem('email', emailParam); 
  }
}, [location.search]);

  useEffect(() => {
    let interval: any;
    if (resendButtonDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendButtonDisabled(false);
      setTimer(60); // reset timer
    }
    return () => clearInterval(interval);
  }, [resendButtonDisabled, timer]);



  const otpMutation = useMutation({
    mutationFn: async (otp: string) : Promise<any> => {
      const response = await fetch(`http://localhost:8080/auth/verify-login-otp`,{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({email,otp})
      });
      if(!response.ok){
        const error = await response.json().catch();
        throw new Error(error || 'Otp Failed to sent');
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log(data.message)
      navigate("/")
    },
    onError: (error: any) => {
      console.log(error.message);
    } 

  })


  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      message.error('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    otpMutation.mutate(otp);
  };

  return (
    <div className="w-full h-screen flex overflow-y-hidden">
      {/* Left image */}
      <div className="w-[600px] hidden md:block">
        <img src={login_img} alt="otp_image" className="object-contain" />
      </div>

      {/* Right OTP form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col gap-4 p-8 w-full max-w-sm bg-white rounded-lg ">
          <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
          <p className="text-center text-gray-600">
            Enter the 6-digit OTP sent to <strong>{email}</strong>
          </p>

          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="text-center"
          />

          <Button
            type="primary"
            loading={loading}
            onClick={handleVerifyOtp}
            className="w-full"
          >
            Verify OTP
          </Button>

          <Button type="link" className={`text-center ${resendButtonDisabled ? '!text-gray-400 cursor-not-allowed' : ''}`}
            >
            {resendButtonDisabled ? `Resend OTP (${timer}s)` : 'Resend OTP'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
