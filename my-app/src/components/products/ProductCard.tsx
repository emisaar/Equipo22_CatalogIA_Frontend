import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Box,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProductResponse, ProductWithScore, OrderCreate } from '../../types';
import { useWishlist, useOrders, useAuth } from '../../contexts';

interface ProductCardProps {
  product: ProductResponse | ProductWithScore;
}

// Helper function to get placeholder color - unified color
const getPlaceholderColor = (): string => {
  return '#607D8B'; // Blue-grey - modern
};

// Helper function to get similarity badge color
const getSimilarityBadgeColor = (score: number): { color: string; label: string } => {
  if (score >= 0.8) return { color: 'success', label: 'Excelente match' };
  if (score >= 0.6) return { color: 'info', label: 'Buen match' };
  if (score >= 0.4) return { color: 'warning', label: 'Match moderado' };
  return { color: 'default', label: 'Match bajo' };
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { createOrder } = useOrders();
  const inWishlist = isInWishlist(product.id);
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const price = parseFloat(product.price);
  const discount = parseFloat(product.discount);
  const rating = parseFloat(product.rating);
  const hasDiscount = discount > 0;
  const originalPrice = hasDiscount ? price / (1 - discount / 100) : price;

  // Check if product has similarity score (from semantic search)
  const similarityScore = 'similarity_score' in product ? product.similarity_score : undefined;
  const placeholderColor = getPlaceholderColor();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is authenticated
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para agregar productos al carrito',
        severity: 'error',
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    // Check stock
    if (product.stock === 0) {
      setSnackbar({
        open: true,
        message: 'Producto sin stock',
        severity: 'error',
      });
      return;
    }

    try {
      setAddingToCart(true);
      const orderData: OrderCreate = {
        product_id: product.id,
        quantity: 1,
      };

      await createOrder(orderData);

      setSnackbar({
        open: true,
        message: 'Producto agregado al carrito',
        severity: 'success',
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Error al agregar producto al carrito',
        severity: 'error',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={handleCardClick}
    >
      {/* Similarity Score Badge */}
      {similarityScore !== undefined && (
        <Tooltip title={`Match: ${(similarityScore * 100).toFixed(1)}%`} arrow placement="left">
          <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 100 }}>
            <Chip
              icon={<TrendingUpIcon sx={{ fontSize: '0.9rem' }} />}
              label={`${(similarityScore * 100).toFixed(0)}%`}
              color={getSimilarityBadgeColor(similarityScore).color as any}
              size="small"
              sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
            />
          </Box>
        </Tooltip>
      )}

      {/* Wishlist Icon */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'white',
          '&:hover': { bgcolor: 'grey.100' },
          zIndex: 10,
        }}
        onClick={handleWishlistToggle}
      >
        {inWishlist ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      {/* Product Image */}
      <Box
        sx={{
          height: 200,
          bgcolor: !product.image_url || imageError ? placeholderColor : 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
          transition: 'background-color 0.3s',
        }}
      >
        {!product.image_url || imageError ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <Typography variant="h3" fontWeight="bold" color="white">
                {product.brand?.charAt(0) || product.title.charAt(0)}
              </Typography>
            </Box>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.9)" fontWeight="medium">
              {product.category}
            </Typography>
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={product.image_url}
            alt={product.title}
            onError={() => setImageError(true)}
            sx={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Brand */}
        {product.brand && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontWeight: 600,
              display: 'block',
              mb: 0.5
            }}
          >
            {product.brand}
          </Typography>
        )}

        {/* Title - Max 2 lines */}
        <Tooltip title={product.title} enterDelay={500}>
          <Typography
            variant="subtitle1"
            component="h3"
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontWeight: 500,
              lineHeight: 1.3,
              minHeight: '2.6em',
              mb: 1,
            }}
          >
            {product.title}
          </Typography>
        </Tooltip>

        {/* Description - Max 2 lines, more compact */}
        {product.product_description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: '0.8rem',
              lineHeight: 1.4,
              minHeight: '2.2em',
              mb: 1,
            }}
          >
            {product.product_description}
          </Typography>
        )}

        {/* Price and Rating Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
          <Box>
            {hasDiscount && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textDecoration: 'line-through', display: 'block' }}
              >
                ${originalPrice.toFixed(2)}
              </Typography>
            )}
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${price.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {rating.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Add to Cart Button */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock === 0}
          startIcon={addingToCart ? <CircularProgress size={20} /> : null}
        >
          {addingToCart ? 'Agregando...' : product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
        </Button>
      </CardActions>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};
