import {React} from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import SubjectDetail from '../pages/SubjectDetail';
import SelfStudyPlan from '../pages/StudyPlan/SelfStudyPlan';
import InClassForm from '../pages/InClassForm';
import ShowInClassForm from '../pages/ShowInClassForm';
import { Navigate } from 'react-router-dom';
import StudentProfile from '../pages/Profile/StudentProfile';
import LoginForm from '../pages/Auth/Login';
import { useNavigate } from 'react-router-dom';

const AppRoutes = () => (

  <Routes>
    <Route path='/studentProfile' element={<StudentProfile/>}/>

    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />

    <Route path="/login" element={<LoginForm />} />

    <Route path="/subject/:subjectId" element={<SubjectDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/self-study/:className" element={<SelfStudyPlan />} />

    <Route path="/in-class-form" element={<InClassForm />} />

    <Route path="/showinclassform" element={<ShowInClassForm/>} />

  </Routes>
  
);
export default AppRoutes;
