import React, { useState } from 'react';
import Router from 'next/router';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../shared/utils/get-logged-in-user';
import NavBar from '../shared/components/NavBar';
import { useForm } from 'react-hook-form';

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    paddingTop: 0,
    maxWidth: '400px',
  },
}));

const Register = (): JSX.Element => {
  const classes = useStyles();
  const [disabled, setDisabled] = useState(false);
  const { handleSubmit, register } = useForm<FormData>();

  const onClickRegister = (data) => {
    setDisabled(true);
    fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        username: data.email,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          console.error('error registering', response.status, response.statusText);
          throw new Error('Error registering');
        }
        return response.json();
      })
      .then((responseJson) => {
        console.log('successfully logged in!', responseJson);
        Router.push('/');
      })
      .catch((err) => {
        console.error('error registering', err);
        setDisabled(true);
      });
  };

  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised className="p8">
          <CardHeader title="Register" />
          <CardContent className={classes.card}>
            <form noValidate onSubmit={handleSubmit(onClickRegister)}>
              <div>
                <TextField
                  required
                  fullWidth
                  disabled={disabled}
                  {...register('email')}
                  id="email"
                  name="email"
                  label="Email Address"
                  placeholder="someone@example.com"
                  autoComplete="email"
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
              <div className="mt8">
                <TextField
                  required
                  fullWidth
                  disabled={disabled}
                  {...register('confirmPassword')}
                  className="mt16"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  autoComplete="confirm-password"
                />
              </div>
              <div className="flex flexcolumn mt16">
                <div className="flex jc">
                  <Button type="submit" variant="contained" color="primary" disabled={disabled}>
                    Register
                  </Button>
                </div>
                <div className="mt16 flex jc">
                  <a href="/login">Login to existing account</a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Register;
