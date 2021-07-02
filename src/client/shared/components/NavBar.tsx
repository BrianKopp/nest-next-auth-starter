import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  someClass: {},
}));

const NavBar = (): JSX.Element => {
  const classes = useStyles();
  return <p>NavBar works</p>;
};

export default NavBar;
