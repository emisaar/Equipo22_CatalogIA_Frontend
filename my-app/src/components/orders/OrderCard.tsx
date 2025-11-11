import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';
import { OrderResponse } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderCardProps {
  order: OrderResponse;
  onCancel: (orderId: number) => Promise<void>;
}

// Helper to get status color and icon
const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return {
        color: 'success' as const,
        icon: <CompletedIcon fontSize="small" />,
        label: 'Completada',
      };
    case 'cancelled':
      return {
        color: 'error' as const,
        icon: <CancelledIcon fontSize="small" />,
        label: 'Cancelada',
      };
    case 'pending':
    default:
      return {
        color: 'warning' as const,
        icon: <PendingIcon fontSize="small" />,
        label: 'Pendiente',
      };
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel }) => {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusConfig = getStatusConfig(order.status);
  const canCancel = order.status.toLowerCase() !== 'completed' && order.status.toLowerCase() !== 'cancelled';

  const handleCancel = async () => {
    try {
      setLoading(true);
      await onCancel(order.id);
      setOpenCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: 3,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Header with Order ID and Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="div" fontWeight="bold">
              Orden #{order.id}
            </Typography>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Order Details */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Producto ID:</strong> {order.product_id}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Cantidad:</strong> {order.quantity}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Fecha:</strong> {format(new Date(order.created_at), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
            </Typography>
          </Box>

          {/* Total Amount */}
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${parseFloat(order.total_amount).toFixed(2)}
            </Typography>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ p: 2, pt: 0 }}>
          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              onClick={() => setOpenCancelDialog(true)}
            >
              Cancelar Orden
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={openCancelDialog} onClose={() => !loading && setOpenCancelDialog(false)}>
        <DialogTitle>Cancelar Orden</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer.
          </Alert>
          <Typography>
            ¿Estás seguro de que deseas cancelar la orden <strong>#{order.id}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} disabled={loading}>
            No, mantener orden
          </Button>
          <Button onClick={handleCancel} variant="contained" color="error" disabled={loading}>
            Sí, cancelar orden
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
