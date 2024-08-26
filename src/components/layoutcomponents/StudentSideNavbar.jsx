import React from 'react'
import logo from './../../images/logo_2.png'
import { Link } from 'react-router-dom'

function StudentSideNavbar() {
    return (
        <div>
            <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-gray-900 border-gray-700 border-r rtl:border-r-0 rtl:border-l">
                <p href="#">
                    <img className="w-auto" src={logo} alt="" />
                </p>

                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav className="-mx-3 space-y-6">
                        <div className="space-y-3">
                            <label className="px-3 text-xs text-gray-400 uppercase"></label>

                            <Link className="flex items-center px-3 py-2 text-gray-200 transition-colors duration-300 transform rounded-lg hover:bg-gray-800 hover:text-gray-200"
                             to="/student/dashboard">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                                </svg>

                                <span className="mx-2 text-sm font-medium">Courses</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </aside>
        </div>
    )
}

export default StudentSideNavbar
