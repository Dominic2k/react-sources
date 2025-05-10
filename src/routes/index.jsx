import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import ClassDetail from '../pages/ClassDetail';
import SubjectDetail from '../pages/SubjectDetail';
import StudentJournalPage from '../pages/StudentJournalPage';
import { Navigate } from 'react-router-dom';
import SelfStudyPlan from '../pages/StudyPlan/SelfStudyPlan';


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/class/:classId" element={<ClassDetail />} />
    <Route path="/subject/:subjectId" element={<SubjectDetail />} />
    <Route path="/about" element={<About />} />


    <Route path="/in-class-plan" element={<Navigate to="/student-journal" />} />
    <Route path="/student-journal" element={<StudentJournalPage />} />
      
    <Route path="/self-study/:className" element={<SelfStudyPlan />} />
  </Routes>
);

export default AppRoutes;
