import React from 'react';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Navbar />
          <Box as="main" p={4}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
