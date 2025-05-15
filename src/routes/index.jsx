import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import SubjectDetail from '../pages/SubjectDetail';
import SelfStudyPlan from '../pages/StudyPlan/SelfStudyPlan';
import InClassForm from '../pages/InClassForm';
import ShowInClassForm from '../pages/ShowInClassForm';
import StudentProfile from '../pages/Profile/StudentProfile';
import { Navigate } from 'react-router-dom';
import StudentProfile from '../pages/Profile/StudentProfile';
import ViewSelfStudyPlan from '../pages/StudyPlan/ViewSelfStudyPlanTable';


const AppRoutes = () => (
  <Routes>
    <Route path='/studentProfile' element={<StudentProfile/>}/>
    <Route path="/" element={<Home />} />
    <Route path="/subject/:subjectId" element={<SubjectDetail />} />
    <Route path="/about" element={<About />} />


    <Route path="/in-class-plan" element={<Navigate to="/student-journal" />} />
    {/* <Route path="/student-journal" element={<StudentJournalPage />} /> */}
      

    <Route path="/self-study-plans/:className/:goalId" element={<SelfStudyPlan />} />
    <Route path="/self-study-plans" element={<ViewSelfStudyPlan />} />
    <Route path="/self-study-plans/create" element={<SelfStudyPlan />} />
    <Route path="/self-study/:className" element={<SelfStudyPlan />} />

    <Route path="/in-class-form" element={<InClassForm />} />

    <Route path="/showinclassform" element={<ShowInClassForm/>} />
  </Routes>
);

export default AppRoutes;
