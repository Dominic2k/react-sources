import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SubjectDetail from '../pages/SubjectDetail';
import ShowInClassPlan from '../pages/InClassPlan/ShowInClassPlan';
import { Navigate } from 'react-router-dom';
import StudentProfile from '../pages/Profile/StudentProfile';
import SetDeadline from '../pages/Deadline/SetDealine';
import LoginForm from '../pages/Auth/Login';
import Logout from '../pages/Auth/Logout';
import AchievementPage from '../pages/Achievement/AchievementPage';
import ActivityLogs from '../pages/Admin/ActivityLogs/ActivityLogs';
import Subjects from '../pages/Admin/Subjects/Subjects';
// Import Admin pages
import StudentList from '../pages/Admin/Students/StudentList';
import StudentForm from '../pages/Admin/Students/StudentForm';
import ClassList from '../pages/Admin/Classes/ClassList';
import ClassForm from '../pages/Admin/Classes/ClassForm';
import Teachers from '../pages/Admin/Teachers/Teachers';
// Xóa import StudentProfile trùng lặp nếu có

// Import Teacher pagespages
import TeacherClasses from '../pages/TeacherClasses';
import ClassStudentList from '../pages/ClassStudentList';

import StudentProfileTeacherView from '../pages/StudentProfileTeacherView';

const AppRoutes = () => (
  <Routes>
    {/* Student Routes */}
    <Route path='student/profile' element={<StudentProfile/>}/>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/subject/:subjectId" element={<SubjectDetail />} />
    <Route path="/in-class-plan" element={<Navigate to="/student-journal" />} />
    <Route path="/showinclassPlan" element={<ShowInClassPlan/>} />
    <Route path="/achievements" element={<AchievementPage/>}/>

    {/* Admin Routes */}
    <Route path="/admin/students" element={<StudentList />} />
    <Route path="/admin/students/create" element={<StudentForm />} />
    <Route path="/admin/students/edit/:id" element={<StudentForm />} />
    <Route path="/admin/classes" element={<ClassList />} />
    <Route path="/admin/classes/create" element={<ClassForm />} />
    <Route path="/admin/classes/edit/:id" element={<ClassForm />} />
    <Route path="/admin/activity-logs" element={<ActivityLogs />} />
    <Route path="/admin/teachers" element={<Teachers />} />
    <Route path="/admin/subjects" element={<Subjects />} />

    <Route path="/teacher/:teacherId/classes" element={<TeacherClasses />} />
    <Route path="/classes/:classId/students" element={<ClassStudentList />} />

    <Route path="/teacher/student-profile/:studentId" element={<StudentProfileTeacherView />} />

  </Routes>
);

export default AppRoutes;
