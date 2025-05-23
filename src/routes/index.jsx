import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SubjectDetail from '../pages/SubjectDetail';
import SelfStudyPlan from '../pages/StudyPlan/SelfStudyPlan';
import InClassForm from '../pages/InClassPlan/InClassForm';
import ShowInClassForm from '../pages/InClassPlan/ShowInClassForm';
import { Navigate } from 'react-router-dom';
import StudentProfile from '../pages/Profile/StudentProfile';
import ViewSelfStudyPlan from '../pages/StudyPlan/ViewSelfStudyPlanTable';

import LoginForm from '../pages/Auth/Login';
import Logout from '../pages/Auth/Logout';
import AchievementPage from '../pages/Achievement/AchievementPage';

// Import Admin pages
import StudentList from '../pages/Admin/Students/StudentList';
import StudentForm from '../pages/Admin/Students/StudentForm';
import ClassList from '../pages/Admin/Classes/ClassList';
import ClassForm from '../pages/Admin/Classes/ClassForm';
import { useNavigate } from 'react-router-dom';
// Xóa import StudentProfile trùng lặp nếu có

// Import Teacher pagespages
import TeacherClasses from '../pages/TeacherClasses';
import ClassStudentList from '../pages/ClassStudentList';


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
    {/* <Route path="/student-journal" element={<StudentJournalPage />} /> */}
      
    <Route path="/self-study-plans/create" element={<SelfStudyPlan />} />
    <Route path="/subjects/:subjectId/self-study-plans" element={<ViewSelfStudyPlan />} />
    <Route path="/in-class-form" element={<InClassForm />} />
    <Route path="/showinclassform" element={<ShowInClassForm/>} />
    <Route path="/achievements" element={<AchievementPage/>}/>

    {/* Admin Routes */}
    <Route path="/admin/students" element={<StudentList />} />
    <Route path="/admin/students/create" element={<StudentForm />} />
    <Route path="/admin/students/edit/:id" element={<StudentForm />} />
    <Route path="/admin/classes" element={<ClassList />} />
    <Route path="/admin/classes/create" element={<ClassForm />} />
    <Route path="/admin/classes/edit/:id" element={<ClassForm />} />


    <Route path="/teacher/:teacherId/classes" element={<TeacherClasses />} />
    <Route path="/classes/:classId/students" element={<ClassStudentList />} />

  </Routes>
);

export default AppRoutes;
