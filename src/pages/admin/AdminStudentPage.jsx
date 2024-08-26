import { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
import { getAllStudents, deleteStudent, updateStudent } from '../../services/api/UserService';
import { userRegister } from '../../services/api/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminStudentPage() {
    const [students, setStudents] = useState([{}]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [studentData, setStudentData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await getAllStudents();
            if (response.status === 200) {
                setStudents(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to retrieve students.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentData({ ...studentData, [name]: value });
    };

    const handleAddStudent = async () => {
        try {
            await userRegister(studentData);
            toast.success('Student added successfully!');
            setShowModal(false);
            fetchStudents();
        } catch (error) {
            toast.error('Failed to add student.');
        }
    };

    const handleUpdateStudent = async () => {
        try {
            await updateStudent({
                id: editingStudent.id,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                telephoneNumber: studentData.telephoneNumber,
                email: studentData.email,
            });
            toast.success('Student updated successfully!');
            setShowModal(false);
            fetchStudents();
        } catch (error) {
            toast.error('Failed to update student.');
        }
    };

    const openDeleteModal = (student) => {
        setStudentToDelete(student);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setStudentToDelete(null);
    };

    const handleDeleteStudent = async () => {
        try {
            await deleteStudent(studentToDelete.id);
            toast.success('Student deleted successfully!');
            fetchStudents();
            closeDeleteModal();
        } catch (error) {
            toast.error('Failed to delete student.');
        }
    };

    const openModal = (student = null) => {
        setEditingStudent(student);
        setStudentData(student || { firstName: '', lastName: '', email: '', username: '', password: '' });
        setShowModal(true);
    };

    return (
        <AdminDashboardLayout>
            <div className='flex flex-row flex-wrap justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Students</h2>
                <button onClick={() => openModal()} className='px-4 py-2 bg-blue-500 text-white rounded-md'>
                    Add New Student
                </button>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 border-b-2 border-gray-200 text-left'>First Name</th>
                            <th className='px-6 py-3 border-b-2 border-gray-200 text-left'>Last Name</th>
                            <th className='px-6 py-3 border-b-2 border-gray-200 text-left'>Email</th>
                            <th className='px-6 py-3 border-b-2 border-gray-200 text-left'>Username</th>
                            <th className='px-6 py-3 border-b-2 border-gray-200 text-left'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.id}>
                                    <td className='px-6 py-4 border-b border-gray-200'>{student.firstName}</td>
                                    <td className='px-6 py-4 border-b border-gray-200'>{student.lastName}</td>
                                    <td className='px-6 py-4 border-b border-gray-200'>{student.email}</td>
                                    <td className='px-6 py-4 border-b border-gray-200'>{student.username}</td>
                                    <td className='px-6 py-4 border-b border-gray-200'>
                                        <button
                                            onClick={() => openModal(student)}
                                            className='px-4 py-2 bg-green-500 text-white rounded-md mr-2'
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(student)}
                                            className='px-4 py-2 bg-red-500 text-white rounded-md'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <p>No students found.</p>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-8 rounded-md'>
                        <h2 className='text-lg font-semibold mb-4'>{editingStudent ? 'Update Student' : 'Add New Student'}</h2>
                        <form>
                            <div className='mb-4'>
                                <label className='block text-gray-700'>First Name</label>
                                <input
                                    type='text'
                                    name='firstName'
                                    required
                                    value={studentData.firstName}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-2 border rounded-md'
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-700'>Last Name</label>
                                <input
                                    type='text'
                                    name='lastName'
                                    required
                                    value={studentData.lastName}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-2 border rounded-md'
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-700'>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    required
                                    value={studentData.email}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-2 border rounded-md'
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-700'>Username</label>
                                <input
                                    type='text'
                                    name='username'
                                    required
                                    value={studentData.username}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-2 border rounded-md'
                                />
                            </div>
                            {!editingStudent && (
                                <div className='mb-4'>
                                    <label className='block text-gray-700'>Password</label>
                                    <input
                                        type='password'
                                        name='password'
                                        required
                                        value={studentData.password}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-2 border rounded-md'
                                    />
                                </div>
                            )}
                            <div className='flex justify-end'>
                                <button
                                    type='button'
                                    onClick={() => setShowModal(false)}
                                    className='px-4 py-2 bg-gray-500 text-white rounded-md mr-2'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                                    className='px-4 py-2 bg-blue-500 text-white rounded-md'
                                >
                                    {editingStudent ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this student?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeDeleteModal}
                                className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteStudent}
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

export default AdminStudentPage;
