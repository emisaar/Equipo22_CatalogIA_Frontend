import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Sort as SortIcon } from '@mui/icons-material';
import { ProductCard } from '../components/products/ProductCard';
import { ProductResponse } from '../types';
import { productService } from '../services';

type SortOption = 'price_asc' | 'price_desc' | 'rating_desc';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating_desc');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.listProducts({ limit: 20 });
      setProducts(data.products);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId: number) => {
    console.log('Add to cart:', productId);
    alert(`Producto ${productId} agregado al carrito (por implementar)`);
  };

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    switch (sortBy) {
      case 'price_asc':
        return productsCopy.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price_desc':
        return productsCopy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'rating_desc':
        return productsCopy.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Productos Destacados
        </Typography>

        {/* Sort Dropdown */}
        {products.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
            </Typography>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="sort-select-label">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SortIcon fontSize="small" />
                  Ordenar por
                </Box>
              </InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <MenuItem value="rating_desc">Mejor Valorados</MenuItem>
                <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
                <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      {!loading && !error && sortedProducts.length > 0 && (
        <Grid container spacing={3}>
          {sortedProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos
          </Typography>
        </Box>
      )}
    </Container>
  );
};
