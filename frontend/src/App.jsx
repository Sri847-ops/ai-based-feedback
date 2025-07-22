import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import './index.css'; // Make sure this imports Tailwind

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-2xl font-bold text-green-700">
                User Dashboard Placeholder
              </div>
            }
          />
          <Route
            path="/staff"
            element={
              <div className="text-2xl font-bold text-blue-700">
                Staff Dashboard Placeholder
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
