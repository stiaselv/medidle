import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Stack,
  Text,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Center,
} from '@chakra-ui/react';
import { useGameStore } from '../../store/gameStore';

export const UserAuth: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useGameStore();
  const toast = useToast();

  const handleRegister = async () => {
    setError(null);
    try {
      await register(username, password);
      toast({
        title: 'Registration successful!',
        description: 'Your account has been created. You can now log in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    setError(null);
    try {
      await login(username, password);
      toast({
        title: 'Login successful!',
        description: "You're now logged in.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Note: Navigation should be handled by a state change in your root component
    } catch (error: any) {
      setError(error.message || 'Invalid username or password.');
    }
  };

  return (
    <Center 
      w="100vw"
      h="100vh" 
      bg="gray.900" 
      color="white"
      backgroundImage="url('/assets/BG/login.webp')"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" bg="gray.800" width="100%" maxW="400px">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Login</Tab>
            <Tab _selected={{ color: 'white', bg: 'green.500' }}>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack as="form" spacing={4} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <Heading as="h1" size="lg" textAlign="center">Login</Heading>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Enter your username"
                    bg="gray.700"
                    borderColor="gray.600"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter your password"
                    bg="gray.700"
                    borderColor="gray.600"
                  />
                </FormControl>
                {error && <Text color="red.400">{error}</Text>}
                <Button type="submit" colorScheme="blue" width="full">Login</Button>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack as="form" spacing={4} onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <Heading as="h1" size="lg" textAlign="center">Register</Heading>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Choose a username"
                    bg="gray.700"
                    borderColor="gray.600"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Choose a password"
                    bg="gray.700"
                    borderColor="gray.600"
                  />
                </FormControl>
                {error && <Text color="red.400">{error}</Text>}
                <Button type="submit" colorScheme="green" width="full">Register</Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
}; 