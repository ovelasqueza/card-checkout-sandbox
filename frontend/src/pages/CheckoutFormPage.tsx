import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentStep, setQuantity, setPaymentData } from '../store/slices/transactionSlice';
import { updateCustomerField } from '../store/slices/customerSlice';
import { Customer, PaymentData } from '../types';

const CheckoutFormPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct } = useAppSelector((state) => state.products);
  const { quantity } = useAppSelector((state) => state.transaction);
  const { currentCustomer } = useAppSelector((state) => state.customer);

  const [customerData, setCustomerData] = useState<Customer>({
    name: currentCustomer?.name || '',
    email: currentCustomer?.email || '',
    phone: currentCustomer?.phone || '',
    address: currentCustomer?.address || '',
    city: currentCustomer?.city || '',
    zipCode: currentCustomer?.zipCode || '',
  });

  const [paymentData, setPaymentDataLocal] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(setCurrentStep(2));
    if (!selectedProduct) {
      navigate('/products');
    }
  }, [dispatch, selectedProduct, navigate]);

  const handleCustomerChange = (field: keyof Customer, value: string) => {
    const updatedData = { ...customerData, [field]: value };
    setCustomerData(updatedData);
    dispatch(updateCustomerField(updatedData));
  };

  const handlePaymentChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-');
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentDataLocal({ ...paymentData, [field]: formattedValue });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar datos del cliente
    if (!customerData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!customerData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!customerData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!customerData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!customerData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!customerData.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';

    // Validar datos de pago
    if (!paymentData.cardNumber.replace(/\D/g, '')) {
      newErrors.cardNumber = 'El número de tarjeta es requerido';
    } else if (paymentData.cardNumber.replace(/\D/g, '').length < 16) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }
    
    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'La fecha de expiración es requerida';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/YY)';
    }
    
    if (!paymentData.cvv) {
      newErrors.cvv = 'El CVV es requerido';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido';
    }
    
    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'El nombre del titular es requerido';
    }

    // Validar cantidad
    if (quantity < 1) newErrors.quantity = 'La cantidad debe ser mayor a 0';
    if (selectedProduct && quantity > selectedProduct.stock) {
      newErrors.quantity = 'Cantidad no disponible en stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(setPaymentData(paymentData));
      dispatch(setCurrentStep(3));
      navigate('/summary');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!selectedProduct) {
    return null;
  }

  const totalAmount = selectedProduct.price * quantity;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Información de Compra</h1>
        <p>Completa tus datos para continuar</p>
      </header>

      <div className="product-summary">
        <h3>Producto seleccionado</h3>
        <div className="selected-product">
          <div className="product-info">
            <h4>{selectedProduct.name}</h4>
            <p>{selectedProduct.description}</p>
            <div className="quantity-selector">
              <label>Cantidad:</label>
              <div className="quantity-controls">
                <button 
                  type="button"
                  onClick={() => quantity > 1 && dispatch(setQuantity(quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  type="button"
                  onClick={() => quantity < selectedProduct.stock && dispatch(setQuantity(quantity + 1))}
                  disabled={quantity >= selectedProduct.stock}
                >
                  +
                </button>
              </div>
            </div>
            <div className="price-summary">
              <span>Precio unitario: {formatPrice(selectedProduct.price)}</span>
              <span className="total">Total: {formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
        {errors.quantity && <span className="error">{errors.quantity}</span>}
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-section">
          <h3>Datos de Entrega</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                type="text"
                value={customerData.name}
                onChange={(e) => handleCustomerChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleCustomerChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleCustomerChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group full-width">
              <label>Dirección *</label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => handleCustomerChange('address', e.target.value)}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Ciudad *</label>
              <input
                type="text"
                value={customerData.city}
                onChange={(e) => handleCustomerChange('city', e.target.value)}
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>Código Postal *</label>
              <input
                type="text"
                value={customerData.zipCode}
                onChange={(e) => handleCustomerChange('zipCode', e.target.value)}
                className={errors.zipCode ? 'error' : ''}
              />
              {errors.zipCode && <span className="error">{errors.zipCode}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Datos de Pago (Simulado)</h3>
          <div className="payment-notice">
            <p>⚠️ Esta es una simulación. No uses datos reales de tarjeta.</p>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Número de tarjeta *</label>
              <input
                type="text"
                placeholder="1234-5678-9012-3456"
                value={paymentData.cardNumber}
                onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                className={errors.cardNumber ? 'error' : ''}
              />
              {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
            </div>

            <div className="form-group">
              <label>Fecha de expiración *</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                className={errors.expiryDate ? 'error' : ''}
              />
              {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
            </div>

            <div className="form-group">
              <label>CVV *</label>
              <input
                type="text"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                className={errors.cvv ? 'error' : ''}
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>

            <div className="form-group full-width">
              <label>Nombre del titular *</label>
              <input
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                className={errors.cardholderName ? 'error' : ''}
              />
              {errors.cardholderName && <span className="error">{errors.cardholderName}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/products')}
          >
            Volver
          </button>
          <button type="submit" className="btn btn-primary">
            Continuar al Resumen
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutFormPage;