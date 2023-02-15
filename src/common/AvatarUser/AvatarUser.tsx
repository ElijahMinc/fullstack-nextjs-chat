import Image from 'next/image';
import React from 'react';

interface AvatarUserProps {
  url: string;
}

export const AvatarUser: React.FC<AvatarUserProps> = ({ url }) => {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        position: 'relative',
        objectFit: 'cover',
        overflow: 'hidden',
        borderRadius: '50%',
      }}
    >
      <Image src={url} fill alt="avatar" />
    </div>
  );
};
