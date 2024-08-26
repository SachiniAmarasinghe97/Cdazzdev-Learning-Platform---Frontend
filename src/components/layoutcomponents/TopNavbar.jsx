import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom';

function TopNavbar() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        Cookies.remove('access_token');
        Cookies.remove('userId');
        navigate('/');
        setShowLogoutModal(false);
    }

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    }

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    }

    return (
        <div>
            <header className="bg-gray-900 border-gray-700">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-white font-bold text-xl">
                            <a href="#">Cdazzdev Learning Platform</a>
                        </div>
                        <div className="hidden md:block">
                            <ul className="flex items-center space-x-8">
                                <li>
                                    <Link 
                                    onClick={openLogoutModal}
                                    className="text-white">
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                        <h2 className="text-red-500 text-xl font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-4 text-white">Are you sure you want to Logout?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeLogoutModal}
                                className="mr-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                No
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TopNavbar
