import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component='footer'
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='h6' color='text.primary' gutterBottom>
              Car Marketplace
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Nền tảng mua bán xe hàng đầu Việt Nam
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='h6' color='text.primary' gutterBottom>
              Dành cho người mua
            </Typography>
            <Link
              href='/cars'
              variant='body2'
              color='text.secondary'
              display='block'
            >
              Tìm kiếm xe
            </Link>
            <Link
              href='/cars'
              variant='body2'
              color='text.secondary'
              display='block'
            >
              Xe nổi bật
            </Link>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='h6' color='text.primary' gutterBottom>
              Dành cho người bán
            </Typography>
            <Link
              href='/sell'
              variant='body2'
              color='text.secondary'
              display='block'
            >
              Đăng bán xe
            </Link>
            <Link
              href='/seller-dashboard'
              variant='body2'
              color='text.secondary'
              display='block'
            >
              Quản lý bài đăng
            </Link>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant='h6' color='text.primary' gutterBottom>
              Hỗ trợ
            </Typography>
            <Link
              href='#'
              variant='body2'
              color='text.secondary'
              display='block'
            >
              Liên hệ
            </Link>
            <Link
              href='#'
              variant='body2'
              color='text.secondary'
              display='block'
            >
              Điều khoản sử dụng
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant='body2' color='text.secondary' align='center'>
            {'Copyright © '}
            Car Marketplace {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
