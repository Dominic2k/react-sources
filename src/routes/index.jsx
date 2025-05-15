import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import ClassDetail from '../pages/ClassDetail';
import SubjectDetail from '../pages/SubjectDetail';
import SelfStudyPlan from '../pages/StudyPlan/SelfStudyPlan';
import InClassForm from '../pages/InClassForm';
import ShowInClassForm from '../pages/ShowInClassForm';
import StudentProfile from '../pages/Profile/StudentProfile';
import { Navigate } from 'react-router-dom';
import AchievementPage from '../pages/Achievement/AchievementPage';

const AppRoutes = () => (
  <Routes>
    <Route path='/studentProfile' element={<StudentProfile/>}/>
    <Route path="/" element={<Home />} />
    <Route path="/class/:classId" element={<ClassDetail />} />
    <Route path="/subject/:subjectId" element={<SubjectDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/self-study/:className" element={<SelfStudyPlan />} />

    <Route path="/in-class-form" element={<InClassForm />} />

    <Route path="/showinclassform" element={<ShowInClassForm/>} />
     <Route path="/achievement" element ={<AchievementPage/>}/>
  </Routes>
);

export default AppRoutes;
