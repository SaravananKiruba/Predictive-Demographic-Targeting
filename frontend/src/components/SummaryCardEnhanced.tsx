import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  IconProps,
  chakra,
} from '@chakra-ui/react';
import { FaHospital, FaUsers, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

// Create Chakra-wrapped versions of the icons
const CalendarIcon = chakra(FaCalendarAlt);
const MoneyIcon = chakra(FaMoneyBillWave);
const HospitalIcon = chakra(FaHospital);
const UsersIcon = chakra(FaUsers);

interface SummaryCardProps {
  data: {
    avg_patient_inquiries_per_month: number;
    avg_treatment_cost: number;
    nearest_major_hospital: string;
    high_demand_age_group: string;
  };
}

const SummaryCardEnhanced: React.FC<SummaryCardProps> = ({ data }) => {
  const {
    avg_patient_inquiries_per_month,
    avg_treatment_cost,
    nearest_major_hospital,
    high_demand_age_group,
  } = data || {};
  
  const cardBg = useColorModeValue('white', 'gray.700');
  
  // Check if data is complete
  const isDataValid = 
    typeof avg_patient_inquiries_per_month === 'number' && 
    typeof avg_treatment_cost === 'number' && 
    typeof nearest_major_hospital === 'string' && nearest_major_hospital.length > 0 &&
    typeof high_demand_age_group === 'string' && high_demand_age_group.length > 0;
  
  if (!isDataValid) {
    return (
      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" height="100%">
        <Heading as="h2" size="md" mb={4} color="brand.600">
          Summary Analytics
        </Heading>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Text>Data not available</Text>
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" height="100%">
      <Heading as="h2" size="md" mb={4} color="brand.600">
        Summary Analytics
      </Heading>      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>        <Stat>            <Flex align="center" mb={2}>
            <CalendarIcon color="blue.500" mr="8px" />
            <StatLabel>Avg. Monthly Inquiries</StatLabel>
          </Flex>
          <StatNumber>{avg_patient_inquiries_per_month}</StatNumber>
          <StatHelpText>Potential patients per month</StatHelpText>
        </Stat>
          <Stat>          <Flex align="center" mb={2}>
            <MoneyIcon color="green.500" mr="8px" />
            <StatLabel>Avg. Treatment Cost</StatLabel>
          </Flex>
          <StatNumber>${avg_treatment_cost.toLocaleString()}</StatNumber>
          <StatHelpText>Average in the region</StatHelpText>        </Stat>          <Stat>          <Flex align="center" mb={2}>
            <HospitalIcon color="purple.500" mr="8px" />
            <StatLabel>Nearest Major Facility</StatLabel>
          </Flex>
          <Text fontWeight="semibold">{nearest_major_hospital}</Text>
          <StatHelpText>Major healthcare provider nearby</StatHelpText>
        </Stat>
          <Stat>          <Flex align="center" mb={2}>
            <UsersIcon color="orange.500" mr="8px" />
            <StatLabel>High Demand Age Group</StatLabel>
          </Flex>
          <Text fontWeight="semibold">{high_demand_age_group}</Text>
          <StatHelpText>Target demographic</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default SummaryCardEnhanced;
