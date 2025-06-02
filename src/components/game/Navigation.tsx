import { Box, Button, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";
import { FaTree, FaMountain, FaCampground, FaStore } from 'react-icons/fa';

const locations = [
  { id: 'forest', name: 'Forest', icon: FaTree },
  { id: 'quarry', name: 'Quarry', icon: FaMountain },
  { id: 'camp', name: 'Camp', icon: FaCampground },
  { id: 'general_store', name: 'General Store', icon: FaStore },
]; 