import React from 'react';
import TopNavbar from '../components/layoutcomponents/TopNavbar';
import StudentSideNavbar from '../components/layoutcomponents/StudentSideNavbar';
import BreadCrumb from '../components/common/BreadCrumb';

function StudentDashboardLayout({ children }) {
  return (
    <div >
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <TopNavbar />
      </header>
      
      <div className="w-full max-w-screen"> {/* Wrap main content and sidebar */}
        <nav className="z-50 flex flex-row fixed top-10 left-0 h-auto w-64 bg-gray-800 text-white overflow-none"> {/* Side navigation */}
          <StudentSideNavbar />
        </nav>
       
        <main className='flex flex-col pt-14 pl-72 pr-8 h-auto text-black mb-12'> {/* Main content area positioned to the right */}
            <div>
            <BreadCrumb/>
            </div>
            <div className='mt-4'>
                {children}
            </div> 
        </main>

        
      </div>
    </div>
  );
}

export default StudentDashboardLayout;
