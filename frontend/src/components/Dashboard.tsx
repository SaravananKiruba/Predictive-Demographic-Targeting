import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
  useToast,
  Spinner,
  Text
} from '@chakra-ui/react';
import LeadConversionCard from './LeadConversionCard';
import CompetitorDensityCard from './CompetitorDensityCard';
import TimeTrendsCard from './TimeTrendsCard';
import SummaryCard from './SummaryCard';

// Define interfaces for our data
interface LeadConversionData {
  score: number;
  factors: Record<string, number>;
}

interface CompetitorInfo {
  name: string;
  rating: number;
  distance_km: number;
}

interface CompetitorDensityData {
  total_competitors: number;
  competitors_list: CompetitorInfo[];
  heatmap_data: any;
}

interface TimeTrendData {
  months: string[];
  values: number[];
  trend_analysis: string;
}

interface SummaryAnalyticsData {
  avg_patient_inquiries_per_month: number;
  avg_treatment_cost: number;
  nearest_major_hospital: string;
  high_demand_age_group: string;
}

interface AnalyticsData {
  lead_conversion: LeadConversionData;
  competitor_density: CompetitorDensityData;
  time_trends: TimeTrendData;
  summary_analytics: SummaryAnalyticsData;
}

const healthcareDepartments = [
  'Cardiology',
  'Dermatology',
  'ENT',
  'Gastroenterology',
  'General Physician',
  'Gynecology',
  'Neurology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
  'Dental'
];

const Dashboard: React.FC = () => {
  const [postalCode, setPostalCode] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postalCode || !department) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both postal code and select a healthcare department.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/demographic-targeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postal_code: postalCode,
          healthcare_department: department,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
      
      toast({
        title: 'Success',
        description: 'Analytics data loaded successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={8} textAlign="center" fontSize={{ base: '2xl', md: '3xl' }} color="brand.700">
        Healthcare Demographic Targeting Analytics
      </Heading>
      
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={8}>
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Postal Code / ZIP Code</FormLabel>
              <Input 
                placeholder="Enter postal code" 
                value={postalCode} 
                onChange={(e) => setPostalCode(e.target.value)}
                disabled={isLoading}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Healthcare Department</FormLabel>
              <Select 
                placeholder="Select department" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isLoading}
              >
                {healthcareDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <Flex alignItems="flex-end">
              <Button 
                type="submit" 
                colorScheme="blue" 
                width="full" 
                isLoading={isLoading}
                loadingText="Analyzing"
              >
                Generate Analytics
              </Button>
            </Flex>
          </SimpleGrid>
        </form>
      </Box>
      
      {isLoading && (
        <Flex justify="center" align="center" direction="column" my={12}>
          <Spinner size="xl" color="blue.500" mb={4} />
          <Text fontSize="lg">Analyzing demographic data for {postalCode} - {department}...</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>This may take a few moments as we process regional data</Text>
        </Flex>
      )}
      
      {analyticsData && !isLoading && (
        <>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            <LeadConversionCard data={analyticsData.lead_conversion} />
            <SummaryCard data={analyticsData.summary_analytics} />
          </SimpleGrid>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <CompetitorDensityCard data={analyticsData.competitor_density} />
            <TimeTrendsCard data={analyticsData.time_trends} />
          </SimpleGrid>
        </>
      )}
      
      {!analyticsData && !isLoading && (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          bg="blue.50" 
          p={10} 
          borderRadius="lg"
          boxShadow="sm"
        >
          <Text fontSize="xl" mb={4} textAlign="center">
            Enter a postal code and select a healthcare department to get started
          </Text>
          <Text color="gray.600" textAlign="center">
            Our AI-powered system will analyze demographic data to provide insights on lead conversion potential, 
            competitor analysis, and market trends.
          </Text>
        </Flex>
      )}
    </Container>
  );
};

export default Dashboard;
