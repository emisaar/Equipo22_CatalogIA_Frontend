import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingCart as CartIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth, useWishlist, useOrders } from '../../contexts';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { pendingOrdersCount } = useOrders();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // Si el query está vacío, regresar al home
      navigate('/');
      setSearchQuery('');
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          CatalogIA
        </Typography>

        {/* Search Bar */}
        <Search sx={{ flexGrow: 1, mx: 2 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <form onSubmit={handleSearch}>
            <StyledInputBase
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </Search>

        {/* Wishlist Icon */}
        <IconButton color="inherit" onClick={() => navigate('/wishlist')}>
          <Badge badgeContent={wishlistItems.length} color="error">
            <FavoriteIcon />
          </Badge>
        </IconButton>

        {/* Cart Icon - Goes to Orders */}
        <IconButton color="inherit" onClick={() => navigate('/orders')}>
          <Badge badgeContent={pendingOrdersCount} color="error">
            <CartIcon />
          </Badge>
        </IconButton>

        {/* User Menu */}
        <IconButton
          color="inherit"
          onClick={user ? handleMenuOpen : () => navigate('/login')}
        >
          <AccountIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {user?.username || 'Mi Cuenta'}
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/orders'); }}>
            Mis Órdenes
          </MenuItem>
          <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
