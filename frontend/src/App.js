import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import ReportList from './components/ReportList';
import './styles/index.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white text-lg font-bold">Project Management</Link>
            <div>
              {token ? (
                <>
                  <Link to="/projects" className="text-white mx-2">Projects</Link>
                  <Link to="/tasks" className="text-white mx-2">Tasks</Link>
                  <Link to="/reports" className="text-white mx-2">Reports</Link>
                  <button onClick={handleLogout} className="text-white mx-2">Logout</button>
                </>
              ) : (
                <Link to="/login" className="text-white">Login</Link>
              )}
            </div>
          </div>
        </nav>
        <Switch>
          <Route path="/login">
            <LoginForm setToken={setToken} />
          </Route>
          <PrivateRoute path="/projects" component={ProjectList} token={token} />
          <PrivateRoute path="/tasks" component={TaskList} token={token} />
          <PrivateRoute path="/reports" component={ReportList} token={token} />
          <Route path="/">
            <div className="container mx-auto p-4">
              <h1 className="text-3xl font-bold">Welcome</h1>
              <p>Please log in to manage projects and tasks.</p>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

const PrivateRoute = ({ component: Component, token, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      token ? <Component {...props} token={token} /> : <Redirect to="/login" />
    }
  />
);

export default App;
