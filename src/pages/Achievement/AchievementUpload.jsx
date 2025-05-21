import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './AchievementPage.css';

const MAX_SIZE = 5 * 1024 * 1024;

function AchievementUpload({ isOpen, onClose, onSubmit }) {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classSubjectId, setClassSubjectId] = useState('');
  const [achievementDate, setAchievementDate] = useState('');
  const [semester, setSemester] = useState('');

  const classSubjects = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Web Programming' },
    { id: 3, name: 'Database' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setImage(null);
      setError('');
      setTitle('');
      setDescription('');
      setClassSubjectId('');
      setAchievementDate('');
      setSemester('');
    }
  }, [isOpen]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError('');
    if (fileRejections.length > 0) {
      const reason = fileRejections[0].errors[0].message;
      setError(reason);
      return;
    }

    const file = acceptedFiles[0];
    if (file.size > MAX_SIZE) {
      setError('File too large. Max size is 5MB.');
      return;
    }

    setImage(Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: MAX_SIZE,
    maxFiles: 1
  });

  const handleSubmit = async () => {
  setError('');

  if (!image || !title || !description || !classSubjectId || !achievementDate || !semester) {
    setError('Please fill in all fields and upload an image.');
    return;
  }

  const formData = new FormData();
  formData.append('file_url', image);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('class_subject_id', classSubjectId);
  formData.append('achievement_date', achievementDate);
  formData.append('semester', semester);
  try {

    const response = await fetch('http://127.0.0.1:8000/api/achievements', {
      method: 'POST',
      headers: {  
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Đặt token ở đây
      },
      body: formData
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      const errorData = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
      throw new Error(errorData.message || 'Something went wrong!');
    }

    const result = await response.json();
    onSubmit(result);
    onClose();
  } catch (err) {
    setError(err.message || 'Upload failed.');
  }
};
          

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="upload-title">Upload Your Achievement</h3>

        {/* Upload ảnh */}
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
          <input {...getInputProps()} />
          <p>{isDragActive ? 'Thả ảnh vào đây...' : 'Kéo & thả ảnh vào hoặc nhấn để chọn'}</p>
        </div>

        {image && (
          <div className="image-preview-container">
            <img src={image.preview} alt="Preview" className="image-preview" />
          </div>
        )}

        {/* Form nhập thông tin */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="caption-input"
        />

        <select
          value={classSubjectId}
          onChange={(e) => setClassSubjectId(e.target.value)}
          className="input-field"
        >
          <option value="">-- Choose Subject --</option>
          {classSubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={achievementDate}
          onChange={(e) => setAchievementDate(e.target.value)}
          className="input-field"
        />

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="input-field"
        >
          <option value="">-- Choose Semester --</option>
          {[1, 2, 3, 4, 5].map((sem) => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>

        {error && <p className="error-text">{error}</p>}

        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default AchievementUpload;
