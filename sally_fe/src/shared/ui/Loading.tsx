import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

export function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="50vh"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="lg">
          로딩중...
        </Text>
      </VStack>
    </Box>
  )
}