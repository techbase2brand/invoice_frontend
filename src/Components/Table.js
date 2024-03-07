import React, { useEffect, useState } from 'react'
import './index.css'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Modal, Button } from "antd";

const Table = () => {
    const [invoices, setInvoices] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);


    useEffect(() => {
        const apiUrl = 'http://localhost:3000/api/invoices';
        axios.get(apiUrl)
            .then((response) => {
                setInvoices(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, [deleteInvoiceId]);

    const handleDelete = async () => {
        try {
            if (!deleteInvoiceId) {
                console.error('Invalid invoice ID for deletion');
                return;
            }
            const apiUrl = `http://localhost:3000/api/delete-invoice/${deleteInvoiceId}`;
            await axios.delete(apiUrl);

            console.log(`Invoice with ID ${deleteInvoiceId} deleted successfully`);
            setDeleteInvoiceId(null);
            setDeleteModalVisible(false);
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };

    const handleCancelDelete = () => {
        setDeleteInvoiceId(null);
        setDeleteModalVisible(false);
    };

    return (
        <div>
            <div className="title-table">
                <Link to="/invoice">
                    <button type="button" className="btn btn-primary">+ Add Invoice</button>
                </Link>
                <h2>INVOICES</h2>
            </div>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Company Name</th>
                        <th scope="col">Gst No</th>
                        <th scope="col">Country</th>
                        <th scope="col">Address</th>
                        <th scope="col">Town / City</th>
                        <th scope="col">Postcode / ZIP</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Email</th>
                        <th scope="col">Invoice No</th>
                        <th scope="col">Place of Supply</th>
                        <th scope="col">Trade Name</th>
                        <th scope="col">Acc. No</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Branch Name</th>
                        <th scope="col">Ifsc Code</th>
                        <th scope="col">Swift Code</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice._id}>
                            <td>{invoice.firstName}</td>
                            <td>{invoice.lastName}</td>
                            <td>{invoice.company}</td>
                            <td>{invoice.gst}</td>
                            <td>{invoice.country}</td>
                            <td>{invoice.address}</td>
                            <td>{invoice.town}</td>
                            <td>{invoice.postcode}</td>
                            <td>{invoice.phone}</td>
                            <td>{invoice.email}</td>
                            <td>{invoice.invoice}</td>
                            <td>{invoice.placeOfSupply}</td>
                            <td>{invoice.tradeName}</td>
                            <td>{invoice.accNo}</td>
                            <td>{invoice.bankName}</td>
                            <td>{invoice.branchName}</td>
                            <td>{invoice.ifscCode}</td>
                            <td>{invoice.swiftCode}</td>
                            <td>
                                <Link to={`/invoice/${invoice._id}`}>
                                    <button type="button" className="btn btn-primary">Edit</button>
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setDeleteInvoiceId(invoice._id);
                                        setDeleteModalVisible(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                title="Confirm Delete"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={handleCancelDelete}
                footer={[
                    <Button key="back" onClick={handleCancelDelete}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleDelete}>
                        Delete
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete this invoice?</p>
            </Modal>

        </div>
    )
}

export default Table