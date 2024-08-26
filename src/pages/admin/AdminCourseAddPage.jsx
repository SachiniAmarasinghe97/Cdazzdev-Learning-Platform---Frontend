import React, { useState } from 'react';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
import { createCourse } from '../../services/api/CourseService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCourseAddPage() {
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [fileStatus, setFileStatus] = useState(true);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileStatus(true);
    
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (file) {
                const uploadedImageUrl = await uploadFile(file);
                if (uploadedImageUrl) {
                    const response = await createCourse({
                        title: courseName,
                        description: description,
                        imgURL: uploadedImageUrl
                    });
                    console.log(response);
                    toast.success('Course created successfully!');
                    setFileStatus(true);
                    setCourseName('');
                    setDescription('');
                    setFile(null);
                    setUploadProgress(0);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Course creation failed, please try again.');
            setFile(null);
        }
    };

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    setError(error.message);
                    console.error('Upload error:', error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    }).catch((error) => {
                        setError(error.message);
                        reject(error);
                    });
                }
            );
        });
    };

    return (
        <AdminDashboardLayout>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Add New Course</h1>
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
                    <div className="file-upload mb-4">
                        <label htmlFor="courseImage" className="block text-gray-700">Course Image:</label>
                        <input
                            type="file"
                            id="courseImage"
                            onChange={handleFileChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                            accept="image/*"
                        />
                        {!fileStatus && <div className="text-red-500">File Upload Failed, Please be aware about maximum file size</div>}
                        {error && <div className="text-red-500">{error}</div>}
                    </div>
                    {uploadProgress > 0 && (
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                        Upload Progress
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-600">
                                        {uploadProgress.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >Add Course</button>
                </form>
            </div>
            <ToastContainer />
        </AdminDashboardLayout>
    );
}

export default AdminCourseAddPage;
