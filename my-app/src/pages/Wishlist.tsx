import React from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ProductCard } from '../components/products/ProductCard';
import { useWishlist } from '../contexts';

export const Wishlist: React.FC = () => {
  const { wishlistItems, loading } = useWishlist();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Mi Lista de Deseos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {wishlistItems.length} producto{wishlistItems.length !== 1 ? 's' : ''} guardado{wishlistItems.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && wishlistItems.length === 0 && (
        <Alert severity="info">
          No tienes productos en tu lista de deseos. Explora nuestro catálogo y guarda tus favoritos.
        </Alert>
      )}

      {/* Wishlist Grid */}
      {!loading && wishlistItems.length > 0 && (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
              <ProductCard product={item.product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
