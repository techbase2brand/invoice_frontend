import React, { useEffect } from 'react';
import "./index.css"
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import axios from 'axios';
function Sign() {
    console.log("hlo");
    // useEffect(() => {
    //     axios.get('http://localhost:3000/products/get/admin')
    //         .then(response => {
    //             console.log("hhh",response.data.message);
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // }, []);
    
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
                            <input type="text" name="lname" className='input-fix' />
                        </label>
                        <label>
                            <span>Password<span className="required">*</span></span>
                            <input type="text" name="cn" className='input-fix' />
                        </label>
                        <div className='text-center text-md-start mt-4 pt-2'>
                            <Link to="/table">
                                <button type="button" className="btn btn-primary">Login</button>
                            </Link>
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