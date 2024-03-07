import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/template', formData);

      if (response.status === 201) {
        navigate("/")
      } else if (response.status === 400) {
        console.log('Email ID already exists');
      } else {
        console.error('Error creating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error in Axios request:', error);
    }
  };

  return (
    <div className="container">
      <div className="title">
        <h2>SignUp Form</h2>
      </div>
      <div className="d-flex">
        <form onSubmit={handleSubmit}>
          <label>
            <span className="fname">First Name <span className="required">*</span></span>
            <input type="text" name="firstName" onChange={handleChange} />
          </label>
          <label>
            <span className="lname">Last Name <span className="required">*</span></span>
            <input type="text" name="lastName" onChange={handleChange} />
          </label>
          <label>
            <span>Phone <span className="required">*</span></span>
            <input type="tel" name="phone" onChange={handleChange} />
          </label>
          <label>
            <span>Email Address <span className="required">*</span></span>
            <input type="email" name="email" onChange={handleChange} />
          </label>
          <label>
            <span>Password <span className="required">*</span></span>
            <input type="password" name="password" onChange={handleChange} />
          </label>
          <label>
            <span>Confirm Password <span className="required">*</span></span>
            <input type="password" name="confirmPassword" onChange={handleChange} />
          </label>
          <input type="submit" className="signUp-btn" />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
