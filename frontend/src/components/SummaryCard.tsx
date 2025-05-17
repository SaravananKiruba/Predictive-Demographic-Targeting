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
  Icon,
} from '@chakra-ui/react';
import { FaHospital, FaUsers, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

interface SummaryCardProps {
  data: {
    avg_patient_inquiries_per_month: number;
    avg_treatment_cost: number;
    nearest_major_hospital: string;
    high_demand_age_group: string;
  };
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const {
    avg_patient_inquiries_per_month,
    avg_treatment_cost,
    nearest_major_hospital,
    high_demand_age_group,
  } = data;
  
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" height="100%">
      <Heading as="h2" size="md" mb={4} color="brand.600">
        Summary Analytics
      </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>        <Stat>          <Flex align="center" mb={2}>
            <Icon color="blue" mr="8px">{FaCalendarAlt({})}</Icon>
            <StatLabel>Avg. Monthly Inquiries</StatLabel>
          </Flex>
          <StatNumber>{avg_patient_inquiries_per_month}</StatNumber>
          <StatHelpText>Potential patients per month</StatHelpText>
        </Stat>
        
        <Stat>          <Flex align="center" mb={2}>
            <Icon color="green" mr="8px">{FaMoneyBillWave({})}</Icon>
            <StatLabel>Avg. Treatment Cost</StatLabel>
          </Flex>          <StatNumber>${avg_treatment_cost.toLocaleString()}</StatNumber>
          <StatHelpText>Average in the region</StatHelpText>
        </Stat>
        
        <Stat>          <Flex align="center" mb={2}>
            <Icon color="purple" mr="8px">{FaHospital({})}</Icon>
            <StatLabel>Nearest Major Facility</StatLabel>
          </Flex>
          <Text fontWeight="semibold">{nearest_major_hospital}</Text>
          <StatHelpText>Competitor or potential partner</StatHelpText>
        </Stat>
        
        <Stat>          <Flex align="center" mb={2}>
            <Icon color="orange" mr="8px">{FaUsers({})}</Icon>
            <StatLabel>High Demand Age Group</StatLabel>
          </Flex>
          <Text fontWeight="semibold">{high_demand_age_group}</Text>
          <StatHelpText>Target demographic</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default SummaryCard;
