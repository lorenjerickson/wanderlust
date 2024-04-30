import { Typography } from 'antd';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Typography className={classes.title}>
        Welcome to{' '}
      </Typography>
      <Typography className={classes.pageTitle}>
        Wanderlust
      </Typography>
      <Typography>
        Finding pleasure once again in adventures imagined, crafted and experienced.
      </Typography>
    </>
  );
}
