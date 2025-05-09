import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api'; // Thay đổi URL API base tùy theo môi trường

// Lấy danh sách môn học của học sinh
export const getStudentSubjects = async (studentId) => {
  try {
    const res = await axios.get(`${API_BASE}/student/${studentId}/subjects`);
    return res.data;
  } catch (error) {
    console.error('Error fetching student subjects:', error);
    throw error;
  }
};

// Lấy goals theo student_id và class_subject_id
export const getStudentSubjectGoals = async (studentId, classSubjectId) => {
  try {
    const res = await axios.get(`${API_BASE}/student/${studentId}/subject/${classSubjectId}/goals`);
    return res.data;
  } catch (error) {
    console.error('Error fetching student subject goals:', error);
    throw error;
  }
};

// Lấy goals theo class_id
export const getGoalsByClass = async (classId) => {
  try {
    const res = await axios.get(`${API_BASE}/class/${classId}/goals`);
    return res.data;
  } catch (error) {
    console.error('Error fetching class goals:', error);
    throw error;
  }
};

// Tạo goal mới
export const createGoal = async (goalData) => {
  try {
    const res = await axios.post(`${API_BASE}/goals`, goalData);
    return res.data;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

// Cập nhật goal
export const updateGoal = async (goalId, goalData) => {
  try {
    const res = await axios.put(`${API_BASE}/goals/${goalId}`, goalData);
    return res.data;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// Xóa goal
export const deleteGoal = async (goalId) => {
  try {
    const res = await axios.delete(`${API_BASE}/goals/${goalId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};
