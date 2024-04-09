import { Title, Text, Anchor, stylesToString } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text className={classes.pageTitle}>
          Wanderlust
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Finding pleasure once again in adventures imagined, crafted and experienced. 
      </Text>
    </>
  );
}
