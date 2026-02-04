import { ProductForm } from "@/features/ui/ProductForm";
import { Heading, Box } from "@chakra-ui/react";

export default function AddProductPage() {
  return (
    <>
      <Box mb={8}>
        <Heading size="xl" textAlign="center">
          상품 등록
        </Heading>
      </Box>
      <ProductForm />
    </>
  );
} 