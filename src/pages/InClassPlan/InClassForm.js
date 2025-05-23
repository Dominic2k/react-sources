// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './InClassForm.css';

// function InClassForm() {
//   const [date, setDate] = useState('');
//   const [module, setModule] = useState('IT English');
//   const [lesson, setLesson] = useState('');
//   const [difficultyLevel, setDifficultyLevel] = useState('');
//   const [difficulties, setDifficulties] = useState('');
//   const [plan, setPlan] = useState('');
//   const [solved, setSolved] = useState('Yes');
//   const [notes, setNotes] = useState('');

//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const subjectId = queryParams.get('subjectId');

//   const handleReset = () => {
//     setDate('');
//     setModule('IT English');
//     setLesson('');
//     setDifficultyLevel('');
//     setDifficulties('');
//     setPlan('');
//     setSolved('Yes');
//     setNotes('');
//   };

//   const handleSave = async () => {
//     if (!date || !difficultyLevel || !lesson) {
//       alert('Please fill all required fields.');
//       return;
//     }

//     const data = {
//       date,
//       skills_module: module,
//       lesson_summary: lesson,
//       self_assessment: difficultyLevel,
//       difficulties_faced: difficulties,
//       improvement_plan: plan,
//       problem_solved: solved === 'Yes',
//       additional_notes: notes,
//     };

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://127.0.0.1:8000/api/student/subject/${subjectId}/in-class-plans`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Server error: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       alert('Saved successfully!');
//       navigate(`/subject/${subjectId}`);
//     } catch (error) {
//       console.error('Error saving entry:', error);
//       alert(`Failed to save entry: ${error.message}`);
//     }
//   };

//   return (
//     <div className="student-journal-container">
//       <h2 className="title">IN-CLASS PLAN</h2>
//       <form className="journal-form">
//         <div className="form-group">
//           <label>Date</label>
//           <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>

//         <div className="form-group">
//           <label>Skills/Module</label>
//           <select value={module} onChange={(e) => setModule(e.target.value)}>
//             <option value="IT English">IT English</option>
//             <option value="TOEIC">TOEIC</option>
//             <option value="SPEAKING">SPEAKING</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>My lesson - What did I learn?</label>
//           <input type="text" value={lesson} onChange={(e) => setLesson(e.target.value)} />
//         </div>

//         <div className="form-group">
//           <label>Self-assessment</label>
//           <div className="radio-group">
//             <label><input type="radio" name="difficulty" value="1" onChange={(e) => setDifficultyLevel(e.target.value)} /> 1. I need more practice</label>
//             <label><input type="radio" name="difficulty" value="2" onChange={(e) => setDifficultyLevel(e.target.value)} /> 2. I sometimes find this difficult</label>
//             <label><input type="radio" name="difficulty" value="3" onChange={(e) => setDifficultyLevel(e.target.value)} /> 3. No problem!</label>
//           </div>
//         </div>

//         <div className="form-group">
//           <label>My difficulties</label>
//           <input type="text" value={difficulties} onChange={(e) => setDifficulties(e.target.value)} />
//         </div>

//         <div className="form-group">
//           <label>My plan</label>
//           <input type="text" value={plan} onChange={(e) => setPlan(e.target.value)} />
//         </div>

//         <div className="form-group">
//           <label>Problem solved</label>
//           <select value={solved} onChange={(e) => setSolved(e.target.value)}>
//             <option>Yes</option>
//             <option>Not Yet</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Additional Notes</label>
//           <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
//         </div>

//         <div className="button-group">
//           <button type="button" onClick={handleSave} className="save-button">Save</button>
//           <button type="button" onClick={handleReset} className="reset-button">Reset</button>
//           {subjectId && (
//             <button type="button" onClick={() => navigate(`/subject/${subjectId}`)} className="back-button">
//               Back to Subject
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default InClassForm;
