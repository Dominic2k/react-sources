import React, { useState } from 'react';
import axios from 'axios';

const SelfStudyFormModal = ({subjectId, onClose, onSuccess }) => {
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [lesson, setLesson] = useState('');
    const [time, setTime] = useState('');
    const [resources, setResources] = useState('');
    const [activities, setActivities] = useState('');
    const [concentration, setConcentration] = useState('Yes');
    const [planFollow, setPlanFollow] = useState('Not sure');
    const [evaluation, setEvaluation] = useState('');
    const [reinforcing, setReinforcing] = useState('');
    
    const handleReset = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setLesson('');
        setTime('');
        setResources('');
        setActivities('');
        setConcentration('Yes');
        setPlanFollow('Not sure');
        setEvaluation('');
        setReinforcing('');
    }

    const handleSubmit = async (e) => {
        
        const data = {
            date,
            lesson: lesson,
            time: time,
            resources: resources,
            activities: activities,
            concentration: concentration,
            plan_follow: planFollow,
            evaluation: evaluation,
            reinforcing: reinforcing,
            student_id: localStorage.getItem('user_id')
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/student/subject/${subjectId}/self-study-plans`, { 
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', response.status, errorText);
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Saved entry:', result);
            alert('Saved successfully!');
      
            if (onSuccess) onSuccess();
        } catch (error) {
        console.error('Error saving entry:', error);
        alert(`Failed to save entry: ${error.message}`);
        }
    };

    return (
        <div className="self-study-form-modal">
        <form className="study-plan-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="lesson">My lesson - What did I learn?</label>
                <input type="text" id="lesson" name="lesson" value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder="Enter what you learned" required />
            </div>
            <div className="form-row">
                <div className="form-group half">
                    <label htmlFor="time">Time</label>
                    <input type="text" id="time" name="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 2 hours" required/>
                </div>
                <div className="form-group half">
                    <label htmlFor="resources">Learning resources</label>
                    <textarea id="resources" name="resources" rows="2" value={resources} onChange={(e) => setResources(e.target.value)} placeholder="Books, websites, etc." />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="activities">Learning activities</label>
                <textarea id="activities" name="activities" rows="2" value={activities} onChange={(e) => setActivities(e.target.value)} placeholder="What activities did you do?" />
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label htmlFor="concentration">Concentration</label>
                    <select id="concentration" name="concentration" value={concentration} onChange={(e) => setConcentration(e.target.value)} >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div className="form-group half">
                    <label htmlFor="planFollow">Plan & follow plan</label>
                    <select id="planFollow" name="planFollow" value={planFollow} onChange={(e) => {setPlanFollow(e.target.value)}} >
                        <option value="Not sure">Not sure</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="evaluation">Evaluation of my work</label>
                <textarea id="evaluation" name="evaluation" rows="2" value={evaluation} onChange={(e) => setEvaluation(e.target.value)} placeholder="How would you evaluate your work?" />
            </div>

            <div className="form-group">
                <label htmlFor="reinforcing">Reinforcing learning</label>
                <textarea id="reinforcing" name="reinforcing" rows="2" value={reinforcing} onChange={(e) => setReinforcing(e.target.value)} placeholder="How will you reinforce what you learned?" />
            </div>
            <div className="button-group">
                <button type="submit" className="save-button">Save</button>
                <button type="button" onClick={handleReset} className="reset-button">Reset</button>
                <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
            </div>
        </form>
        </div>
    );
};

export default SelfStudyFormModal;
