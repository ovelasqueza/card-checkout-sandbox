import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import ProductListPage from './pages/ProductListPage';
import CheckoutFormPage from './pages/CheckoutFormPage';
import PaymentSummaryPage from './pages/PaymentSummaryPage';
import PaymentResultPage from './pages/PaymentResultPage';
import './App.css';

function App() {
  const currentStep = useAppSelector((state) => state.transaction.currentStep);

  return (
    <div className="app">
      <div className="app-container">
        <div className="progress-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          <div className="step-indicators">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`step ${currentStep >= step ? 'active' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/checkout" element={<CheckoutFormPage />} />
          <Route path="/summary" element={<PaymentSummaryPage />} />
          <Route path="/result" element={<PaymentResultPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
