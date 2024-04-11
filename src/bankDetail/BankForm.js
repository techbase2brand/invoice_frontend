import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import InvoiceIcon from "../components/Icons/InvoiceIcon";
import PageTitle from "../components/Common/PageTitle";
import BankList from "./BankList";

function InvoiceListScreen() {
    const navigate = useNavigate();

    const goToNewInvoice = useCallback(() => {
        navigate("/add-data");
    }, [navigate]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row flex-wrap p-4">
                <div className="sm:mr-4">
                    <PageTitle title="Bank Detail" />
                </div>
                <div className="flex-1">
                    <Button onClick={goToNewInvoice} block={1} size="sm" style={{
                        width: 'fit-content',
                        float: 'right'
                    }}>
                        <InvoiceIcon />
                        <span className="inline-block ml-2"> Add Bank Detail </span>
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap">
                <div className="w-full px-4 mb-4 sm:mb-1">
                    <BankList showAdvanceSearch />
                </div>
            </div>
        </div>
    );
}

export default InvoiceListScreen;
