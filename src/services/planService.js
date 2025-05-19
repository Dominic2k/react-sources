export const fetchSelfStudyPlans = async (classSubjectId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/self-study-plans`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.data;
};

export const createSelfStudyPlan = async (classSubjectId, planData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/self-study-plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planData),
  });
  const data = await response.json();
  return data;
};

export const updateSelfStudyPlan = async (classSubjectId, planId, planData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/self-study-plans/${planId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planData),
  });
  const data = await response.json();
  return data;
};

export const deleteSelfStudyPlan = async (classSubjectId, planId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/self-study-plans/${planId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export const fetchInClassPlans = async (classSubjectId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/in-class-plans`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.data;
};

export const createInClassPlan = async (classSubjectId, planData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/in-class-plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planData),
  });
  const data = await response.json();
  return data;
};

export const updateInClassPlan = async (classSubjectId, planId, planData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/in-class-plans/${planId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planData),
  });
  const data = await response.json();
  return data;
};

export const deleteInClassPlan = async (classSubjectId, planId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/in-class-plans/${planId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}; 