import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes, routes } from './routes/Routes';
import { Routes } from 'react-router-dom';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {renderRoutes(routes)}
        </Routes>
      </BrowserRouter>
    </>
  )
}