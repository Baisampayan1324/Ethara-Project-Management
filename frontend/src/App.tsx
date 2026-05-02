import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Placeholder Pages
const Dashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card p-6 border-l-4 border-primary-500">
        <p className="text-slate-500 text-sm font-medium">Active Projects</p>
        <p className="text-3xl font-bold mt-1">12</p>
      </div>
      <div className="card p-6 border-l-4 border-yellow-500">
        <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
        <p className="text-3xl font-bold mt-1">24</p>
      </div>
      <div className="card p-6 border-l-4 border-green-500">
        <p className="text-slate-500 text-sm font-medium">Completed</p>
        <p className="text-3xl font-bold mt-1">158</p>
      </div>
    </div>
  </div>
);

import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

const MyTasks = () => <div className="text-2xl font-bold">My Assigned Tasks</div>;
const Team = () => <div className="text-2xl font-bold">Team Management</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><Dashboard /></Layout>} path="/" />
            <Route element={<Layout><Projects /></Layout>} path="/projects" />
            <Route element={<Layout><ProjectDetail /></Layout>} path="/projects/:id" />
            <Route element={<Layout><MyTasks /></Layout>} path="/my-tasks" />
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route element={<Layout><Team /></Layout>} path="/team" />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
