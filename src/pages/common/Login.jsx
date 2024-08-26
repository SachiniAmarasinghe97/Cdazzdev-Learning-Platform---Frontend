import React, { useState } from 'react';
import { userLogin, userRegister, sendOTP, verifyOTP, resetPassword } from '../../services/api/AuthService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [isOTPVerfied, setOTPVerified] = useState(false);
    const [isResetEmailSend, setResetEmailSend] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userLogin({ username, password });
            if (response.status === 200) {
                toast.success("Login Successfull")
            }
            setError('');
            const token = response.data.token;
            login(token);

            // Decode the token
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            if (Cookies.get('access_token')) {
                if (userRole === 'admin') {
                    navigate('/admin/dashboard/courses');
                } else {
                    navigate('/student/dashboard');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Login failed. Please check your username and password.');
        } finally {
            setUsername('');
            setPassword('');
        }
    };

    // Registration Form State
    const [newEmail,setNewEmail] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [registrationError, setRegistrationError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setRegistrationError('Passwords do not match.');
            toast.error('Passwords did not match')
            return;
        }
        try {
            const response = await userRegister({ email: newEmail, username: newUsername, password: newPassword, role });
            setRegistrationError('');
            if (response.status === 201) {
                setShowRegister(false)
                toast.success("Congratulations, your account has been successfully created!!!")
            } else if (response.status === 400) {
                toast.error("User already exists")
            }

        } catch (error) {
            console.log(error)
            toast.error("Registration failed, please try again");
        } finally {
            setNewEmail('');
            setUsername('');
            setPassword('');
            setNewUsername('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const [emailToSendOtp, setEmailToSendOtp] = useState('');
    // send OTP 
    const handleSendOTPHandler = async (e) => {
        e.preventDefault();
        try {
            // send an axios call to the backend to send an OTP
            const response = await sendOTP({ email: emailToSendOtp })
            if (response.status === 201) {
                setResetEmailSend(true);
                toast.success("OTP has been sent to your email")
            }

        } catch (error) {
            // console.log(JSON.stringify(JSON.stringify(error.status)))
            toast.error("Failed to send OTP, please check your email and try again..")

        }
    };

    // verify OTP
    const [OTP,SetOTP] = useState('')
    const [userId, setUserId] = useState(null)
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            // verify OTP here
            const response = await verifyOTP({email:emailToSendOtp, otp:OTP})
            if(response.status === 200){
                toast.success("OTP has been verified successfully")
                setOTPVerified(true)
                setUserId(response.data.userId)
                console.log(JSON.stringify(response.data.userId))
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to verify OTP");
        }
    }

    // handlePasswordReset
    const[newresetPassword,SetNewResetPassword] = useState('')
    const[confirmresetPassword,SetConfirmPasswordReset] = useState('')
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newresetPassword !== confirmresetPassword) {
            setRegistrationError('Passwords do not match.');
            toast.error('Passwords did not match')
            return;
        }
        try {
            // send an axios call to reset password
            const response = await resetPassword({userId: userId, newPassword:newresetPassword })
            if(response.status === 200){
                toast.success("Password has been reset successfully")
                showResetPassword(false)
                setOTPVerified(false)
                setResetEmailSend(false)
                showResetPassword(false)
                isResetEmailSend(false)
                isOTPVerfied(false)
                SetOTP('')
                
                // location.reload();
            }
        } catch (error) {
            toast.error("Failed to reset password")
        }
        finally{
            SetNewResetPassword('')
            SetConfirmPasswordReset('')
        }
    }



    return (
        <>
            <div className="bg-gray-900 bg-gray-900">
                <div className="flex justify-center h-screen">
                    <div className="hidden bg-cover lg:block lg:w-2/3" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)' }}>
                        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                            <div>
                                <h2 className="text-4xl font-bold text-white">Welcome to Cdazzdev Learning Platform</h2>
                                <p className="max-w-xl mt-3 text-gray-300">Learn new skills, expand your knowledge base, and achieve your goals.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                        <div className="flex-1">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold text-center text-gray-200 text-white">Cdazzdev</h2>
                                {!showResetPassword && (
                                    <p className="mt-3 text-gray-200 ">{showRegister ? 'Register for a new account' : 'Sign in to access your account'}</p>
                                )}
                                {showResetPassword && !isResetEmailSend && (
                                    <p className="mt-3 text-gray-200 ">Please enter your email to send the OTP</p>
                                )}
                                {isResetEmailSend && !isOTPVerfied && (
                                    <p className="mt-3 text-gray-200 ">An email has been sent to reset your password, Please check your email and enter OTP.</p>
                                )}
                                {isOTPVerfied && (
                                    <p className="mt-3 text-gray-200 ">Reset your password</p>
                                )}
                            </div>

                            <div className="mt-8">
                                {/* Registration and Signin Forms */}
                                {!showResetPassword && (
                                    <>
                                        {!showRegister ? (
                                            // Login Form
                                            <form onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="username" className="block mb-2 text-sm text-gray-200 ">Enter User Name</label>
                                                    <input
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" placeholder="Username" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                                </div>

                                                <div className="mt-6">
                                                    <div className="flex justify-between mb-2">
                                                        <label htmlFor="password" className="text-sm text-gray-200">Enter Password</label>
                                                    </div>
                                                    <input
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="Password" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                                </div>

                                                <div className="mt-6">
                                                    <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                                        Sign in
                                                    </button>
                                                </div>
                                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                            </form>
                                        ) : (
                                            // Registration Form
                                            <form onSubmit={handleRegister}>
                                                <div>
                                                    <label htmlFor="newEmail" className="block mb-2 text-sm text-gray-200 ">Enter Email</label>
                                                    <input onChange={(e) => setNewEmail(e.target.value)} type="email" name="newEmail" id="newEmail" placeholder="Email" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                                </div>
                                                <div className='mt-6'>
                                                    <label htmlFor="newUsername" className="block mb-2 text-sm text-gray-200">Enter User Name</label>
                                                    <input onChange={(e) => setNewUsername(e.target.value)} type="text" name="newUsername" id="newUsername" placeholder="Username" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                                </div>

                                                <div className="mt-6">
                                                    <label htmlFor="newPassword" className="block mb-2 text-sm text-gray-200">Enter Password</label>
                                                    <input onChange={(e) => setNewPassword(e.target.value)} type="password" name="newPassword" id="newPassword" placeholder="Password" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                                </div>

                                                <div className="mt-6">
                                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-200">Confirm Password</label>
                                                    <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                                </div>

                                                <div className="mt-6">
                                                    <label htmlFor="role" className="block mb-2 text-sm text-gray-200">Select Role</label>
                                                    <select onChange={(e) => setRole(e.target.value)} value={role} id="role" className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40">
                                                        <option value="student">Student</option>
                                                    </select>
                                                </div>

                                                <div className="mt-6">
                                                    <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-500 rounded-md hover:bg-green-400 focus:outline-none focus:bg-green-400 focus:ring focus:ring-green-300 focus:ring-opacity-50">
                                                        Register
                                                    </button>
                                                </div>
                                                {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
                                            </form>
                                        )}
                                        <div className="mt-6 text-center">
                                            {/* footer section for register and signin */}
                                            {showRegister ? (
                                                <>
                                                    <p className="text-gray-300">
                                                        Already have an account?{' '}
                                                        <button onClick={() => setShowRegister(false)} className="text-blue-500 hover:underline focus:outline-none">
                                                            Sign in
                                                        </button>
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-gray-200">
                                                        Don't have an account?{' '}
                                                        <button onClick={() => setShowRegister(true)} className="text-blue-500 hover:underline focus:outline-none">
                                                            Register
                                                        </button>
                                                    </p>
                                                    <br />
                                                    <p className="text-gray-200">
                                                        Forgot your password?{' '}
                                                        <button onClick={() => setShowResetPassword(true)} className="text-red-500 hover:underline focus:outline-none">
                                                            Reset
                                                        </button>
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Reset Password Form */}
                                {showResetPassword && !isResetEmailSend && (
                                    <form
                                        onSubmit={handleSendOTPHandler}>
                                        <div>
                                            <label htmlFor="emailToSendOtp" className="block mb-2 text-sm text-gray-200">Enter Email</label>
                                            <input onChange={(e) => setEmailToSendOtp(e.target.value)}
                                                value={emailToSendOtp}
                                                type="email" name="emailToSendOtp" id="emailToSendOtp" placeholder="Email" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        </div>

                                        <div className="mt-6">
                                            <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-500 rounded-md hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50">
                                                Send OTP
                                            </button>
                                        </div>
                                        {/* <div className='mt-6 text-center'>
                                            <p className="text-gray-300">
                                                Already have an account?{' '}
                                                <button onClick={() => setShowRegister(false)} className="text-blue-500 hover:underline focus:outline-none">
                                                    Sign in
                                                </button>
                                            </p>
                                            <p className="text-gray-300">
                                                Don't have an account?{' '}
                                                <button onClick={() => setShowRegister(true)} className="text-blue-500 hover:underline focus:outline-none">
                                                    Register
                                                </button>
                                            </p>
                                        </div> */}

                                    </form>
                                )}

                                {/* OTP Form */}
                                {isResetEmailSend && !isOTPVerfied && (
                                    <form
                                        onSubmit={handleVerifyOTP}>
                                        <div>
                                            <label htmlFor="otp" className="block mb-2 text-sm text-gray-200">Enter OTP</label>
                                            <input
                                            onChange={(e) => SetOTP(e.target.value)} 
                                            type="text" name="otp" id="otp" placeholder="OTP" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 bg-gray-900 border border-gray-200 rounded-md placeholder-gray-600 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        </div>

                                        <div className="mt-6">
                                            <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-500 rounded-md hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50">
                                                Verify OTP
                                            </button>
                                        </div>

                                    </form>
                                )}

                                {showResetPassword && isResetEmailSend && isOTPVerfied && (
                                    <form onSubmit={handlePasswordReset}>
                                        <div>
                                            <label htmlFor="newPassword" className="block mb-2 text-sm text-gray-200">Enter New Password</label>
                                            <input 
                                            onChange={(e) => SetNewResetPassword(e.target.value)} 
                                            type="password" name="resetPassword" id="newPassword" placeholder="New Password" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-200">Confirm Password</label>
                                            <input 
                                            onChange={(e) => SetConfirmPasswordReset(e.target.value)} 
                                            type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-400 border border-gray-200 rounded-md placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        </div>

                                        <div className="mt-6">
                                            <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-500 rounded-md hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50">
                                                Reset Password
                                            </button>
                                        </div>
                                    </form>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default Login;
