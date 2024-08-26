import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import logo from './../../images/logo_2.png'

function AdminSideNavbar() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        Cookies.remove('access_token');
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
            <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-gray-900 border-r border-gray-700">
                <a href="#">
                    <img className="w-auto" src={logo} alt="Logo" />
                </a>
                <div className="flex flex-col justify-between flex-1 mt-2">
                    <nav className="-mx-3 space-y-1">
                        <label className="px-3 text-xs text-gray-400 uppercase"></label>

                        <Link
                            to="/admin/dashboard/courses"
                            className="flex items-center px-3 py-3 text-gray-200 transition-colors duration-300 transform rounded-lg hover:bg-gray-800 hover:text-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-5.4a5.5 5.5 0 10-4 0V21h4z" />
                            </svg>
                            <span className="mx-2 text-sm font-medium">Manage Courses</span>
                        </Link>

                        <Link
                            to="/admin/dashboard/students"
                            className="flex items-center px-3 py-3 text-gray-200 transition-colors duration-300 transform rounded-lg hover:bg-gray-800 hover:text-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-5.4a5.5 5.5 0 10-4 0V21h4z" />
                            </svg>
                            <span className="mx-2 text-sm font-medium">Manage Students</span>
                        </Link>

                        <span
                            onClick={openLogoutModal}
                            className="flex items-center px-3 py-3 text-gray-200 transition-colors duration-300 transform rounded-lg hover:bg-gray-800 hover:text-gray-200 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="mx-2 text-sm font-medium">Logout</span>
                        </span>
                    </nav>
                </div>
            </aside>

            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                        <h2 className="text-red-500 text-xl font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-4 text-gray-200">Are you sure you want to Logout?</p>
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

export default AdminSideNavbar
