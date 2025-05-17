import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue,
  SimpleGrid
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
  healthcare_infrastructure: 'Healthcare Infrastructure'
};

const LeadConversionCard: React.FC<LeadConversionProps> = ({ data }) => {
  const { score, factors } = data;
  const cardBg = useColorModeValue('white', 'gray.700');
  
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
            {score}%
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
          {Object.entries(factors).map(([key, value]) => (
            <Box key={key}>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="sm">{factorLabelMap[key] || key}</Text>
                <Text fontSize="sm" fontWeight="bold">
                  {value.toFixed(1)}%
                </Text>
              </Flex>
              <Progress value={value} colorScheme={value >= 70 ? 'green' : value >= 50 ? 'yellow' : 'red'} size="sm" borderRadius="full" />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default LeadConversionCard;
