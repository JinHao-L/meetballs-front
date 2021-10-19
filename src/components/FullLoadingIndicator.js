import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import MrMeatball from '../assets/MrMeatball.png';

export const FullLoadingIndicator = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <img src={MrMeatball} className="Spinner" />
    </Container>
  );
};
