'use client';

import { Container, Heading, SimpleGrid, Card, CardBody, Text, Link, Badge, VStack, HStack, Box, Button, Wrap, IconButton, CheckIcon, CardHeader, Image, CardFooter } from '@yamada-ui/react';
import mockData from '@/data/mockData.json';
import { PlusIcon } from 'lucide-react';
import { warn } from 'console';

export default function Events() {
  const { events, users, owners } = mockData;

  const getEventOwners = (eventId: number) => {
    const ownerIds = owners
      .filter(owner => owner.event_id === eventId)
      .map(owner => owner.user_id);

    return users.filter(user => ownerIds.includes(user.id));
  };

  return (
    <Container maxW="8xl" py={8}>
      <Heading size="2xl" mb={8}>全イベント一覧</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
        {events.map(event => {
          const eventOwners = getEventOwners(event.id);

          return (
            <Card key={event.id} variant="outline" _hover={{ shadow: 'lg' }} transition="all 0.2s">
              <CardBody>
                <VStack align="stretch">
                  <Heading size="md">{event.title}</Heading>

                  <Link
                    href={event.event_url}
                    isExternal
                    fontSize="sm"
                  >
                    イベントページを見る
                  </Link>

                  {eventOwners.length > 0 && (
                    <Box borderTopWidth="" pt={4}>
                      <Text fontSize="sm" color="" mb={2}>
                        参加者:
                      </Text>
                      <HStack wrap="wrap" gap={2}>
                        {eventOwners.map(owner => (
                          <Badge
                            key={owner.id}
                            variant="subtle"
                          >
                            {owner.name}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}
