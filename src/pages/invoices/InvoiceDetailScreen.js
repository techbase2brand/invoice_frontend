import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { defaultInputSmStyle, validError } from '../../constants/defaultStyles';

const FormCli = () => {
  const [formData, setFormData] = useState({
    trade: '',
    ifsc: '',
    panNo: '',
    gstNo: '',
    signature: '',
    companylogo: '',
  });
  const [logo, setLogo] = useState({
    name: '',
    companylogo: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [enableGST, setEnableGST] = useState(false);
  const [img, setImg] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCompanyDetail(id);
      setImg(false);
    }
  }, [id]);

  const fetchCompanyDetail = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-company/${id}`);
      const bankDetailData = response.data.data;
      setFormData(bankDetailData);
    } catch (error) {
      console.error('Error fetching bank detail:', error);
    }
  };

  const handleCheckboxChange = (event) => {
    setEnableGST(event.target.checked); // Update the state when the checkbox is checked/unchecked
  };

  // const handleImageUpload = async (e) => {
  //   setImg(true);
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('image', file);

  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload-image`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     const imageUrl = response.data.imageUrl;
  //     setFormData(prevFormData => ({ ...prevFormData,name: 'Signature', signature: imageUrl }));
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

  // const handleLogoUpload = async (e) => {
  //   setImg(true);
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('image', file);

  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload-companylogo`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     const imageUrl = response.data.imageUrl;
  //     // setLogo(prevFormData => ({ ...prevFormData,name : 'Arti',signature: imageUrl }));
  //     setLogo(prevFormData => ({ ...prevFormData, name: 'SAI Legal', companylogo: imageUrl }));
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formErrors = {};
  //   const fieldsToValidate = ["trade"];
  //   fieldsToValidate.forEach((field) => {
  //     if (!formData[field].trim()) {
  //       formErrors[field] = `Please add ${field}`;
  //     }
  //   });

  //   if (Object.keys(formErrors).length > 0) {
  //     setError(formErrors);
  //   } else {
  //     try {
  //       let response;
  //       if (id) {
  //         response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-comp-data/${id}`, formData);
  //       } else {
  //         response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-companyData`, formData);
  //       }
  //       if (response.status === 201 || response.status === 200) {
  //         navigate("/listing")
  //       }
  //     } catch (error) {
  //       console.error('Error in Axios request:', error);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    const fieldsToValidate = ["trade"];
    fieldsToValidate.forEach((field) => {
      // Check if formData[field] is defined before calling trim()
      if (formData[field] && !formData[field].trim()) {
        formErrors[field] = `Please add ${field}`;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setError(formErrors);
    } else {
      try {
        let response;
        if (id) {
          response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update-comp-data/${id}`, formData);
        } else {
          response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-companyData`, formData);
        }
        if (response.status === 201 || response.status === 200) {
          navigate("/listing");
        }
      } catch (error) {
        console.error('Error in Axios request:', error);
      }
    }
  };


  return (
    <div>
      <div className="flex-1">
        <div className="font-title font-bold text-sm my-3">Add Company Detail</div>
        <form onSubmit={handleSubmit}>
          <div className="client-form-wrapper sm:w-1/2">
            <div
              className="text-sm mb-4"
            >
              <label className="block text-sm font-medium text-gray-700">Trade Name</label>
              <input
                type='text'
                placeholder="Trade Name"
                name='trade'
                value={formData.trade}
                className={`${defaultInputSmStyle} ${error.trade && validError}`}
                onChange={handleChange}
              />
            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">IFSC</label>
              <input
                type='text'
                placeholder="ifsc Name"
                name='ifsc'
                value={formData.ifsc}
                className={defaultInputSmStyle}
                onChange={handleChange}
              />

            </div>
            <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Pan No</label>
              <input
                type="panNo"
                placeholder="panNo"
                name='panNo'
                value={formData.panNo}
                className={defaultInputSmStyle}
                onChange={handleChange}
              />
            </div>
            {/* <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Signature</label>
              {formData && formData.signature && (
                <div className="mb-2">
                  {!img &&
                    <img src={`http://localhost:8000${formData.signature}`} alt="Current Signature" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  }
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div> */}
            <div className="client-form-wrapper sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700">ADD GST</label>
              <input type='checkbox' onChange={handleCheckboxChange} />
            </div>
            {enableGST &&
              <div className="text-sm mb-4"
              >
                <label className="block text-sm font-medium text-gray-700">GST</label>
                <input
                  type='text'
                  placeholder="GST No"
                  name='gstNo'
                  value={formData.gstNo}
                  className={defaultInputSmStyle}
                  onChange={handleChange}
                />
              </div>
            }
            {/* <div className="text-sm mb-4">
              <label className="block text-sm font-medium text-gray-700">Company logo</label>
              {formData && formData.companylogo && (
                <div className="mb-2">
                  {!img &&
                    <img src={`http://localhost:8000${formData.companylogo}`} alt="Current Signature" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  }
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div> */}
            <div className="mt-3">
              <button type="submit" class="primary-background-color w-full text-white   hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" >{id ? "Update" : "Sumbit"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormCli;