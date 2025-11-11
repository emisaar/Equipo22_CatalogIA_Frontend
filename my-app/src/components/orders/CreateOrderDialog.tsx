import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Autocomplete,
} from '@mui/material';
import { OrderCreate, ProductResponse } from '../../types';
import { productService } from '../../services';

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (order: OrderCreate) => Promise<void>;
}

export const CreateOrderDialog: React.FC<CreateOrderDialogProps> = ({ open, onClose, onCreate }) => {
  const [productId, setProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For product search
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  // Load products when dialog opens
  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await productService.listProducts({ limit: 100 });
      setProducts(data.products);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar los productos');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      setError('Por favor selecciona un producto');
      return;
    }

    if (quantity < 1) {
      setError('La cantidad debe ser al menos 1');
      return;
    }

    // Check stock availability
    if (selectedProduct && quantity > selectedProduct.stock) {
      setError(`Stock insuficiente. Disponible: ${selectedProduct.stock}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData: OrderCreate = {
        product_id: productId,
        quantity,
      };

      await onCreate(orderData);
      handleClose();
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.detail || 'Error al crear la orden. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setProductId(null);
      setSelectedProduct(null);
      setQuantity(1);
      setError(null);
      onClose();
    }
  };

  const handleProductChange = (_: any, value: ProductResponse | null) => {
    setSelectedProduct(value);
    setProductId(value?.id || null);
    setError(null);
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    return parseFloat(selectedProduct.price) * quantity;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Crear Nueva Orden</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {productsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Product Selection */}
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.title} (${option.brand || 'Sin marca'}) - $${parseFloat(option.price).toFixed(2)}`}
                value={selectedProduct}
                onChange={handleProductChange}
                loading={productsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Producto"
                    required
                    fullWidth
                    margin="normal"
                    helperText="Busca y selecciona un producto"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body1">{option.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.brand && `${option.brand} • `}
                        ${parseFloat(option.price).toFixed(2)} • Stock: {option.stock}
                      </Typography>
                    </Box>
                  </li>
                )}
              />

              {/* Product Details */}
              {selectedProduct && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Categoría:</strong> {selectedProduct.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Stock disponible:</strong> {selectedProduct.stock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Precio unitario:</strong> ${parseFloat(selectedProduct.price).toFixed(2)}
                  </Typography>
                </Box>
              )}

              {/* Quantity */}
              <TextField
                label="Cantidad"
                type="number"
                fullWidth
                required
                margin="normal"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{
                  min: 1,
                  max: selectedProduct?.stock || 1000,
                }}
                helperText={selectedProduct ? `Máximo: ${selectedProduct.stock}` : ''}
              />

              {/* Total Preview */}
              {selectedProduct && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'primary.50',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Total estimado:
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || productsLoading || !productId}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creando...' : 'Crear Orden'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
