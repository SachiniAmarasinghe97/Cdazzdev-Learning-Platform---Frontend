import React, { useState } from 'react';
import { createCourseSection } from '../../services/api/CourseSections';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';

function AdminCourseSectionAddPage() {
  const location = useLocation();
  const currentPath = location.pathname;
  const pathArray = currentPath.split('/');
  const courseId = pathArray.at(-1);

  const [sectionType] = useState('lesson'); // Set sectionType to 'lesson' by default
  const [sectionHeading, setSectionHeading] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressVisibility, setProgressVisibility] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setError('');
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      let videoUrl = null;

      if (file) {
        setProgressVisibility(true);
        videoUrl = await uploadFile(file);
      }

      if (file && !videoUrl) {
        toast.error("File Upload Failed!!");
        return;
      }

      const response = await createCourseSection({
        courseId: courseId,
        contentType: sectionType,
        title: sectionHeading,
        description: sectionDescription,
        contentUrl: videoUrl,
        urlType: null,
        visibility: visibility,
      });

      if (response.status === 201) {
        toast.success('Course section created successfully!');
        setProgressVisibility(false);
        setSectionHeading('');
        setSectionDescription('');
        setFile(null);
        setUploadProgress(0);
      } else {
        toast.error('Course section creation failed!');
      }
    } catch (error) {
      toast.error('Course section creation failed!');
      console.error(error);
    }
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
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
        <h1 className="text-2xl font-semibold mb-4">Add new course section</h1>
        <div>
          <div className="mb-4">
            <label htmlFor="sectionHeading" className="block text-gray-700">Section Heading:</label>
            <input
              id="sectionHeading"
              type="text"
              required
              value={sectionHeading}
              onChange={(e) => setSectionHeading(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sectionDescription" className="block text-gray-700">Section Description:</label>
            <textarea
              id="sectionDescription"
              required
              value={sectionDescription}
              onChange={(e) => setSectionDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block text-gray-700">Upload Video:</label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {progressVisibility && (
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Upload Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <button
              onClick={() => setVisibility(!visibility)}
              className={`mt-4 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${visibility
                ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                }`}
            >
              {visibility ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>
        {sectionHeading && sectionDescription && (
          <button
            onClick={handleSaveChanges}
            className="mt-4 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
          >
            Save Changes
          </button>
        )}

      </div>
      <ToastContainer />
    </AdminDashboardLayout>
  );
}

export default AdminCourseSectionAddPage;
