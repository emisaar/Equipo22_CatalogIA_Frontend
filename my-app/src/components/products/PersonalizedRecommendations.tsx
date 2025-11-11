import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Skeleton,
  Chip,
  IconButton,
} from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  Refresh as RefreshIcon,
  FavoriteBorder as WishlistIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useAuth, useWishlist } from '../../contexts';
import { ProductCard } from './ProductCard';
import { ProductWithScore } from '../../types';
import { productService } from '../../services';

export const PersonalizedRecommendations: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems } = useWishlist();
  const [recommendations, setRecommendations] = useState<ProductWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistSize, setWishlistSize] = useState(0);
  const [strategy] = useState<'semantic' | 'category' | 'hybrid'>('semantic');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getPersonalizedRecommendations({
        limit: 8,
        strategy,
      });
      setRecommendations(data.products);
      setWishlistSize(data.wishlist_size);
    } catch (err: any) {
      console.error('Error loading recommendations:', err);
      // Handle gracefully - don't show error for empty wishlist
      if (err.response?.status === 404 || err.response?.status === 401) {
        setWishlistSize(0);
        setRecommendations([]);
      } else {
        setError('No pudimos cargar las recomendaciones en este momento.');
      }
    } finally {
      setLoading(false);
    }
  }, [strategy]);

  // Load recommendations when authenticated or wishlist changes
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    if (wishlistItems.length > 0) {
      loadRecommendations();
    } else {
      // Empty wishlist state
      setRecommendations([]);
      setWishlistSize(0);
      setLoading(false);
    }
  }, [isAuthenticated, wishlistItems.length, loadRecommendations]);

  const handleRefresh = () => {
    loadRecommendations();
  };

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Use threshold of 5px to account for sub-pixel scrolling and snap
    const isAtStart = scrollLeft < 5;
    const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5;

    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  }, []);

  // Scroll carousel left/right
  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });

    // Update arrows after scroll animation completes
    setTimeout(updateArrowVisibility, 500);
  }, [updateArrowVisibility]);

  // Update arrows when recommendations change and on mount
  useEffect(() => {
    if (recommendations.length > 0) {
      // Initial update
      updateArrowVisibility();
      // Backup update after render
      setTimeout(updateArrowVisibility, 100);
      // Additional backup after possible layout shifts
      setTimeout(updateArrowVisibility, 300);
    }
  }, [recommendations.length, updateArrowVisibility]);

  // Update arrows on window resize
  useEffect(() => {
    const handleResize = () => {
      updateArrowVisibility();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateArrowVisibility]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Loading skeleton
  if (loading) {
    return (
      <Box
        sx={{
          mb: 6,
          p: 3,
          bgcolor: 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1.5 }} />
          <Skeleton variant="text" width={250} height={40} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ minWidth: 280, flexShrink: 0 }}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Empty wishlist state
  if (wishlistSize === 0) {
    return (
      <Box
        sx={{
          mb: 6,
          p: 4,
          bgcolor: 'primary.50',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'primary.200',
          textAlign: 'center',
        }}
      >
        <WishlistIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.dark">
          Descubre tus recomendaciones personalizadas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 500, mx: 'auto' }}>
          Agrega productos a tu lista de deseos y te mostraremos recomendaciones personalizadas basadas en tus gustos
        </Typography>
      </Box>
    );
  }

  // Error state (graceful degradation)
  if (error) {
    return (
      <Box sx={{ mb: 6 }}>
        <Alert
          severity="info"
          onClose={() => setError(null)}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // No recommendations found
  if (recommendations.length === 0) {
    return null;
  }

  // Main recommendations section
  return (
    <Box
      sx={{
        mb: 6,
        p: 3,
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'primary.100',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: 'primary.main',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SparklesIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="700" color="primary.dark">
              Recomendado para ti
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Basado en {wishlistSize} producto{wishlistSize !== 1 ? 's' : ''} de tu wishlist
              <Chip
                label={strategy === 'semantic' ? 'IA Semántica' : strategy === 'category' ? 'Por Categoría' : 'Híbrido'}
                size="small"
                color="primary"
                sx={{ ml: 0.5, height: 18, fontSize: '0.65rem' }}
              />
            </Typography>
          </Box>
        </Box>

        {/* Navigation Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Navigation Arrows */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              size="small"
              sx={{
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.300',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.100',
                  opacity: 0.5,
                },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              size="small"
              sx={{
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.300',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                '&.Mui-disabled': {
                  bgcolor: 'grey.100',
                  opacity: 0.5,
                },
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Refresh Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Carousel Container */}
      <Box sx={{ position: 'relative' }}>

        {/* Scrollable Products Container */}
        <Box
          ref={scrollContainerRef}
          onScroll={updateArrowVisibility}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            pb: 2,
            px: 0.5,
            // Hide scrollbar
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {recommendations.map((product) => (
            <Box
              key={product.id}
              sx={{
                minWidth: { xs: 260, sm: 280, md: 300 },
                maxWidth: { xs: 260, sm: 280, md: 300 },
                flexShrink: 0,
                scrollSnapAlign: 'start',
              }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Info Footer */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Las recomendaciones se actualizan en base a tu actividad y preferencias
        </Typography>
      </Box>
    </Box>
  );
};
