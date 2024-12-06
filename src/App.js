import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateUser from './pages/CreateUser';
import LogoutPage from './pages/LogoutPage';
import RecoveryPage from './pages/RecoveryPage';
import CalendarPage from './pages/CalendarPage';
import MessagePage from './pages/MessagePage';
import TaskForm from './components/TaskForm';
import SecurityQuestionDropdown from './components/SecurityQuestionDropdown';
import Layout from './components/Layout'; // A wrapper component for common UI layout

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/forgot" element={<RecoveryPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* Protected routes (requires login) */}
          <Route element={<Layout />}> {/* Use Layout for common UI (e.g., Navbar, Footer) */}
            <Route path="/home/:userID" element={<HomePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/tasks/create" element={<TaskForm />} />
            <Route path="/security-questions" element={<SecurityQuestionDropdown />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
