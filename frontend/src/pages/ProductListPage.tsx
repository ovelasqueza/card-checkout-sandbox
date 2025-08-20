import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, selectProduct } from '../store/slices/productsSlice';
import { setCurrentStep, clearTransaction } from '../store/slices/transactionSlice';
import { Product } from '../types';

const ProductListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(setCurrentStep(1));
    dispatch(clearTransaction());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSelectProduct = (product: Product) => {
    if (product.stock > 0) {
      dispatch(selectProduct(product));
      dispatch(setCurrentStep(2));
      navigate('/checkout');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Error al cargar productos</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => dispatch(fetchProducts())}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Selecciona un Producto</h1>
        <p>Elige el producto que deseas comprar</p>
      </header>

      <div className="products-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`product-card ${
              product.stock === 0 ? 'out-of-stock' : 'available'
            }`}
            onClick={() => handleSelectProduct(product)}
          >
            <div className="product-image">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="placeholder-image">
                  <span>📦</span>
                </div>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-details">
                <div className="price">
                  <span className="price-label">Precio:</span>
                  <span className="price-value">{formatPrice(product.price)}</span>
                </div>
                
                <div className="stock">
                  <span className="stock-label">Stock:</span>
                  <span className={`stock-value ${
                    product.stock === 0 ? 'no-stock' : 
                    product.stock < 5 ? 'low-stock' : 'in-stock'
                  }`}>
                    {product.stock === 0 ? 'Agotado' : `${product.stock} disponibles`}
                  </span>
                </div>
              </div>
              
              <button 
                className={`btn ${
                  product.stock === 0 ? 'btn-disabled' : 'btn-primary'
                }`}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Agotado' : 'Seleccionar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <h2>No hay productos disponibles</h2>
          <p>Vuelve más tarde para ver nuestros productos</p>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;