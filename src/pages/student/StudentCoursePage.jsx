import React, { useEffect, useState } from 'react'
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout'
import { useLocation } from 'react-router-dom';
import { getCourseContents } from '../../services/api/CourseSections.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function StudentCoursePage() {
    const location = useLocation();
    const [course, setCourse] = useState(location.state?.data || {});
    const [courseSections, setCourseSections] = useState([]);
    useEffect(() => {
        async function fetchCourseContent() {
            try {
                const response = await getCourseContents(course.id);
                if (response.status === 200) {
                    setCourseSections(response.data.data);
                    console.log(JSON.stringify(response.data.data))
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
    }, [course]);

    const getFileType = (url) => {
        const extension = url.split('.').pop().toLowerCase().split('?');
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'wmv'];
        const fileExtensions = ['pdf']
        if (imageExtensions.includes(extension[0])) return 'image';
        if (videoExtensions.includes(extension[0])) return 'video';
        if (fileExtensions.includes(extension[0])) return 'file';
        return 'unknown';
    };

    return (
        <StudentDashboardLayout>
            <>
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
                    {/* Course Heading */}
                    <div className='pt-4 pb-4 pl-2'>
                        <h1 className='text-2xl font-bold'>{course.courseID} | {course.title}</h1>
                        <p>{course.description}</p>
                    </div>
                    <hr />
                    {/* Course Sections */}
                    <div className='pt-4 pb-4 pl-2'>
                        {courseSections.map((section) => (
                            section.visibility && (
                                <div key={`enrolled${section.id}`} className="py-5">
                                    <details className="group">
                                        <summary className="font-medium cursor-pointer list-none">
                                            <span className='font-bold text-xl'>{section.title}</span>
                                            <span className="ml-auto transition group-open:rotate-180">
                                                <svg
                                                    style={{ animation: 'bounce 1s infinite' }}
                                                    fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>

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
                                                            <source src={section.contentUrl} type="video/mp4" />
                                                        </video>
                                                    )}
                                                    {getFileType(section.contentUrl) === 'file' && (
                                                        <a href={section.contentUrl}>
                                                            Click here to see the file
                                                        </a>
                                                    )}
                                                    {getFileType(section.contentUrl) === 'unknown' && (
                                                        <p>Unknown file type</p>
                                                    )}
                                                </div>
                                            )}
                                            
                                        </div>
                                    </details>
                                    <hr />
                                </div>
                            )
                        ))}

                    </div>
                </div>
            </>
            <ToastContainer />
        </StudentDashboardLayout>

    )
}

export default StudentCoursePage