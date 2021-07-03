import React from 'react';
import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) => ({
  someClass: {},
}));

const NavBar = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div className="flexgrow">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className="mr16" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="flexgrow">
            My App
          </Typography>
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
