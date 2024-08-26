import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCourseContents, deleteCourseContent } from '../../services/api/CourseSections';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCourseContentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.data || {};
  const [courseSections, setCourseSections] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseSectionToDelete, setCourseSectionToDelete] = useState(null);
  // const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchCourseContent() {
      try {
        const response = await getCourseContents(course.id);
        if (response.status === 200) {
          setCourseSections(response.data.data);
        } else {
          console.log("No available Course Sections");
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error fetching courses. Please try again.');
      }
    }
    if (course.id) {
      fetchCourseContent();
    }
  }, [course.id]);

  const handleEditSection = (section) => {
    navigate('/admin/course/section/edit', { state: { section, id: course.id } });
  };

  const handleNewSection = () => {
    navigate(`/admin/course/section/add/${course.id}`);
  };

  const handleDeleteSection = async () => {
    if (courseSectionToDelete) {
      try {
        const response = await deleteCourseContent(courseSectionToDelete.id);
        if (response.status === 200) {
          setCourseSections(courseSections.filter(courseSection => courseSection.id !== courseSectionToDelete.id));
          setShowDeleteModal(false);
          setCourseSectionToDelete(null);
          toast.success('Course Section deleted successfully!');
        } else {
          toast.error("Request Failed, Please Try Again!!!");
        }
      } catch (err) {
        toast.error("Request Failed, Please Try Again!!!");
        console.error(err);
      }
    }
  };

  const openDeleteModal = (courseSection) => {
    setCourseSectionToDelete(courseSection);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCourseSectionToDelete(null);
  };

  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase().split('?');
    console.log("extensions")
    console.log(extension[0])
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'wmv'];
    const fileExtensions = ['pdf']
    if (imageExtensions.includes(extension[0])) return 'image';
    if (videoExtensions.includes(extension[0])) return 'video';
    if (fileExtensions.includes(extension[0])) return 'file';
    return 'unknown';
  };

  // const handleViewAssignment = (section) => {
  //   navigate('/admin/course/section/assignment', { state: { section, id: course.id } });
  // }

  // const formatDate = (dateTimeString) => dateTimeString.split('T')[0];

  return (
    <AdminDashboardLayout>
      <style>
        {`
                        @keyframes bounce {
                            0%, 100% {
                            transform: translateY(0);
                            }
                            50% {
                            transform: translateY(-8px);
                            }
                        }
                    `}
      </style>
      <div className='shadow-lg'>
        <div className="pt-4 pb-4 pl-2">
          <h1 className="text-2xl font-bold">{course.courseID}</h1>
          <p>{course.title}</p>
        </div>
        <div className="mb-4">
          <button
            onClick={handleNewSection}
            className="rounded-lg bg-green-500 py-3 px-6 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Section
          </button>
        </div>
        <hr />
        <div className='pt-4 pb-4 pl-2'>
          {courseSections.map((section) => (
            <div key={section.id} className="py-5 flex">
              <details className="group">
                <summary className="flex justify-start font-medium cursor-pointer list-none">
                  <span className={section.visibility ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                    {section.visibility ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </span>
                  <span className='font-bold text-xl'>{section.title}</span>
                  <span className="ml-auto transition group-open:rotate-180">
                    <svg
                      style={{ animation: 'bounce 1s infinite' }}
                      fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="mb-6 inline-flex items-center rounded-md shadow-sm mt-4">
                  <button
                    onClick={() => handleEditSection(section)}
                    className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <span className="hidden md:inline-block">Edit</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(section)}
                    className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="hidden md:inline-block text-red-500">Delete</span>
                  </button>
                </div>
                <div>
                  {section.contentType === 'lesson' && (
                    <div>
                      <p>{section.description}</p>
                    </div>
                  )}
                  {section.contentUrl && (
                    <div className='mt-3'>
                      {getFileType(section.contentUrl) === 'image' && (
                        <img src={section.contentUrl} alt="image file" />
                      )}
                      {getFileType(section.contentUrl) === 'video' && (
                        <video controls>
                          <source src={section.contentUrl} type="video/mp4" alt="video file" />
                        </video>
                      )}
                      {getFileType(section.contentUrl) === 'file' && (
                        <a href={section.contentUrl} className='text-blue-500 hover:underline'>
                          Click here to see the file
                        </a>
                      )}
                      {getFileType(section.contentUrl) === 'unknown' && (
                        <p>Unknown file type</p>
                      )}
                    </div>
                  )}
                  {/* {section.contentType === 'assignment' && (
                    <div className='flex flex-row p-4 flex-start bg-gray-200 shadow-xl m-4 rounded-md w-full'>
                      <img
                        src={assignment}
                        alt="Assignment Icon"
                        style={{ width: '64px', height: '64px' }}
                      />
                      <div className='ml-8'>
                        <p>
                          <span className='font-bold'>
                            <button onClick={() => { handleViewAssignment(section) }} className='hover:underline'>
                              View Assignment Submissions
                            </button>
                          </span>
                          <br />
                          <span>Start Date: {formatDate(section.startDate)}</span> <br />
                          <span>Due Date: {formatDate(section.endDate)}</span>
                        </p>
                      </div>
                    </div>
                  )} */}
                </div>
              </details>
              <hr />
            </div>
          ))}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this course section?</p>
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSection}
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

export default AdminCourseContentPage;
