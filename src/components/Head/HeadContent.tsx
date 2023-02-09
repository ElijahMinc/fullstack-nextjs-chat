import Head from 'next/head';
import React from 'react';

interface HeadContentProps {
  title: string;
  metaElements: React.DetailedHTMLProps<
    React.MetaHTMLAttributes<HTMLMetaElement>,
    HTMLMetaElement
  >[];
}

export const HeadContent: React.FC<HeadContentProps> = ({
  metaElements,
  title,
}) => (
  <Head>
    <title>{title}</title>
    {metaElements.map((elem, idx) => (
      <meta key={idx} name={elem.name} content={elem.content} />
    ))}
    <link rel="icon" href="/favicon.ico" />
  </Head>
);
