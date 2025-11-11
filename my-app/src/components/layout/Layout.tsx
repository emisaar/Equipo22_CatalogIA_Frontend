import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: 4,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" gutterBottom>
            CatalogIA
          </Typography>
          <Typography variant="body2" color="grey.400">
            Tu tienda de confianza.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
