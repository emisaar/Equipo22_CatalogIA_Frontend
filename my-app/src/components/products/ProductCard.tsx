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
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ImageNotSupported as ImageIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProductResponse, ProductWithScore } from '../../types';
import { useWishlist } from '../../contexts';

interface ProductCardProps {
  product: ProductResponse | ProductWithScore;
  onAddToCart?: (productId: number) => void;
}

// Helper function to get placeholder color - unified color
const getPlaceholderColor = (): string => {
  return '#607D8B'; // Blue-grey - modern
};

// Helper function to get similarity badge color
const getSimilarityBadgeColor = (score: number): { color: string; label: string } => {
  if (score >= 0.8) return { color: 'success', label: 'Alta relevancia' };
  if (score >= 0.6) return { color: 'info', label: 'Buena relevancia' };
  if (score >= 0.4) return { color: 'warning', label: 'Relevancia media' };
  return { color: 'default', label: 'Baja relevancia' };
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const [imageError, setImageError] = useState(false);

  const price = parseFloat(product.price);
  const discount = parseFloat(product.discount);
  const rating = parseFloat(product.rating);
  const hasDiscount = discount > 0;
  const originalPrice = hasDiscount ? price / (1 - discount / 100) : price;

  // Check if product has similarity score (from semantic search)
  const similarityScore = 'similarity_score' in product ? product.similarity_score : undefined;
  const placeholderColor = getPlaceholderColor();

  // Debug: Log to check if similarity_score is present
  // console.log('Product:', product.id, 'Has similarity_score:', 'similarity_score' in product, 'Value:', similarityScore, 'Product:', product);

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
      {/* Similarity Score Badge - For Demo */}
      {similarityScore !== undefined && (
        <Tooltip title={`Relevancia: ${(similarityScore * 100).toFixed(1)}%`} arrow placement="left">
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

        {/* Similarity Score Progress Bar - For Demo */}
        {similarityScore !== undefined && (
          <Box sx={{ mt: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight="medium">
                Relevancia de búsqueda
              </Typography>
              <Typography variant="caption" color="primary" fontWeight="bold">
                {(similarityScore * 100).toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={similarityScore * 100}
              sx={{
                height: 6,
                borderRadius: 1,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                  bgcolor: similarityScore >= 0.7 ? 'success.main' : similarityScore >= 0.5 ? 'info.main' : 'warning.main',
                },
              }}
            />
          </Box>
        )}
      </CardContent>

      {/* Add to Cart Button */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product.id);
          }}
        >
          Agregar al Carrito
        </Button>
      </CardActions>
    </Card>
  );
};
