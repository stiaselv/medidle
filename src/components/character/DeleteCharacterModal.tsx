import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import type { Character } from '../../types/game';

interface DeleteCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  onConfirm: () => Promise<void>;
}

export const DeleteCharacterModal: React.FC<DeleteCharacterModalProps> = ({
  isOpen,
  onClose,
  character,
  onConfirm,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (confirmationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm');
      return;
    }

    if (!character) return;

    setIsDeleting(true);
    setError('');

    try {
      await onConfirm();
      onClose();
      setConfirmationText('');
    } catch (error) {
      setError('Failed to delete character. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    setError('');
    setIsDeleting(false);
    onClose();
  };

  if (!character) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent bg="gray.700" color="white">
        <ModalHeader>Delete Character</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>
              Are you sure you want to delete <strong>{character.name}</strong>?
            </Text>
            <Text fontSize="sm" color="gray.300">
              This action cannot be undone. All progress, items, and achievements will be permanently lost.
            </Text>
            <Text fontSize="sm" color="gray.300">
              To confirm deletion, please type "DELETE" below:
            </Text>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              bg="gray.600"
              borderColor="gray.500"
              _focus={{ borderColor: 'red.400' }}
              color="white"
            />
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={isDeleting}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleConfirm}
            isLoading={isDeleting}
            loadingText="Deleting..."
            isDisabled={confirmationText !== 'DELETE'}
          >
            Delete Character
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 