import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentStep, createTransaction, processPayment } from '../store/slices/transactionSlice';
import { createCustomer } from '../store/slices/customerSlice';

const PaymentSummaryPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct } = useAppSelector((state) => state.products);
  const { quantity, paymentData, loading } = useAppSelector((state) => state.transaction);
  const { currentCustomer } = useAppSelector((state) => state.customer);

  useEffect(() => {
    dispatch(setCurrentStep(3));
    if (!selectedProduct || !currentCustomer || !paymentData) {
      navigate('/products');
    }
  }, [dispatch, selectedProduct, currentCustomer, paymentData, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleConfirmPayment = async () => {
    if (!selectedProduct || !currentCustomer || !paymentData) return;

    try {
      // Crear cliente si no existe
      let customerId = currentCustomer.id;
      if (!customerId) {
        const customerResult = await dispatch(createCustomer(currentCustomer)).unwrap();
        customerId = customerResult.id;
      }

      // Crear transacción
      const transactionData = {
        productId: selectedProduct.id,
        customerId,
        quantity,
        totalAmount: selectedProduct.price * quantity,
        status: 'pending' as const,
      };

      const transaction = await dispatch(createTransaction(transactionData)).unwrap();

      // Procesar pago
      await dispatch(processPayment({
        transactionId: transaction.id!,
        paymentData: {
          cardNumber: paymentData.cardNumber || '',
          expiryDate: paymentData.expiryDate || '',
          cvv: '***', // No enviar CVV real
          cardholderName: paymentData.cardholderName || '',
        }
      })).unwrap();

      navigate('/result');
    } catch (error) {
      console.error('Error en el pago:', error);
      navigate('/result');
    }
  };

  if (!selectedProduct || !currentCustomer || !paymentData) {
    return null;
  }

  const subtotal = selectedProduct.price * quantity;
  const shipping = 0; // Envío gratis
  const total = subtotal + shipping;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Resumen de Compra</h1>
        <p>Revisa tu pedido antes de confirmar</p>
      </header>

      <div className="summary-container">
        <section className="summary-section">
          <h3>Producto</h3>
          <div className="product-summary">
            <div className="product-details">
              <h4>{selectedProduct.name}</h4>
              <p>{selectedProduct.description}</p>
              <div className="quantity-price">
                <span>Cantidad: {quantity}</span>
                <span>Precio unitario: {formatPrice(selectedProduct.price)}</span>
              </div>
            </div>
            <div className="product-total">
              {formatPrice(subtotal)}
            </div>
          </div>
        </section>

        <section className="summary-section">
          <h3>Datos de Entrega</h3>
          <div className="delivery-info">
            <div className="info-row">
              <span className="label">Nombre:</span>
              <span className="value">{currentCustomer.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{currentCustomer.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Teléfono:</span>
              <span className="value">{currentCustomer.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">Dirección:</span>
              <span className="value">
                {currentCustomer.address}, {currentCustomer.city}, {currentCustomer.zipCode}
              </span>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <h3>Método de Pago</h3>
          <div className="payment-info">
            <div className="payment-method">
              <div className="card-info">
                <span className="card-icon">💳</span>
                <div className="card-details">
                  <span className="card-number">{paymentData.cardNumber}</span>
                  <span className="card-holder">{paymentData.cardholderName}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="summary-section total-section">
          <h3>Total</h3>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="price-row">
              <span>Envío:</span>
              <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
            </div>
            <div className="price-row total">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <div className="terms">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Acepto los términos y condiciones</span>
            </label>
            <p className="terms-text">
              Al confirmar tu compra, aceptas nuestros términos de servicio y política de privacidad.
              Esta es una transacción simulada para fines de demostración.
            </p>
          </div>
        </section>

        <section className="summary-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/checkout')}
            disabled={loading}
          >
            Volver a Editar
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Procesando...
              </>
            ) : (
              'Confirmar Pago'
            )}
          </button>
        </section>
      </div>
    </div>
  );
};

export default PaymentSummaryPage;