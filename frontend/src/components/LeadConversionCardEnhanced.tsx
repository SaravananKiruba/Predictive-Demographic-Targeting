import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Progress,
  useColorModeValue,
  SimpleGrid,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

interface LeadConversionFactors {
  [key: string]: number;
}

interface LeadConversionProps {
  data: {
    score: number;
    factors: LeadConversionFactors;
  };
}

const factorLabelMap: Record<string, string> = {
  regional_demand: 'Regional Demand',
  population_age_fit: 'Population Age Fit',
  income_level: 'Income Level',
  historic_service_interest: 'Historic Interest',
  healthcare_infrastructure: 'Healthcare Infrastructure',
  local_demand: 'Local Demand',
  affordability_index: 'Affordability Index',
  age_demographics: 'Age Demographics',
  specialist_availability: 'Specialist Availability',
  population_density: 'Population Density',
  family_income: 'Family Income',
  urban_population_ratio: 'Urban Population Ratio',
  lifestyle_index: 'Lifestyle Index'
};

const LeadConversionCardEnhanced: React.FC<LeadConversionProps> = ({ data }) => {
  const { score, factors } = data || { score: 0, factors: {} };
  const cardBg = useColorModeValue('white', 'gray.700');
  
  // Validate data
  const isDataValid = 
    typeof score === 'number' && 
    factors && 
    typeof factors === 'object' && 
    Object.keys(factors).length > 0;
  
  if (!isDataValid) {
    return (
      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" height="100%">
        <Heading as="h2" size="md" mb={4} color="brand.600">
          Lead Conversion Potential
        </Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Text>Data not available</Text>
        </Alert>
      </Box>
    );
  }
  
  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green.500';
    if (score >= 60) return 'yellow.500';
    return 'red.500';
  };
  
  const scoreColor = getScoreColor(score);
  
  return (
    <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" height="100%">
      <Heading as="h2" size="md" mb={4} color="brand.600">
        Lead Conversion Potential
      </Heading>
      
      <Flex direction="column" align="center" mb={6}>
        <Box
          position="relative"
          h="120px"
          w="120px"
          borderRadius="full"
          borderWidth="8px"
          borderColor={scoreColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={3}
        >
          <Text fontSize="2xl" fontWeight="bold">
            {score.toFixed(1)}%
          </Text>
        </Box>
        <Text fontWeight="medium" color={scoreColor}>
          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair'} Potential
        </Text>
      </Flex>
      
      <Box>
        <Text fontWeight="medium" mb={3}>
          Factors Influencing Score:
        </Text>
        <SimpleGrid columns={1} spacing={3}>
          {Object.entries(factors).map(([key, value]) => {
            const displayValue = typeof value === 'number' 
              ? (value > 1 ? value.toFixed(1) : (value * 100).toFixed(1) + '%')
              : 'N/A';
              
            return (
              <Box key={key}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm">{factorLabelMap[key] || key}</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {displayValue}
                  </Text>
                </Flex>
                <Progress 
                  value={typeof value === 'number' ? (value > 1 ? value : value * 100) : 0} 
                  colorScheme={
                    value > 1 ? 
                      (value >= 70 ? 'green' : value >= 50 ? 'yellow' : 'red') : 
                      (value >= 0.7 ? 'green' : value >= 0.5 ? 'yellow' : 'red')
                  } 
                  size="sm" 
                  borderRadius="full" 
                />
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default LeadConversionCardEnhanced;
