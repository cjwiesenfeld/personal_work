import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getProjects } from '../api/projects';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    location: 'all',
    sortBy: 'random'
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);
  const navigate = useNavigate();
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Add the missing handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || project.category === filters.category;
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesLocation = filters.location === 'all' || project.location === filters.location;
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  if (loading) return <div className="dashboard-container">Loading...</div>;
  if (error) return <div className="dashboard-container">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <Search className="search-icon" />
      </div>

      <div className="filters-container">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="ml">ML</option>
          <option value="react">React</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="trading">Trading</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="random">Random</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">All Locations</option>
          <option value="onsite">On-Site</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      <div className="projects-grid">
      {filteredProjects.map(project => (
        <div 
            key={project._id || project.id} 
            className="project-card"
            onClick={() => navigate(`/project/${project._id}`)}
            style={{ cursor: 'pointer' }}
        >
            <h3 className="project-title">{project.title}</h3>
            <div className="tags-container">
            <span className="category-tag">{project.category}</span>
            <span className="status-tag">{project.status}</span>
            <span className="location-tag">{project.location}</span>
            </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;