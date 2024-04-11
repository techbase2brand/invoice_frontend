import { Route, Routes, Navigate, BrowserRouter, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import DashboardScreen from "./pages/DashboardScreen";
import InvoiceListScreen from "./pages/invoices/InvoiceListScreen";
import InvoiceDetailScreen from "./pages/invoices/InvoiceDetailScreen";
import Container from "./components/Container/Container";
import useInitApp from "./hook/useInitApp";
import ClientDeleteConfirm from "./components/Clients/ClientDeleteConfirm";
import ClientEditModal from "./components/Clients/ClientEditModal";
import ProductDeleteConfirm from "./components/Product/ProductDeleteConfirm";
import ProductEditModal from "./components/Product/ProductEditModal";
import ClientChooseModal from "./components/Clients/ClientChooseModal";
import ProductChoosenModal from "./components/Product/ProductChoosenModal";
import InvoiceSettingModal from "./components/Invoice/InvoiceSettingModal";
import InvoiceConfirmModal from "./components/Invoice/InvoiceConfirmModal";
import InvoiceDeleteConfirm from "./components/Invoice/InvoiceDeleteConfirm";
import PageLoading from "./components/Common/PageLoading";
import BankForm from "./bankDetail/BankForm";
import ClientForm from "./clientDetail/ClientForm";
import Form from "./bankDetail/Form";
import FormCli from "./clientDetail/FormCli";
import ProForm from "./Project/proForm";
import ProjectForm from "./Project/ProjectForm";
import Login from "./user/Login";
import SignUp from "./user/SignUp";
import Invoice from "./FinalInvoice/Invoice";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in!");
    setTimeout(() => {
      navigate("/login");
    }, 0)


    return null;
  }
  return <>{children}</>;
};

const App = () => {
  const { initialSetData } = useInitApp();

  useEffect(() => {
    initialSetData();
  }, []);

  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Sign-up" element={<SignUp />} />
          <Route path="/bank-Detail" element={<ProtectedRoute><BankForm /></ProtectedRoute>} />
          <Route path="/client-Detail" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
          <Route path="/project-Detail" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
          <Route path="/add-data" element={<ProtectedRoute><Form /></ProtectedRoute>} />
          <Route path="/add-data/:id" element={<ProtectedRoute><Form /></ProtectedRoute>} />
          <Route path="/project" element={<ProtectedRoute><ProForm /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProForm /></ProtectedRoute>} />
          <Route path="/add-Client" element={<ProtectedRoute><FormCli /></ProtectedRoute>} />
          <Route path="/add-Client/:id" element={<ProtectedRoute><FormCli /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/invoice-detail/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="/company/:id" element={<ProtectedRoute><InvoiceDetailScreen /></ProtectedRoute>} />
          {/* <Route path="company"> */}
          <Route path="listing" element={<ProtectedRoute><InvoiceListScreen /></ProtectedRoute>} exact />
          <Route path="company" element={<ProtectedRoute><InvoiceDetailScreen /></ProtectedRoute>} />
          {/* </Route> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <ToastContainer />
      <ClientDeleteConfirm />
      <ClientEditModal />
      <ClientChooseModal />
      <ProductDeleteConfirm />
      <ProductEditModal />
      <ProductChoosenModal />
      <InvoiceSettingModal />
      <InvoiceConfirmModal />
      <InvoiceDeleteConfirm />
      <PageLoading />
    </BrowserRouter>
  );
};

export default App;
