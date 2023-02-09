import { FC, ReactNode } from 'react';
import { Roboto } from '@next/font/google';
import { Container } from '@mui/material';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Container
      className={roboto.className}
      maxWidth={false}
      sx={{
        width: '100%',
        bgcolor: 'background.default',
        color: 'text.primary',
        p: 3,
        height: '100%',
      }}
    >
      <main
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </main>
    </Container>
  );
};
