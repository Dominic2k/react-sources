import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import ClassDetail from '../pages/ClassDetail';
import SubjectDetail from '../pages/SubjectDetail';
import StudentProfile from '../pages/Profile/StudentProfile';

const AppRoutes = () => (
  <Routes>
    <Route path='/studentProfile' element={<StudentProfile/>}/>
    <Route path="/" element={<Home />} />
    <Route path="/class/:classId" element={<ClassDetail />} />
    <Route path="/subject/:subjectId" element={<SubjectDetail />} />
    <Route path="/about" element={<About />} />
  </Routes>
);

export default AppRoutes;
