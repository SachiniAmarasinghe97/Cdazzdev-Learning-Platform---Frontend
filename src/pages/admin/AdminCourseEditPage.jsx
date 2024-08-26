import React, { useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
import { updateCourse } from '../../services/api/CourseService';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminAssignUsers from './AdminAssignUsersPage';
function AdminCourseEditPage() {
    const location = useLocation();
    const { data } = location?.state || {};
    const [courseID, setCourseID] = useState(data.courseID);
    const [courseName, setCourseName] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [courseImageUrl, setCourseImageUrl] = useState(data.imgURL);

    const [error, setError] = useState(null);
    const [file, setFile] = useState('');
    const [fileStatus, setFileStatus] = useState(true);

    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB

        if (fileSizeInMB <= 50) {
            setFile(file);
            setFileStatus(true);
            setError(null);
        } else {
            setFile('');
            setFileStatus(false);
            setError(new Error('File size exceeds 50MB'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let uploadedImageUrl = courseImageUrl;
            if (file) {
                uploadedImageUrl = await replaceFile(file);
                setCourseImageUrl(uploadedImageUrl);
            }
            const response = await updateCourse({
                id: data.id,
                courseID: courseID,
                title: courseName,
                description: description,
                imgURL: uploadedImageUrl
            });
            if (response.status === 200) {
                toast.success('Course updated successfully!');
                setFileStatus(true);
                setCourseID('');
                setCourseName('');
                setDescription('');
                setFile('');
            }
        } catch (error) {
            console.log(error);
            toast.error('Course update failed, please try again.');
            setFile('');
        }
    };

    const replaceFile = (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = data.imgURL ? ref(storage, data.imgURL) : null;
            if (storageRef) {

            deleteObject(storageRef)
                .then(() => {
                    const newStorageRef = ref(storage, `uploads/${file.name}`);
                    const uploadTask = uploadBytesResumable(newStorageRef, file);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        },
                        (error) => {
                            setError(error);
                            console.error('Upload error:', error);
                            reject(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                // setUploadProgress(0);
                                resolve(downloadURL);
                            });
                        }
                    );
                })
                .catch((error) => {
                    setError(error);
                    console.error('Delete error:', error);
                    reject(error);
                });
            }
            else{
                const newStorageRef = ref(storage, `uploads/${file.name}`);
                const uploadTask = uploadBytesResumable(newStorageRef, file);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        },
                        (error) => {
                            setError(error);
                            console.error('Upload error:', error);
                            reject(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                // setUploadProgress(0);
                                resolve(downloadURL);
                            });
                        }
                    );
            }
        });
        
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Edit Course - <span className='text-red-600'>{data.title}</span> </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="courseName" className="block text-gray-700">Course Name:</label>
                        <input
                            type="text"
                            id="courseName"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="file-upload">
                        <input
                            type="file"
                            id="editCourseImage"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleFileChange}
                        />
                        {error && <div className="error">{error.message}</div>}
                        <button
                            type="submit"
                            className="mt-4 mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >Update Course</button>
                    </div>
                    {!fileStatus && <div className="text-red-500">File Upload Failed, Please be aware about maximum file size</div>}

                    <img src={courseImageUrl} style={{ width: "200px", height: "120px" }} alt="" />
                </form>
            </div>
            <ToastContainer />
            <AdminAssignUsers/>
        </AdminDashboardLayout>
    );
}

export default AdminCourseEditPage;
