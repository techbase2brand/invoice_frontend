import React, { useState } from 'react';
import "./index.css"
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
function Sign() {
    const [login, setLogin] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate();
    const handleChange = (e) => {
        e.preventDefault();
        setLogin({ ...login, [e.target.name]: e.target.value })
    }
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email: login.email,
                password: login.password,
            });

            const token = response.data.token;

            localStorage.setItem('token', token);

            navigate('/table')
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    return (
        <MDBContainer fluid className="p-3 my-5 h-custom">

            <MDBRow>

                <MDBCol col='10' md='6'>
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
                </MDBCol>

                <MDBCol col='4' md='6'>

                    <div>
                        <img src="https://www.base2brand.com/wp-content/uploads/2021/01/logo-svg-01.png" alt="Company Logo" />
                    </div>

                    <div className="divider z-flex align-items-center my-4">
                        <h2 className="text-center fw-bold mx-3 mb-0">Invoice</h2>
                    </div>
                    <div className='log-form'>
                        <label>
                            <span className="lname">Email<span className="required">*</span></span>
                            <input type="text" name="email" className='input-fix' onChange={handleChange} />
                        </label>
                        <label>
                            <span>Password<span className="required">*</span></span>
                            <input type="text" name="password" className='input-fix' onChange={handleChange} />
                        </label>
                        <div className='text-center text-md-start mt-4 pt-2'>
                            <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
                            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <Link to="/sign-up" className="link-danger">Register</Link></p>
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>

            <div className="z-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                <div>
                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
                        <MDBIcon fab icon='facebook-f' size="md" />
                    </MDBBtn>
                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
                        <MDBIcon fab icon='twitter' size="md" />
                    </MDBBtn>
                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
                        <MDBIcon fab icon='google' size="md" />
                    </MDBBtn>
                    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
                        <MDBIcon fab icon='linkedin-in' size="md" />
                    </MDBBtn>
                </div>
            </div>
        </MDBContainer>
    );
}

export default Sign;