import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Sign from './log/Sign'
import Table from './Components/Table'
import SignUp from './log/SignUp';
import Index from './log';
import FinalInvoice from './Components/FinalInvoice';
const App = () => {
  const logout = () => {
    if (window.confirm('Do you really want to logout?')) {
      localStorage.removeItem("token");
      window.location.href = '/';
    }
  };
  return (
    <div>
      <button type="button" className="btn btn-danger" style={{ float: 'right' }} onClick={logout}>Logout</button>
      <Router>
        <Routes>
          <Route path="/" element={<Sign />} />
          <Route path="/invoice" element={<Index />} />
          <Route path="/invoice/:id" element={<Index />} />
          <Route path="/table" element={<Table />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/invoice-detail" element={<FinalInvoice />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App