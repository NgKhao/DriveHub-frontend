import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box component='main' sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
