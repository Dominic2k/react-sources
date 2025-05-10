import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelfStudyPlan from './pages/SelfStudyPlan';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/self-study/:className" element={<SelfStudyPlan />} />
        </Routes>
    </Router>
  );
}

export default App;
