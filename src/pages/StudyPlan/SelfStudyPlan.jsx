// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { Sidebar, Header } from '../../components/layout';
// import axios from 'axios';
// import './SelfStudyPlan.css';

// const SelfStudyPlan = () => {
//   const { className, goalId } = useParams();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const subjectId = queryParams.get('subjectId');
  
//   const today = new Date().toISOString().split('T')[0];
//   const [formData, setFormData] = useState({
//     module: '',
//     lesson: '',
//     time: '',
//     resources: '',
//     activities: '',
//     concentration: 'Yes',
//     planFollow: 'Not sure',
//     evaluation: '',
//     reinforcing: '',
//   });

//   const [classNameFromAPI, setClassName] = useState('');
//   const navigate = useNavigate();

//   const handleGoToList = () => {
//     // Nếu có subjectId, quay lại trang subject detail
//     if (subjectId) {
//       navigate(`/subject/${subjectId}`);
//     } else {
//       navigate('/self-study-plans/');
//     }
//   };

// //   useEffect(() => {
// //     const fetchStudyPlan = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:8000/api/self-study-plans/`);
// //         const data = response.data;

// //         setFormData({
// //           lesson: data.lesson || '',
// //           time: data.time || '',
// //           resources: data.resources || '',
// //           activities: data.activities || '',
// //           concentration: data.concentration || 'Yes',
// //           planFollow: data.plan_follow || 'Not sure',
// //           evaluation: data.evaluation || '',
// //           reinforcing: data.reinforcing || '',
// //         });

// //       } catch (error) {
// //         console.warn('No existing study plan found or error fetching:', error);
// //       }
// //     };

// //     if (goalId) fetchStudyPlan();
// //   }, [goalId]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

//     const payload = {
//       goal_id: goalId,
//       class_name: formData.module,
//       date: today,
//       lesson: formData.lesson,
//       time: formData.time,
//       resources: formData.resources,
//       activities: formData.activities,
//       concentration: formData.concentration,
//       plan_follow: formData.planFollow,
//       evaluation: formData.evaluation,
//       reinforcing: formData.reinforcing,
//       subject_id: subjectId // Thêm subject_id vào payload
//     };

//     try {
//       await axios.post('http://127.0.0.1:8000/api/self-study-plans', payload);
//       alert('Study plan saved successfully!');
      
//       // Nếu có subjectId, quay lại trang subject detail
//       if (subjectId) {
//         navigate(`/subject/${subjectId}`);
//       }
//     } catch (error) {
//       console.error('Error response:', error.response?.data);
//       alert('Failed to save study plan');
//     }
//   };

// //   const handleReset = () => {
// //     setFormData({
// //       module: '',
// //       lesson: '',
// //       time: '',
// //       resources: '',
// //       activities: '',
// //       concentration: 'Yes',
// //       planFollow: 'Not sure',
// //       evaluation: '',
// //       reinforcing: '',
// //     });
// //   };

// //   return (
// //     <div className="layout">
// //       <div className="sidebar">
// //         <Sidebar />
// //       </div>
// //       <div className="content">
// //         <Header />
// //         <section className="content" aria-label="Study Plan Content">

// //           {/* Thêm nút để quay lại trang danh sách */}
// //           <button onClick={handleGoToList} className="btn-back">
// //             Back to List
// //           </button>

// //           <div className="btn-group" role="group" aria-label="Study mode selection">
// //             <div className="date-icon" style={{ marginLeft: 'auto' }}>
// //               <i className="fas fa-book" /> {today}
// //             </div>
// //           </div>

// //           <form className="study-plan-form" onSubmit={handleSubmit} onReset={handleReset}>
// //             <label htmlFor="module">Module</label>
// //             <select
// //               id="module"
// //               name="module"
// //               value={formData.module}
// //               onChange={handleChange}
// //             >
// //               <option value="">-- Choose a module --</option>
// //               <option value="IT English">IT English</option>
// //               <option value="Communication Skills">Communication Skills</option>
// //               <option value="Time Management">Time Management</option>
// //             </select>

// //             <label htmlFor="lesson">My lesson - What did I learn?</label>
// //             <input type="text" id="lesson" name="lesson" value={formData.lesson} onChange={handleChange} />

// //             <div className="form-row" style={{ marginTop: '12px' }}>
// //               <div className="half">
// //                 <label htmlFor="time">Time I</label>
// //                 <input type="text" id="time" name="time" value={formData.time} onChange={handleChange} />
// //               </div>
// //               <div className="half" style={{ maxWidth: '220px' }}>
// //                 <label htmlFor="resources">Learning resources</label>
// //                 <textarea
// //                   id="resources"
// //                   name="resources"
// //                   rows="3"
// //                   value={formData.resources}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>

// //             <label htmlFor="activities" style={{ marginTop: '12px' }}>Learning activities</label>
// //             <textarea id="activities" name="activities" rows="2" value={formData.activities} onChange={handleChange} />

// //             <div className="form-row">
// //               <div className="half">
// //                 <label htmlFor="concentration">Concentration</label>
// //                 <select id="concentration" name="concentration" value={formData.concentration} onChange={handleChange}>
// //                   <option>Yes</option>
// //                   <option>No</option>
// //                 </select>
// //               </div>
// //               <div className="half">
// //                 <label htmlFor="planFollow">Plan & follow plan</label>
// //                 <select id="planFollow" name="planFollow" value={formData.planFollow} onChange={handleChange}>
// //                   <option>Not sure</option>
// //                   <option>Yes</option>
// //                   <option>No</option>
// //                 </select>
// //               </div>
// //             </div>

// //             <label htmlFor="evaluation" style={{ marginTop: '12px' }}>Evaluation of my work</label>
// //             <textarea id="evaluation" name="evaluation" rows="2" value={formData.evaluation} onChange={handleChange} />

// //             <label htmlFor="reinforcing" style={{ marginTop: '12px' }}>Reinforcing learning</label>
// //             <textarea id="reinforcing" name="reinforcing" rows="2" value={formData.reinforcing} onChange={handleChange} />

// //             <div className="btn-actions">
// //               <button type="submit" className="btn-save">Save</button>
// //               <button type="reset" className="btn-reset">Reset</button>
// //             </div>
// //           </form>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SelfStudyPlan;
