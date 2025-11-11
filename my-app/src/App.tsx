import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, WishlistProvider, OrderProvider } from './contexts';
import { Layout } from './components/layout';
import { Home, Login, Register, Wishlist, SearchResults, Orders } from './pages';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <WishlistProvider>
            <OrderProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes with Layout */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/search" element={<Layout><SearchResults /></Layout>} />
                <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
                <Route path="/orders" element={<Layout><Orders /></Layout>} />
              </Routes>
            </OrderProvider>
          </WishlistProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
