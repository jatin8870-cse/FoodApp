import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useLocation } from "react-router-dom";

const VerifyOwnerOtp = () => {

    const location = useLocation();

const email = location.state?.email;

console.log("EMAIL FOR OTP:", email);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleVerifyOwnerOtp = async () => {
    if (otp.length !== 6) {
        setErr("Please enter 6 digit OTP");
        return;
    }

    if (!email) {
        setErr("Email not found. Please signup again.");
        return;
    }

    setLoading(true);
    setErr("");

    try {
        const { data } = await axios.post(
            `${serverUrl}/api/auth/verifyOtp`,
            {
                email,
                otp,
            },
            {
                withCredentials: true,
            }
        );

        console.log("OTP VERIFIED:", data);

        dispatch(setUserData(data.user));

        navigate("/");

    } catch (error) {
        console.log(
            "VERIFY OTP ERROR:",
            error?.response?.data
        );

        setErr(
            error?.response?.data?.message ||
            "OTP verification failed"
        );
    } finally {
        setLoading(false);
    }
};
    return (
        
        <div className="min-h-screen flex items-center justify-center bg-[#fff9f6] p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
              <IoIosArrowRoundBack size={34} className='text-[#ff4d2d]' onClick={() => navigate("/signIn")} />
                <h1 className="text-3xl font-bold text-orange-500 mb-2">
                    Verify Owner
                </h1>

                <p className="text-gray-600 mb-6">
                    We have sent a 6-digit OTP to your registered email.
                </p>

                <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6 digit OTP"
                    value={otp}
                    onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full border rounded-lg px-3 py-3 text-center tracking-widest text-xl"
                />

                {err && (
                    <p className="text-red-500 text-center mt-3">
                        *{err}
                    </p>
                )}


                <button
                    type="button"
                    onClick={handleVerifyOwnerOtp}
                    disabled={loading}
                    className="w-full mt-5 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                >
                    {loading ? (
                        <ClipLoader size={20} color="white" />
                    ) : (
                        "Verify OTP"
                    )}
                </button>

            </div>

        </div>
    );
};

export default VerifyOwnerOtp;
