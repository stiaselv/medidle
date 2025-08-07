import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { HighscoresPanel } from './HighscoresPanel';

interface HighscoresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HighscoresModal = ({ isOpen, onClose }: HighscoresModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Highscores</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} h="500px">
          <HighscoresPanel />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 