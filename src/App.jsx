
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/common/Login';
import StudentDashboardHome from './pages/student/StudentDashboardHome'
import StudentCoursePage from './pages/student/StudentCoursePage'
import AdminCourseContentPage from './pages/admin/AdminCourseContentPage';
import AdminCourseSectionAddPage from './pages/admin/AdminCourseSectionAddPage';
import AdminCourseSectionEditPage from './pages/admin/AdminCourseSectionEditPage'
import AdminCoursesPage from './pages/admin/AdminCoursesPage'
import AdminCourseAddPage from './pages/admin/AdminCourseAddPage'
import AdminCourseEditPage from './pages/admin/AdminCourseEditPage'
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoutes';
import AdminAssignUsers from './pages/admin/AdminAssignUsersPage';
import AdminStudentPage from './pages/admin/AdminStudentPage'

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<PrivateRoute role="student"><StudentDashboardHome /></PrivateRoute>} /> 
        <Route path="/student/course/:id" element={<PrivateRoute role="student"><StudentCoursePage /></PrivateRoute>} /> 

        {/*Admin Routes  */}
        <Route path="/admin/course/:id" element={<PrivateRoute role="admin"><AdminCourseContentPage /></PrivateRoute>} />
        <Route path="/admin/course/section/add/:courseId" element={<PrivateRoute role="admin"><AdminCourseSectionAddPage /></PrivateRoute>} />
        <Route path="/admin/course/section/edit" element={<PrivateRoute role="admin"><AdminCourseSectionEditPage /></PrivateRoute>} />
        <Route path="/admin/dashboard/courses" element={<PrivateRoute role="admin"><AdminCoursesPage /></PrivateRoute>} />
        <Route path="/admin/dashboard/students" element={<PrivateRoute role="admin"><AdminStudentPage /></PrivateRoute>} />
        <Route path="/admin/dashboard/course/add" element={<PrivateRoute role="admin"><AdminCourseAddPage /></PrivateRoute>} />
        <Route path="/admin/dashboard/course/edit/:id" element={<PrivateRoute role="admin"><AdminCourseEditPage /></PrivateRoute>} />
        <Route path="/admin/dashboard/course/assign/users" element={<PrivateRoute role="admin"><AdminAssignUsers /></PrivateRoute>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;