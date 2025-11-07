import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    given_name: '',
    paternal_surname: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      console.error('Register error:', err);
      setError(
        err.response?.data?.detail ||
        'Error al registrarse. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
          Crear Cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Únete a CatalogIA
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Nombre de usuario"
            name="username"
            fullWidth
            required
            value={formData.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Nombre"
            name="given_name"
            fullWidth
            value={formData.given_name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Apellido"
            name="paternal_surname"
            fullWidth
            value={formData.paternal_surname}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes cuenta?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                Inicia sesión
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
