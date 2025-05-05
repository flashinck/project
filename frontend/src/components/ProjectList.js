import React, { useState, useEffect } from 'react';

const ProjectList = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch('/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setProjects(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/projects/${editingId}` : '/projects';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
    setName('');
    setDescription('');
    setEditingId(null);
    fetchProjects();
  };

  const handleEdit = (project) => {
    setName(project.name);
    setDescription(project.description);
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    await fetch(`/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {editingId ? 'Update' : 'Create'} Project
        </button>
      </form>
      <ul className="border rounded">
        {projects.map((project) => (
          <li key={project.id} className="p-2 border-b flex justify-between">
            <span>{project.name}: {project.description}</span>
            <div>
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-500 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
