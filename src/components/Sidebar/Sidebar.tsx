import { GetServerSideProps } from 'next';
import React from 'react';

interface SidebarProps {
  persons?: any[];
}

export const Sidebar = ({ persons }: SidebarProps) => {
  return (
    <div>
      <h1>Sidebar</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const persons: any[] = [];
  return {
    props: {
      persons,
    },
  };
};
