'use client'

import { Box, Container, Tabs, TabList, Tab, Flex, useBreakpointValue } from '@chakra-ui/react'
import { useRouter, usePathname } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const getTabIndex = () => {
    if (pathname === '/') return 0
    if (pathname === '/add') return 1
    return 0
  }

  const handleTabChange = (index: number) => {
    if (index === 0) router.push('/')
    if (index === 1) router.push('/add')
  }

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      bg="white"
      borderBottom="3px solid"
      borderColor="blue.500"
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex
          justify="space-between"
          align="center"
          h={isMobile ? 'auto' : '70px'}
          py={isMobile ? 4 : 0}
          px={4}
          direction={isMobile ? 'column' : 'row'}
          gap={isMobile ? 3 : 0}
        >
          {/* 로고 */}
          <Box
            fontSize={isMobile ? 'xl' : '2xl'}
            fontWeight="bold"
            color="blue.500"
            cursor="pointer"
            onClick={() => router.push('/')}
            _hover={{ color: 'blue.600' }}
          >
            상품 관리
          </Box>

          {/* Tabs */}
          <Tabs
            index={getTabIndex()}
            onChange={handleTabChange}
            colorScheme="blue"
            variant="line"
            w={isMobile ? 'full' : 'auto'}
          >
            <TabList border="none" justifyContent={isMobile ? 'space-around' : 'flex-start'}>
              <Tab
                fontSize="md"
                fontWeight="medium"
                flex={isMobile ? 1 : 'none'}
                _selected={{
                  color: 'blue.600',
                  borderBottomWidth: '3px',
                  fontWeight: 'bold'
                }}
              >
                상품 목록
              </Tab>
              <Tab
                fontSize="md"
                fontWeight="medium"
                flex={isMobile ? 1 : 'none'}
                _selected={{
                  color: 'blue.600',
                  borderBottomWidth: '3px',
                  fontWeight: 'bold'
                }}
              >
                상품 등록
              </Tab>
            </TabList>
          </Tabs>
        </Flex>
      </Container>
    </Box>
  )
}