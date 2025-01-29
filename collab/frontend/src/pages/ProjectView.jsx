import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProjectView.css';

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className="project-view-container">Loading...</div>;
  if (error) return <div className="project-view-container">{error}</div>;
  if (!project) return <div className="project-view-container">Project not found</div>;

  return (
    <div className="project-view-container">
      <h1 className="project-title">{project.title}</h1>
      <div className="project-tags">
        <span className="tag category">{project.category}</span>
        <span className="tag status">{project.status}</span>
        <span className="tag location">{project.location}</span>
      </div>
      <div className="project-description">
        <h2>Description</h2>
        <p>{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectView;