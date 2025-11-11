import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Search as SearchIcon, Sort as SortIcon } from '@mui/icons-material';
import { ProductCard } from '../components/products/ProductCard';
import { ProductWithScore } from '../types';
import { productService } from '../services';

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<ProductWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.semanticSearch({ q: query, limit: 20 });
      setProducts(data.products);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Error al buscar productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [query, performSearch]);

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
      case 'relevance':
      default:
        // Sort by similarity_score if available
        return productsCopy.sort((a, b) => {
          const scoreA = 'similarity_score' in a ? a.similarity_score : 0;
          const scoreB = 'similarity_score' in b ? b.similarity_score : 0;
          return scoreB - scoreA;
        });
    }
  }, [products, sortBy]);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SearchIcon color="primary" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Resultados de búsqueda
          </Typography>
        </Box>

        {query && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Búsqueda:
            </Typography>
            <Chip label={query} color="primary" variant="outlined" />
          </Box>
        )}

        {!loading && !error && products.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {products.length} resultado{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </Typography>

            {/* Sort Selector */}
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
                <MenuItem value="relevance">Más Relevantes</MenuItem>
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

      {/* No Query */}
      {!query && !loading && (
        <Alert severity="info">
          Ingresa un término de búsqueda para encontrar productos.
        </Alert>
      )}

      {/* Products Grid */}
      {!loading && !error && query && sortedProducts.length > 0 && (
        <Grid container spacing={3}>
          {sortedProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty Results */}
      {!loading && !error && query && products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron resultados para "{query}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta con otros términos de búsqueda
          </Typography>
        </Box>
      )}
    </Container>
  );
};
