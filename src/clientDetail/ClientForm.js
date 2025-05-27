import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import InvoiceIcon from "../components/Icons/InvoiceIcon";
import PageTitle from "../components/Common/PageTitle";
import ClientList from "./ClientList";

function ClientForm() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    
    const goToNewInvoice = useCallback(() => {
        navigate("/add-Client");
    }, [navigate]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    return (
        <div>
            <div className="flex justify-between p-4">
                <div className="sm:mr-4">
                    <PageTitle title="Client Detail" />
                </div>
                    <div className="flex gap-3">
                     <div className="relative w-full">
                    <svg
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="20"
                        height="20"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                        />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search"
                        className="w-full pl-12 pr-4 py-5 border border-gray-500 rounded-md focus:outline-none"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    </div>

                    <Button onClick={goToNewInvoice} block={1} size="sm" style={{
                         width: '250px', height:'40px'
                    }}>
                        <InvoiceIcon />
                        <span className="inline-block ml-2"> Add Client Detail </span>
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-4 sm:mb-1">
                    <ClientList  searchQuery={searchQuery} showAdvanceSearch />
                </div>
            </div>
        </div>
    );
}

export default ClientForm;
