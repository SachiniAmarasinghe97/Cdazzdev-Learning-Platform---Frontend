import React from 'react';
import BreadCrumb from '../components/common/BreadCrumb';
import AdminSideNavbar from '../components/layoutcomponents/AdminSideNavbar';

function AdminDashboardLayout({ children }) {
  return (
    <div >      
      <div className="w-full max-w-screen"> {/* Wrap main content and sidebar */}
        <nav className="z-50 flex flex-row fixed top-0 left-0 h-auto w-64 bg-gray-800 text-white overflow-none"> {/* Side navigation */}
          <AdminSideNavbar />
        </nav>
       
        <main className='flex flex-col pl-72 pr-8 h-auto text-black mb-12'> {/* Main content area positioned to the right */}
            <div>
            <BreadCrumb/>
            </div>
            <div className='mt-4'>
                {children}
            </div> 
        </main>

        
      </div>
      {/* <footer className='mt-20 ml-64'>
        <Footer />
      </footer> */}
    </div>
  );
}

export default AdminDashboardLayout;
