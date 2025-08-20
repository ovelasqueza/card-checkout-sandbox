import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentStep, clearTransaction } from '../store/slices/transactionSlice';
import { updateProductStock } from '../store/slices/productsSlice';
import { clearCustomer } from '../store/slices/customerSlice';

const PaymentResultPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentTransaction, quantity, error } = useAppSelector((state) => state.transaction);
  const { selectedProduct } = useAppSelector((state) => state.products);
  const [countdown, setCountdown] = useState(5);

  const isSuccess = currentTransaction?.status === 'success';
  const isFailed = currentTransaction?.status === 'failed' || error;

  useEffect(() => {
    dispatch(setCurrentStep(4));
  }, [dispatch]);

  useEffect(() => {
    // Si el pago fue exitoso, actualizar el stock
    if (isSuccess && selectedProduct && quantity > 0) {
      dispatch(updateProductStock({
        productId: selectedProduct.id,
        quantity: quantity
      }));
    }
  }, [isSuccess, selectedProduct, quantity, dispatch]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleReturnToProducts();
    }
  }, [countdown]);

  const handleReturnToProducts = () => {
    dispatch(clearTransaction());
    dispatch(clearCustomer());
    dispatch(setCurrentStep(1));
    navigate('/products');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const generateOrderNumber = () => {
    return `ORD-${Date.now().toString().slice(-8)}`;
  };

  if (isSuccess) {
    return (
      <div className="page-container">
        <div className="result-container success">
          <div className="result-icon">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
          </div>
          
          <div className="result-content">
            <h1>¡Pago Exitoso!</h1>
            <p className="result-message">
              Tu compra ha sido procesada correctamente.
            </p>
            
            <div className="order-details">
              <h3>Detalles del Pedido</h3>
              <div className="detail-row">
                <span>Número de orden:</span>
                <span className="order-number">{generateOrderNumber()}</span>
              </div>
              {selectedProduct && (
                <>
                  <div className="detail-row">
                    <span>Producto:</span>
                    <span>{selectedProduct.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Cantidad:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span>Total pagado:</span>
                    <span className="total-amount">
                      {formatPrice(selectedProduct.price * quantity)}
                    </span>
                  </div>
                </>
              )}
              <div className="detail-row">
                <span>Fecha:</span>
                <span>{new Date().toLocaleDateString('es-CO')}</span>
              </div>
            </div>
            
            <div className="next-steps">
              <h4>¿Qué sigue?</h4>
              <ul>
                <li>📧 Recibirás un email de confirmación</li>
                <li>📦 Tu pedido será preparado para envío</li>
                <li>🚚 Te notificaremos cuando esté en camino</li>
              </ul>
            </div>
          </div>
          
          <div className="result-actions">
            <div className="countdown">
              Redirigiendo en {countdown} segundos...
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleReturnToProducts}
            >
              Volver a Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="page-container">
        <div className="result-container error">
          <div className="result-icon">
            <div className="error-x">
              <div className="x-mark">
                <span className="x-line x-line-left"></span>
                <span className="x-line x-line-right"></span>
                <div className="x-circle"></div>
              </div>
            </div>
          </div>
          
          <div className="result-content">
            <h1>Error en el Pago</h1>
            <p className="result-message">
              No pudimos procesar tu pago. Por favor, intenta nuevamente.
            </p>
            
            <div className="error-details">
              <h3>¿Qué pasó?</h3>
              <p className="error-reason">
                {error || 'Hubo un problema con el procesamiento del pago. Esto puede deberse a:'}
              </p>
              <ul className="error-causes">
                <li>Datos de tarjeta incorrectos</li>
                <li>Fondos insuficientes</li>
                <li>Problemas de conectividad</li>
                <li>Error temporal del sistema</li>
              </ul>
            </div>
            
            <div className="help-section">
              <h4>¿Necesitas ayuda?</h4>
              <p>Si el problema persiste, contacta a nuestro equipo de soporte:</p>
              <div className="contact-info">
                <span>📞 +57 1 234 5678</span>
                <span>📧 soporte@tienda.com</span>
              </div>
            </div>
          </div>
          
          <div className="result-actions">
            <div className="countdown">
              Redirigiendo en {countdown} segundos...
            </div>
            <div className="action-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/checkout')}
              >
                Intentar de Nuevo
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleReturnToProducts}
              >
                Volver a Productos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de carga/procesamiento
  return (
    <div className="page-container">
      <div className="result-container processing">
        <div className="result-icon">
          <div className="processing-spinner">
            <div className="spinner"></div>
          </div>
        </div>
        
        <div className="result-content">
          <h1>Procesando Pago...</h1>
          <p className="result-message">
            Por favor espera mientras procesamos tu transacción.
          </p>
          
          <div className="processing-steps">
            <div className="step active">
              <span className="step-icon">✓</span>
              <span>Validando datos</span>
            </div>
            <div className="step active">
              <span className="step-icon">⏳</span>
              <span>Procesando pago</span>
            </div>
            <div className="step">
              <span className="step-icon">⏸</span>
              <span>Confirmando transacción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;