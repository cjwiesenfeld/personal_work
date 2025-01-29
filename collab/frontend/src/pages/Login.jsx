import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '' // Add this line
  });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const endpoint = isRegistering ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
        const response = await axios.post(endpoint, formData);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // Store user data if needed
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
                    {isRegistering && (
            <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={isRegistering}
                />
            </div>
            )}
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <div className="mt-4 text-center">
            <button
                type="button"
                onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setFormData({ email: '', password: '', name: '' });
                }}
                className="text-blue-500 hover:text-blue-600"
            >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Login;