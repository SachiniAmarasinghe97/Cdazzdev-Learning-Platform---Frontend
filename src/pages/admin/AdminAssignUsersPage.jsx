import React, { useEffect, useState, useCallback } from 'react';
import { getUnAssignedStudents, assignStudentToCourse, removeUserFromCourse } from '../../services/api/CourseAssigns';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminAssignUsers() {
    const location = useLocation();
    const [unAssignedStudents, setUnAssignedStudents] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmationAction, setConfirmationAction] = useState(null); // 'assign' or 'unassign'

    const { data } = location?.state || {};

    const fetchStudents = useCallback(async (courseId) => {
        try {
            const studentsResponse = await getUnAssignedStudents({ courseId });
            setUnAssignedStudents(studentsResponse.data.unassignedStudents || []);
            setAssignedStudents(studentsResponse.data.assignedStudents || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (data?.id) {
            fetchStudents(data.id);
        } else {
            setLoading(false);
            setError(new Error('Invalid course data.'));
        }
    }, [data?.id, fetchStudents]);

    const handleAssign = (user) => {
        setSelectedUser(user);
        setConfirmationAction('assign');
        setShowConfirmation(true);
    };

    const handleUnassign = (user) => {
        setSelectedUser(user);
        setConfirmationAction('unassign');
        setShowConfirmation(true);
    };

    const confirmAction = async () => {
        if (confirmationAction === 'assign') {
            await handleAssignStudent(data.id, selectedUser.id);
        } else if (confirmationAction === 'unassign') {
            await handleRemoveStudentFromCourse(data.id, selectedUser.id);
        }
        resetConfirmation();
    };

    const handleAssignStudent = async (courseId, userId) => {
        try {
            const response = await assignStudentToCourse({ courseId, studentId: userId });
            if (response.status === 201) {
                toast.success('Student assigned to the course');
                updateStudentLists(userId, 'assign');
            }
        } catch (error) {
            toast.error('Student assignment failed, please try again!');
        }
    };

    const handleRemoveStudentFromCourse = async (courseId, userId) => {
        try {
            const response = await removeUserFromCourse({ courseId, userId });
            if (response.status === 200) {
                toast.success('Student removed successfully');
                updateStudentLists(userId, 'remove');
            }
        } catch (error) {
            toast.error('Student removal process failed!');
        }
    };

    const updateStudentLists = (userId, action) => {
        if (action === 'assign') {
            setUnAssignedStudents(prevState => prevState.filter(student => student.id !== userId));
            setAssignedStudents(prevState => [...prevState, unAssignedStudents.find(student => student.id === userId)]);
        } else if (action === 'remove') {
            setAssignedStudents(prevState => prevState.filter(student => student.id !== userId));
            setUnAssignedStudents(prevState => [...prevState, assignedStudents.find(student => student.id === userId)]);
        }
    };

    const resetConfirmation = () => {
        setShowConfirmation(false);
        setSelectedUser(null);
        setConfirmationAction(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800">Assign Users to Course</h2>
            <hr />
            <div className="mt-6 flex">
                <div className="w-1/2 pr-4">
                    <h3 className="text-xl font-medium text-gray-700">Unassigned Students</h3>
                    <div className="space-y-4 mt-4">
                        {unAssignedStudents.length > 0 ? (
                            unAssignedStudents.map(student => (
                                <div key={student.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                    <span className="text-gray-700">{student.username}</span>
                                    <button
                                        onClick={() => handleAssign(student)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Assign
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No unassigned students found.</p>
                        )}
                    </div>

                    <h3 className="text-xl font-medium text-gray-700 mt-8">Assigned Students</h3>
                    <div className="space-y-4 mt-4">
                        {assignedStudents.length > 0 ? (
                            assignedStudents.map(student => (
                                <div key={student.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                    <span className="text-gray-700">{student.username}</span>
                                    <button
                                        onClick={() => handleUnassign(student)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Unassign
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No assigned students found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-medium text-gray-800">Confirm Action</h3>
                        <p className="mt-4">
                            Are you sure you want to {confirmationAction} this student?
                        </p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={resetConfirmation}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
