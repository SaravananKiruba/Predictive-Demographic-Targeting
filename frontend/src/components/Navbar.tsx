import React from 'react';
import { Box, Flex, Heading, Button, HStack, useColorModeValue, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Box as="nav" bg={bgColor} px={4} py={3} boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        <Flex align="center">
          <Image src="/logo192.png" alt="Logo" boxSize="40px" mr={3} />
          <Heading size="md" color="brand.600">Healthcare Analytics</Heading>
        </Flex>
        
        <HStack spacing={4}>
          <Link to="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link to="#">
            <Button variant="ghost">About</Button>
          </Link>
          <Button colorScheme="blue">Contact Us</Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
