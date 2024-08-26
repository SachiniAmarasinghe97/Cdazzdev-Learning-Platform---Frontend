import { useEffect, useState } from 'react'; 
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse } from '../../services/api/CourseService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        getCourses().then((response) => {
            console.log(response.data);
            setCourses(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    
    const navigate = useNavigate();
  
    const handleDelete = async () => {
        if (courseToDelete) {
            try {
                const response = await deleteCourse({ id: courseToDelete.id });
                if(response.status == 200){
                    setCourses(courses.filter(course => course.id !== courseToDelete.id));
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                    toast.success('Course deleted successfully!');
                }
                else{
                    toast.error("Request Failed, Please Try Again!!!")
                }
                
            } catch (err) {
                toast.error("Request Failed, Please Try Again!!!")
                console.log(err);
            }
        }
    }

    const handleEditSection = (id, courseData) => {
        navigate(`/admin/dashboard/course/edit/${id}`, { state: { data: courseData } });
    }

    const handleViewCourseContent = (id, courseData) => {
        navigate(`/admin/course/${id}`, { state: { data: courseData } });
    }

    const openDeleteModal = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setCourseToDelete(null);
    }

    return (
        <AdminDashboardLayout>
            <div className='flex flex-row flex-wrap justify-start'>
                <div className="mb-4">
                    <Link
                        to="/admin/dashboard/course/add"
                        className="middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        data-ripple-light="true"
                    >
                        Add New Course
                    </Link>
                </div>    

                {courses.map((course, index) => (
                    <div key={`course ${index}`}
                        className="bg-white p-6 m-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
                        <div className="relative mb-4 rounded-2xl">
                            <img className="max-h-80 max-w-xs h-48 rounded-2xl object-cover transition-transform duration-300 transform group-hover:scale-105"
                                src={course.imgURL} alt="" />
                        </div>
                        <h3 className="font-medium text-xl leading-8 block relative group-hover:text-blue-500 transition-colors duration-200">
                            {course.title}
                        </h3>
                        <p>{course.description}</p>
                        <div>
                            <div className="inline-flex items-center rounded-md shadow-sm mt-4">
                                <button
                                    onClick={() => handleEditSection(course.id, course)}
                                    className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </span>
                                    <span className="hidden md:inline-block">Edit</span>
                                </button>
                                <button
                                    onClick={() => openDeleteModal(course)}
                                    className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </span>
                                    <span className="hidden md:inline-block text-red-500">Delete</span>
                                </button>
                                <button
                                    onClick={() => handleViewCourseContent(course.id, course)}
                                    className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </span>
                                    <span className="hidden md:inline-block">View</span>
                                </button>
                            </div>  
                        </div>
                    </div>
                ))}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this course?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeDeleteModal}
                                className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </AdminDashboardLayout>
    );
}

export default AdminCoursesPage;
