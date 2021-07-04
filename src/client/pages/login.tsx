import React, { useState } from 'react';
import Router from 'next/router';
import { Button, Card, CardContent, CardHeader, makeStyles, TextField } from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../shared/utils/get-logged-in-user';
import NavBar from '../shared/components/NavBar';
import { useForm } from 'react-hook-form';

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

interface FormData {
  username: string;
  password: string;
}

const useStyles = makeStyles(() => ({
  card: {
    paddingTop: 0,
    maxWidth: '400px',
  },
}));

const Login = (): JSX.Element => {
  const classes = useStyles();
  const [disabled, setDisabled] = useState(false);
  const { handleSubmit, register } = useForm<FormData>();

  const onClickLogin = (data) => {
    setDisabled(true);
    fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('error logging in');
        }
        if (response.status !== 200) {
          console.error('unexpected non 200 response', response.status, response.statusText);
          throw new Error('error logging in');
        }
        return response.json();
      })
      .then((respJson) => {
        console.log('successfully logged in!', respJson);
        Router.push('/');
      })
      .catch((err) => {
        console.error('an error occurred in login', err);
        setDisabled(false);
      });
  };
  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised className="p8">
          <CardHeader title="Login"></CardHeader>
          <CardContent className={classes.card}>
            <form noValidate onSubmit={handleSubmit(onClickLogin)}>
              <div>
                <TextField
                  required
                  fullWidth
                  disabled={disabled}
                  {...register('username')}
                  id="username"
                  name="username"
                  label="Username (or email)"
                  placeholder="someone"
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <div className="mt8">
                <TextField
                  required
                  fullWidth
                  disabled={disabled}
                  {...register('password')}
                  className="mt16"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex flexcolumn mt16">
                <div className="flex jc">
                  <Button type="submit" variant="contained" color="primary" disabled={disabled}>
                    Login
                  </Button>
                </div>
                <div className="mt16 flex jc">
                  <a href="/register">Register new account</a>
                </div>
                <div className="mt8 flex jc">
                  <a href="/password-reset">Forgot password?</a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
