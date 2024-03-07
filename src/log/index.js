import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react'
import './index.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import countries from '../countries.json';


const Index = () => {
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        gst: '',
        country: '',
        address: '',
        town: '',
        postcode: '',
        phone: '',
        email: '',
        invoice: '',
        placeOfSupply: '',
        tradeName: '',
        accNo: '',
        bankName: '',
        branchName: '',
        ifscCode: '',
        swiftCode: '',
    });

    useEffect(() => {
        if (id) {
            const apiUrl = `http://localhost:3000/api/invoice/${id}`;
            axios.get(apiUrl)
                .then((response) => {
                    const invoiceData = response.data.data;
                    setFormData(invoiceData);
                    setSelectedCountry(invoiceData.country);
                })
                .catch((error) => {
                    console.error('Error fetching invoice details:', error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const apiUrl = id ? `http://localhost:3000/api/update-invoice/${id}` : 'http://localhost:3000/api/invoice';
            const method = id ? 'put' : 'post';

            const uniqueIdentifier = Math.floor(Math.random() * 1000000);
            const currentYear = new Date().getFullYear();
            const invoiceNumber = `U72900PB${currentYear}PTC${uniqueIdentifier}`;
            const updatedFormData = { ...formData, country: selectedCountry, invoice: invoiceNumber };
            const response = await axios[method](apiUrl, updatedFormData);
            console.log('Response:', response.data);

            toast.success(id ? 'Updated successfully!' : 'Created successfully!', {
                position: 'top-right',
            });
            navigate("/table");
        } catch (error) {
            toast.error('Error while updating tasks.', {
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="title">
                <h2>Invoice Form</h2>
            </div>
            <div className="d-flex">
                <form action="" method="">
                    <label>
                        <span className="fname">First Name <span className="required">*</span></span>
                        <input type="text" name="firstName" onChange={handleChange} value={formData.firstName} />
                    </label>
                    <label>
                        <span className="lname">Last Name <span className="required">*</span></span>
                        <input type="text" name="lastName" onChange={handleChange} value={formData.lastName} />
                    </label>
                    <label>
                        <span>Company Name <span className="required">*</span></span>
                        <input type="text" name="company" onChange={handleChange} value={formData.company} />
                    </label>
                    <label style={{ display: 'flex' }}>
                        GST: <input type="checkbox" id="myCheck" />
                    </label>
                    <label>
                        <span>Gst No<span className="required">*</span></span>
                        <input type="text" name="gst" onChange={handleChange} value={formData.gst} />
                    </label>
                    <label>
                        <span>Country <span className="required">*</span></span>
                        <select name="country"  onChange={handleCountryChange}>
                            <option value="select">Select a country...</option>
                            {countries.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Address <span className="required">*</span></span>
                        <input type="text" name="address" placeholder="Address" required onChange={handleChange} value={formData.address} />
                    </label>
                    <label>
                        <span>Town / City <span className="required">*</span></span>
                        <input type="text" name="town" onChange={handleChange} value={formData.town} />
                    </label>
                    <label>
                        <span>Postcode / ZIP <span className="required">*</span></span>
                        <input type="text" name="postcode" onChange={handleChange} value={formData.postcode} />
                    </label>
                    <label>
                        <span>Phone <span className="required">*</span></span>
                        <input type="tel" name="phone" onChange={handleChange} value={formData.phone} />
                    </label>
                    <label>
                        <span>Email Address <span className="required">*</span></span>
                        <input type="email" name="email" onChange={handleChange} value={formData.email} />
                    </label>
                </form>
                <div className="Yorder">
                    <label>
                        <span className="lname">Place of Supply<span className="required">*</span></span>
                        <input type="text" name="placeOfSupply" onChange={handleChange} value={formData.placeOfSupply} />
                    </label>

                    <h2 className='bank-detail'>Bank Details</h2>
                    <label>
                        <span>Trade Name</span>
                        <input type="text" name="tradeName" onChange={handleChange} value={formData.tradeName} />
                    </label>
                    <label>
                        <span>Acc. No</span>
                        <input type="text" name="accNo" onChange={handleChange} value={formData.accNo} />
                    </label>
                    <label>
                        <span className="fname">Bank Name<span className="required">*</span></span>
                        <input type="text" name="bankName" onChange={handleChange} value={formData.bankName} />
                    </label>
                    <label>
                        <span className="lname">Branch Name <span className="required">*</span></span>
                        <input type="text" name="branchName" onChange={handleChange} value={formData.branchName} />
                    </label>
                    <label>
                        <span>Ifsc Code</span>
                        <input type="text" name="ifscCode" onChange={handleChange} value={formData.ifscCode} />
                    </label>
                    <label>
                        <span>Swift Code</span>
                        <input type="text" name="swiftCode" onChange={handleChange} value={formData.swiftCode} />
                    </label>
                    <button type="button" onClick={handleSubmit} disabled={loading}>
                        {/* {loading ? 'Submitting...' : 'Submit'} */}
                        {id ? "Update" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Index