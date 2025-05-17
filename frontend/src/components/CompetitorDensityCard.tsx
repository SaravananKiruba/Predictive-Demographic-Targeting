import React from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaStar, FaLocationDot } from 'react-icons/fa6';

interface CompetitorInfo {
  name: string;
  rating: number;
  distance_km: number;
}

interface CompetitorDensityProps {
  data: {
    total_competitors: number;
    competitors_list: CompetitorInfo[];
    heatmap_data: any;
  };
}

const CompetitorDensityCard: React.FC<CompetitorDensityProps> = ({ data }) => {
  const { total_competitors, competitors_list } = data;
  const cardBg = 'white'; // Simple approach instead of useColorModeValue
  
  // Colors for competition density
  const getDensityColor = (count: number) => {
    if (count <= 3) return 'green';
    if (count <= 7) return 'yellow';
    return 'red';
  };
  
  const densityColor = getDensityColor(total_competitors);
  const densityText = total_competitors <= 3 ? 'Low' : total_competitors <= 7 ? 'Moderate' : 'High';
  
  // Get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'green.500';
    if (rating >= 3.5) return 'yellow.500';
    return 'red.500';
  };
  
  return (
    <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" height="100%">
      <Heading as="h2" size="md" mb={4} color="brand.600">
        Competitor Density Analysis
      </Heading>
      
      <Flex gap={4} mb={5}>
        <Box>
          <Text fontSize="sm">Total Competitors</Text>
          <Heading size="xl">{total_competitors}</Heading>
        </Box>
        <Badge colorScheme={densityColor} fontSize="md" px={3} py={1} borderRadius="md">
          {densityText} Competition
        </Badge>
      </Flex>
        {competitors_list.length > 0 ? (
        <Box overflowX="auto">
          {/* Replace Table component with a custom implementation */}
          <Box as="table" width="100%">
            <Box as="thead">
              <Box as="tr">
                <Box as="th" textAlign="left" fontWeight="bold" pb={2}>Provider</Box>
                <Box as="th" textAlign="right" fontWeight="bold" pb={2}>Rating</Box>
                <Box as="th" textAlign="right" fontWeight="bold" pb={2}>Distance</Box>
              </Box>
            </Box>
            <Box as="tbody">
              {competitors_list.slice(0, 5).map((competitor, index) => (
                <Box as="tr" key={index}>
                  <Box as="td" fontWeight="medium" py={2}>{competitor.name}</Box>
                  <Box as="td" textAlign="right" py={2}>                    <Flex align="center" justify="flex-end">                      <Text mr={1} color={getRatingColor(competitor.rating)}>
                        {competitor.rating}
                      </Text>
                      <Icon color={getRatingColor(competitor.rating)}>{FaStar({})}</Icon>
                    </Flex>
                  </Box>
                  <Box as="td" textAlign="right" py={2}>                    <Flex align="center" justify="flex-end">
                      <Text>{competitor.distance_km} km</Text>
                      <Icon ml="4px" color="gray">{FaLocationDot({})}</Icon>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          
          {competitors_list.length > 5 && (
            <Text fontSize="sm" color="gray.500" mt={2} textAlign="right">
              + {competitors_list.length - 5} more competitors
            </Text>
          )}
        </Box>
      ) : (
        <Text>No competitor data available.</Text>
      )}
      
      <Text fontSize="sm" mt={4} fontStyle="italic">
        Competitor data is based on healthcare facilities offering similar services within the region.
        {densityText === 'Low' 
          ? ' The low competition in this area may provide opportunity for growth.' 
          : densityText === 'Moderate' 
            ? ' Consider strategy to differentiate from existing competitors.' 
            : ' A saturated market may require strong differentiation strategy.'}
      </Text>
    </Box>
  );
};

export default CompetitorDensityCard;
