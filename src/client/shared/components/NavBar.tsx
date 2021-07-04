import React from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Router from 'next/router';
interface Props {
  loggedIn?: boolean;
}

const NavBar = ({ loggedIn }: Props): JSX.Element => {
  const onClickLogout = () => {
    fetch('/api/v1/auth/logout', {
      method: 'POST',
    })
      .then(async (response) => {
        if (response.status !== 200) {
          console.log('non-200 code logging out', response.status, response.statusText);
          try {
            const json = await response.json();
            console.log('non-200 response json', json);
          } catch (err) {
            console.error('error getting response json', err);
          }
          throw new Error('error logging out');
        }
        return;
      })
      .then(() => {
        Router.push('/');
      })
      .catch((err) => {
        console.error('error logging out', err);
      });
  };
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
          {!loggedIn && (
            <Button color="inherit" href="/user/login">
              Login
            </Button>
          )}
          {loggedIn && (
            <Button color="inherit" onClick={onClickLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
