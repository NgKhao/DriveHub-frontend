import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth='sm'>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SignIn
              appearance={{
                elements: {
                  rootBox: {
                    width: '100%',
                  },
                  card: {
                    boxShadow:
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: '12px',
                    padding: '2rem',
                  },
                  formButtonPrimary: {
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  },
                  formFieldInput: {
                    borderRadius: '8px',
                  },
                  headerTitle: {
                    fontSize: '1.75rem',
                    fontWeight: 600,
                  },
                  headerSubtitle: {
                    color: '#666',
                  },
                  socialButtonsBlockButton: {
                    borderRadius: '8px',
                  },
                  dividerLine: {
                    backgroundColor: '#e0e0e0',
                  },
                  footerActionLink: {
                    color: '#1976d2',
                    '&:hover': {
                      color: '#1565c0',
                    },
                  },
                },
              }}
              routing='path'
              path='/login'
              signUpUrl='/register'
              afterSignInUrl='/'
            />
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginPage;
