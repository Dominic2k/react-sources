import React from 'react';


function AchievementItem({
  image,
  title,
  description,
  subjectName,
  date,
  semester,
  onDelete,
  onEdit
}) {
  return (
    <div className="achievement-item">
    <img src={image} alt="achievement" className="achievement-image" />
  <div className="achievement-info">
    <table>
      <tbody>
        <tr>
          <td>Title:</td>
          <td>{title}</td>
        </tr>
        <tr>
          <td>Description:</td>
          <td>{description}</td>
        </tr>
        <tr>
          <td>Subject:</td>
          <td>{subjectName}</td>
        </tr>
        <tr>
          <td>Date:</td>
          <td>{date}</td>
        </tr>
        <tr>
          <td>Semester:</td>
          <td>{semester}</td>
        </tr>
      </tbody>
    </table>
   <div className="button-group">
    <button onClick={onDelete} className="delete-button">Delete</button>
    <button onClick={onEdit} className="delete-button">Edit</button>
  </div>
  </div>
</div>

  );
}

export default AchievementItem;
