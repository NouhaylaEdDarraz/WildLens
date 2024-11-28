import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function MessageBox(accessoires) {
  return (
    <Alert variant={accessoires.variant || 'info'}>
      {accessoires.children}
    </Alert>
  );
}
