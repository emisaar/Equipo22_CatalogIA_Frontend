import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { OrderCard } from '../components/orders/OrderCard';
import { useOrders } from '../contexts';

type FilterStatus = 'all' | 'pending' | 'completed' | 'cancelled';

export const Orders: React.FC = () => {
  const { orders, loading, error, cancelOrder } = useOrders();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder(orderId);
      setSnackbar({
        open: true,
        message: 'Orden cancelada exitosamente',
        severity: 'success',
      });
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Error al cancelar la orden',
        severity: 'error',
      });
      throw err;
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter orders based on selected status
  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status.toLowerCase() === filterStatus);

  // Get order counts by status
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status.toLowerCase() === 'pending').length,
    completed: orders.filter(o => o.status.toLowerCase() === 'completed').length,
    cancelled: orders.filter(o => o.status.toLowerCase() === 'cancelled').length,
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mis Órdenes
        </Typography>
      </Box>

      {/* Filters and Stats */}
      {orders.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {/* Status Stats */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Todas (${orderCounts.all})`}
              onClick={() => setFilterStatus('all')}
              color={filterStatus === 'all' ? 'primary' : 'default'}
              variant={filterStatus === 'all' ? 'filled' : 'outlined'}
            />
            <Chip
              label={`Pendientes (${orderCounts.pending})`}
              onClick={() => setFilterStatus('pending')}
              color={filterStatus === 'pending' ? 'warning' : 'default'}
              variant={filterStatus === 'pending' ? 'filled' : 'outlined'}
            />
            <Chip
              label={`Completadas (${orderCounts.completed})`}
              onClick={() => setFilterStatus('completed')}
              color={filterStatus === 'completed' ? 'success' : 'default'}
              variant={filterStatus === 'completed' ? 'filled' : 'outlined'}
            />
            <Chip
              label={`Canceladas (${orderCounts.cancelled})`}
              onClick={() => setFilterStatus('cancelled')}
              color={filterStatus === 'cancelled' ? 'error' : 'default'}
              variant={filterStatus === 'cancelled' ? 'filled' : 'outlined'}
            />
          </Box>

        </Box>
      )}

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

      {/* Orders Grid */}
      {!loading && !error && filteredOrders.length > 0 && (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
              <OrderCard
                order={order}
                onCancel={handleCancelOrder}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State - No Orders */}
      {!loading && !error && orders.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes órdenes aún
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agrega productos al carrito desde el catálogo para crear órdenes
          </Typography>
        </Box>
      )}

      {/* Empty State - No Filtered Results */}
      {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay órdenes {filterStatus !== 'all' && `con estado "${filterStatus}"`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            No hay órdenes
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setFilterStatus('all')}
          >
            Ver Todas las Órdenes
          </Button>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
