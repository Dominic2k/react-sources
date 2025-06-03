import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_SIZE = 5 * 1024 * 1024;

function AchievementUpload({ isOpen, onClose, onSubmit, achievementToEdit }) {
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
    if (isOpen) {
      if (achievementToEdit) {
        setTitle(achievementToEdit.title || '');
        setDescription(achievementToEdit.description || '');
        setClassSubjectId(achievementToEdit.class_subject_id || '');
        setAchievementDate(achievementToEdit.achievement_date || '');
        setSemester(achievementToEdit.semester || '');
        if (achievementToEdit.file_url) {
          setImage({ preview: achievementToEdit.file_url, isFile: false });
        } else {
          setImage(null);
        }
      } else {
        setImage(null);
        setTitle('');
        setDescription('');
        setClassSubjectId('');
        setAchievementDate('');
        setSemester('');
        setError('');
      }
    } else {
      setImage(null);
      setError('');
      setTitle('');
      setDescription('');
      setClassSubjectId('');
      setAchievementDate('');
      setSemester('');
    }
  }, [isOpen, achievementToEdit]);

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

    // Check if all required fields are filled
    if (!title || !description || !classSubjectId || !achievementDate || !semester) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }

    // Check if an image is uploaded for a new achievement
    if (!achievementToEdit && (!image || !image instanceof File)) {
        setError('Vui lòng tải lên ảnh cho thành tích.');
        return;
    }

    const formData = new FormData();
    // Only append file_url if a new file is selected or if it's an update and a file exists
    if (image && image instanceof File) {
      formData.append('file_url', image);
    } else if (achievementToEdit && achievementToEdit.file_url && !image) {
      // Keep existing file_url if no new file is selected during update
       // Note: Backend might need to handle updates without a new file differently
       // This frontend code assumes backend can handle not receiving file_url on PUT if not changed
       // Or you might need to send the old file_url string if backend requires it
       // For now, we won't append old file_url string as backend expects file for file_url field
    }

    formData.append('title', title);
    formData.append('description', description);
    formData.append('class_subject_id', classSubjectId);
    formData.append('achievement_date', achievementDate);
    formData.append('semester', semester);

    // Handle PUT method for updates - FormData with PUT can be tricky
    // A common workaround is to use POST with _method=PUT
    let method = 'POST';
    let url = 'http://127.0.0.1:8000/api/achievements';
    if (achievementToEdit && achievementToEdit.id) {
      method = 'POST'; // Use POST method for update workaround
      url = `http://127.0.0.1:8000/api/achievements/${achievementToEdit.id}?_method=PUT`; // Append _method=PUT
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // 'Content-Type': 'multipart/form-data' is usually added automatically for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text(); 
        // Attempt to parse JSON error first, fall back to text
        try {
          const errorJson = JSON.parse(errorData);
          // Check if there's a message or errors field in the JSON response
          if (errorJson.message) {
              throw new Error(errorJson.message);
          } else if (errorJson.errors) {
              // If backend returns validation errors object
              const validationErrors = Object.values(errorJson.errors).flat().join('\n');
              throw new Error('Validation failed:\n' + validationErrors);
          } else {
              throw new Error('Cập nhật thất bại: ' + errorData); // Fallback with status text
          }
        } catch (parseError) {
            // If response is not JSON, throw error with text data
            throw new Error('Cập nhật thất bại: ' + errorData);
        }
      }

      const result = await response.json();
      onSubmit(result);
      onClose();

    } catch (err) {
      setError(err.message || 'Cập nhật thất bại.');
      console.error('Error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="upload-title">{achievementToEdit ? 'Edit Achievement' : 'Upload Your Achievement'}</h3>

        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
          <input {...getInputProps()} />
          <p>{isDragActive ? 'Thả ảnh vào đây...' : 'Kéo & thả ảnh vào hoặc nhấn để chọn'}</p>
        </div>

        {image && (
          <div className="image-preview-container">
            {/* Render image based on whether it's a File object (new) or a URL string (existing) */}
            <img src={image.isFile === false ? image.preview : URL.createObjectURL(image)} alt="Preview" className="image-preview" />
          </div>
        )}

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
          <button onClick={handleSubmit}>{achievementToEdit ? 'Update' : 'Submit'}</button>
        </div>
      </div>
    </div>
  );
}

export default AchievementUpload;

