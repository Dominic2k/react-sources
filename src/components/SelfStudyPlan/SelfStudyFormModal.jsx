import React, { useState } from 'react';
import axios from 'axios';




const SelfStudyFormModal = ({ studentId, subjectId, onClose, onSuccess }) => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    module: '',
    lesson: '',
    time: '',
    resources: '',
    activities: '',
    concentration: 'Yes',
    planFollow: 'Not sure',
    evaluation: '',
    reinforcing: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      module: '',
      lesson: '',
      time: '',
      resources: '',
      activities: '',
      concentration: 'Yes',
      planFollow: 'Not sure',
      evaluation: '',
      reinforcing: '',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      subject_id: subjectId,
      date: today,
      module: formData.module,
      lesson: formData.lesson,
      time: formData.time,
      resources: formData.resources,
      activities: formData.activities,
      concentration: formData.concentration,
      plan_follow: formData.planFollow,
      evaluation: formData.evaluation,
      reinforcing: formData.reinforcing,
      notes: formData.notes,
    };

    try {
      await axios.post(`http://127.0.0.1:8000/api/student/subjects/${subjectId}/self-study-plans`, payload);
      alert('Study plan saved successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error response:', error.response?.data);
      alert('Failed to save study plan');
    }
  };

  return (
    <div className="self-study-form-modal">
      <form className="study-plan-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="module">Module</label>
          <input 
          type="text"
            id="module"
            name="module"
            value={formData.module}
            onChange={handleChange}
            required
            placeholder="What are you studied today?"
            />
        </div>

        <div className="form-group">
          <label htmlFor="lesson">My lesson - What did I learn?</label>
          <input 
            type="text" 
            id="lesson" 
            name="lesson" 
            value={formData.lesson} 
            onChange={handleChange} 
            placeholder="Enter what you learned"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="time">Time I</label>
            <input 
              type="text" 
              id="time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              placeholder="e.g. 2 hours"
            />
          </div>
          <div className="form-group half">
            <label htmlFor="resources">Learning resources</label>
            <textarea
              id="resources"
              name="resources"
              rows="2"
              value={formData.resources}
              onChange={handleChange}
              placeholder="Books, websites, etc."
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="activities">Learning activities</label>
          <textarea 
            id="activities" 
            name="activities" 
            rows="2" 
            value={formData.activities} 
            onChange={handleChange}
            placeholder="What activities did you do?"
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="concentration">Concentration</label>
            <select 
              id="concentration" 
              name="concentration" 
              value={formData.concentration} 
              onChange={handleChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="form-group half">
            <label htmlFor="planFollow">Plan & follow plan</label>
            <select 
              id="planFollow" 
              name="planFollow" 
              value={formData.planFollow} 
              onChange={handleChange}
            >
              <option value="Not sure">Not sure</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="evaluation">Evaluation of my work</label>
          <textarea 
            id="evaluation" 
            name="evaluation" 
            rows="2" 
            value={formData.evaluation} 
            onChange={handleChange}
            placeholder="How would you evaluate your work?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reinforcing">Reinforcing learning</label>
          <textarea 
            id="reinforcing" 
            name="reinforcing" 
            rows="2" 
            value={formData.reinforcing} 
            onChange={handleChange}
            placeholder="How will you reinforce what you learned?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea 
            id="notes" 
            name="notes" 
            rows="2" 
            value={formData.notes} 
            onChange={handleChange}
            placeholder="Notes"
          />
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
