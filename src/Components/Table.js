import React from 'react'
import './index.css'
import { Link } from 'react-router-dom'
const Table = () => {
    return (
        <div>
            <div className="title-table">
                <Link to="/invoice">
                    <button type="button" className="btn btn-primary">+ Add Invoice</button>
                </Link>
                <h2>INVOICES</h2>
            </div>
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Company Name</th>
                        <th scope="col">Gst No</th>
                        <th scope="col">Country</th>
                        <th scope="col">Address</th>
                        <th scope="col">Town / City</th>
                        <th scope="col">State / County</th>
                        <th scope="col">Postcode / ZIP</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Email Address</th>
                        <th scope="col">Invoice No</th>
                        <th scope="col">Place of Supply</th>
                        <th scope="col">Trade Name</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Branch Name</th>
                        <th scope="col">Ifsc Code</th>
                        <th scope="col">Swift Code</th>
                        <th scope="col">Open Invoice</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>B2b</td>
                        <td>f123h</td>
                        <td>india</td>
                        <td>mohali</td>
                        <td>chandigarh</td>
                        <td>8752587541</td>
                        <td>ramnish@gmail.com</td>
                        <td>45464556</td>
                        <td>data</td>
                        <td>bitcoin</td>
                        <td>state bank of india</td>
                        <td>SBI</td>
                        <td>@mdo</td>
                        <td>Sbi5678</td>
                        <td>465465415</td>
                        <td>654564</td>
                        <td>
                            <Link to="/invoice-detail">
                            <button type="button" className="btn btn-primary">open</button>
                            </Link>
                            </td>
                            
                        <td><button type="button" className="btn btn-danger">Delete</button></td>

                    </tr>
                    <tr>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>B2b</td>
                        <td>f123h</td>
                        <td>india</td>
                        <td>mohali</td>
                        <td>chandigarh</td>
                        <td>8752587541</td>
                        <td>ramnish@gmail.com</td>
                        <td>45464556</td>
                        <td>data</td>
                        <td>bitcoin</td>
                        <td>state bank of india</td>
                        <td>SBI</td>
                        <td>@mdo</td>
                        <td>Sbi5678</td>
                        <td>465465415</td>
                        <td>654564</td>
                        <td>
                            <button type="button" className="btn btn-primary">open</button></td>
                        <td><button type="button" className="btn btn-danger">Delete</button></td>
                    </tr>
                    <tr>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>B2b</td>
                        <td>f123h</td>
                        <td>india</td>
                        <td>mohali</td>
                        <td>chandigarh</td>
                        <td>8752587541</td>
                        <td>ramnish@gmail.com</td>
                        <td>45464556</td>
                        <td>data</td>
                        <td>bitcoin</td>
                        <td>state bank of india</td>
                        <td>SBI</td>
                        <td>@mdo</td>
                        <td>Sbi5678</td>
                        <td>465465415</td>
                        <td>654564</td>
                        <td>
                            <button type="button" className="btn btn-primary">open</button></td>
                        <td><button type="button" className="btn btn-danger">Delete</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table