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
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import LeadConversionCardEnhanced from './LeadConversionCardEnhanced';
import TimeTrendsCardEnhanced from './TimeTrendsCardEnhanced';
import SummaryCardEnhanced from './SummaryCardEnhanced';

// Define interfaces for our data
interface LeadConversionData {
  score: number;
  factors: Record<string, number>;
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

const PredictiveTargeting: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city || !department) {
      setError('Please enter both city and select a healthcare department.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
      try {
      const response = await fetch('http://localhost:8000/api/demographic-targeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: city,
          healthcare_department: department,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Server responded with ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Validate required data exists
      if (!data) {
        throw new Error('No data received from server');
      }
      
      setAnalyticsData(data);
      
      toast({
        title: 'Success',
        description: 'Demographic targeting data generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics data');
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch data from server',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={8} textAlign="center" fontSize={{ base: '2xl', md: '3xl' }} color="brand.700">
        Predictive Demographic Targeting
      </Heading>
      
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={8}>
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Input 
                placeholder="Enter city name" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
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
                Generate Insights
              </Button>
            </Flex>
          </SimpleGrid>
        </form>
      </Box>
      
      {error && (
        <Alert status="error" mb={8} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}        {isLoading && (
        <Flex justify="center" align="center" direction="column" my={12}>
          <Spinner size="xl" color="blue.500" mb={4} />
          <Text fontSize="lg">Analyzing demographic data for {city} - {department}...</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>Querying Gemini API for real-time insights</Text>
          <Text fontSize="xs" color="gray.400" mt={1}>This may take a few seconds as we generate custom data</Text>
        </Flex>
      )}
        {analyticsData && !isLoading && (
        <>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            <LeadConversionCardEnhanced data={analyticsData.lead_conversion} />
            <SummaryCardEnhanced data={analyticsData.summary_analytics} />
          </SimpleGrid>
          
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
            <TimeTrendsCardEnhanced data={analyticsData.time_trends} />
          </SimpleGrid>
        </>
      )}        {!analyticsData && !isLoading && !error && (        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          bg="blue.50" 
          p={10} 
          borderRadius="lg"
          boxShadow="sm"
        >
          <Text fontSize="xl" mb={4} textAlign="center">
            Predictive Demographic Targeting Tool
          </Text>
          <Text color="gray.600" textAlign="center" mb={4}>
            Enter a city name and select a healthcare department to generate real-time insights using Google's Gemini AI.
            Each analysis is generated specifically for your query with dynamic, AI-powered data.
          </Text>
          <Text fontSize="sm" color="blue.600">
            The system analyzes demographic patterns, market trends, and competition in real-time to provide
            accurate targeting data for your healthcare marketing strategy.
          </Text>
        </Flex>
      )}
    </Container>
  );
};

export default PredictiveTargeting;
