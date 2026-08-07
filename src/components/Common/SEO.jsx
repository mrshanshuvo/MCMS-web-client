import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  const siteTitle = 'CareCamp - Medical Camp Management System';
  const fullTitle = title ? `${title} | CareCamp` : siteTitle;
  const metaDescription =
    description ||
    'Streamlined medical camp management platform connecting organizers and healthcare participants.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
    </Helmet>
  );
};

export default SEO;
