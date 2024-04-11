import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from 'react-router-dom';
const BankList = () => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const apiUrl = `http://localhost:3000/api/bank-data`;
        axios.get(apiUrl)
            .then((response) => {
                setData(response.data.data.reverse())
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/delete-detail/${id}`);
            setData(data.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting bank detail:', error);
        }
    };
    return (
        <div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Bank Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Acc. No
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Acc. Type
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Branch Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Ifsc Code
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Swift Code
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Acc. Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Trade Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item._id}>
                                <td className="px-6 py-4">
                                    {item.bankName || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {item.accNo || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {item.accType || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {item.BranchName || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {item.ifscCode || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {item.swiftCode || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {item.accName || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {item.tradeName || "N/A"}
                                </td>
                                <td style={{ display: 'flex', gap: '20px' }}>
                                    <Link to={`/add-data/${item._id}`}>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="feather feather-edit" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </span>
                                    </Link>
                                    <span onClick={() => handleDelete(item._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 16 16">
                                            <path d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.328125 3.671875 14 4.5 14 L 10.5 14 C 11.328125 14 12 13.328125 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 5 5 L 6 5 L 6 12 L 5 12 Z M 7 5 L 8 5 L 8 12 L 7 12 Z M 9 5 L 10 5 L 10 12 L 9 12 Z"></path>
                                        </svg>
                                    </span>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BankList