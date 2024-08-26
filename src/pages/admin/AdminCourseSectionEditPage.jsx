import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateCourseSection } from '../../services/api/CourseSections';
function AdminCourseSectionEditPage() {
  const location = useLocation(); 
  const existingSection = location.state?.section || {};
  const courseId = location.state?.courseId || null;
  const [sectionHeading, setSectionHeading] = useState(existingSection.title);
  const [sectionDescription, setSectionDescription] = useState(existingSection.description);
  const [urlType, setUrlType] = useState(existingSection.urlType);
  const [contentUrl, setContentUrl] = useState(existingSection.contentUrl);
  const [assignmentStartDate, setAssignmentStartDate] = useState(existingSection.startDate);
  const [assignmentEndDate, setAssignmentEndDate] = useState(existingSection.endDate);
  const [visibility, setVisibility] = useState(existingSection.visibility);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [progressVisibility, setProgressVisibility] = useState(false);
  const [file, setFile] = useState(null);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      if (file) {
        if (handleFileChange(file)) {
          // upload file to firebase storage
          const newContentUrl = await replaceFile(file);

          const sectionData = {
            id: existingSection.id,
            contentType: existingSection.contentType,
            title: sectionHeading,
            description: sectionDescription,
            urlType: urlType || null,
            contentUrl: newContentUrl,
            visibility: visibility,
            startDate: assignmentStartDate,
            endDate: assignmentEndDate,
            courseId: courseId,
          };

          // update course section

          const response = await updateCourseSection(sectionData);
          if (response.status === 200) {
            toast.success('Course section updated successfully');
          } else {
            toast.error('Course section update failed');
          }
        }
      } else {
        const sectionData = {
          id: existingSection.id,
          contentType: existingSection.contentType,
          title: sectionHeading,
          description: sectionDescription,
          urlType: urlType,
          contentUrl: contentUrl ? contentUrl : existingSection.contentUrl,
          visibility: visibility,
          startDate: assignmentStartDate,
          endDate: assignmentEndDate,
          courseId: courseId,
        };

        // update course section
        const response = await updateCourseSection(sectionData);
        if (response.status === 200) {
          toast.success('Course section updated successfully');
        } else {
          toast.error('Course section update failed');
        }
      }
    } catch (error) {
      console.error('Error updating course section:', error);
      toast.error('Error updating course section');
    }
  };

  const handleFileChange = (file) => {
      setFile(file)
      return true;
    
  };

  const replaceFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = contentUrl ? ref(storage, contentUrl) : null;
      console.log("StorageRef value " + storageRef);
      if (storageRef) {
        console.log("Inside the if");
        deleteObject(storageRef)
          .then(() => {
            const newStorageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(newStorageRef, file);

            uploadTask.on('state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                setProgressVisibility(true); // Show progress bar
              },
              (error) => {
                console.error('Upload error:', error);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setUploadProgress(0); // Reset progress
                  setProgressVisibility(false); // Hide progress bar
                  setContentUrl(downloadURL);
                  resolve(downloadURL);
                });
              }
            );
          })
          .catch((error) => {
            console.error('Delete error:', error);
            reject(error);
          });
      } else {
        console.log("Inside the else");
        const newStorageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(newStorageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            setProgressVisibility(true); // Show progress bar
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setUploadProgress(0); // Reset progress
              setProgressVisibility(false); // Hide progress bar
              setContentUrl(downloadURL);
              resolve(downloadURL);
            });
          }
        );
      }
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AdminDashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Edit Course Section</h1>
        {/* Select section type */}
        <div className="mb-4">
          <label htmlFor="sectionType" className="block text-gray-700">Section Type:</label>
          <input
            id="videoFile"
            type="text"
            value={existingSection.contentType}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {existingSection.contentType && (
          <div>
            <div className="mb-4">
              <label htmlFor="sectionHeading" className="block text-gray-700">Section Heading:</label>
              <input
                id="sectionHeading"
                type="text"
                value={sectionHeading}
                onChange={(e) => setSectionHeading(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="sectionDescription" className="block text-gray-700">Section Description:</label>
              <textarea
                id="sectionDescription"
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {existingSection.contentType === 'lesson' && contentUrl !== 'null' && (
              <div className="mb-4">
                <label htmlFor="file" className="block text-gray-700">Upload Media:</label>
                <input
                  id="file"
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="mt-2 mb-3 text-gray-600">
                  Current media: <a href={contentUrl} target='_blank' rel='noopener noreferrer' className="text-blue-500 underline">View Media</a>
                </div>
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
            )}
            {existingSection.contentType === 'assignment' && (
              <>
                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-gray-700">Assignment Start Date:</label>
                  <input
                    id="startDate"
                    type="date"
                    value={assignmentStartDate}
                    min={today}
                    onChange={(e) => setAssignmentStartDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-gray-700">Assignment End Date:</label>
                  <input
                    id="endDate"
                    type="date"
                    min={assignmentStartDate || today}
                    value={assignmentEndDate}
                    onChange={(e) => setAssignmentEndDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </>
            )}
          </div>
        )}
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
        <button
          onClick={handleSaveChanges}
          className="mt-4 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
      <ToastContainer />
    </AdminDashboardLayout>
  );
}

export default AdminCourseSectionEditPage;
