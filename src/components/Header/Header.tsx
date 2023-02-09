import { ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return <div>{children}</div>;
};
