import React, { useState } from 'react';
import Router from 'next/router';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../shared/utils/get-logged-in-user';
import NavBar from '../shared/components/NavBar';
import { Controller, useForm } from 'react-hook-form';
import { PasswordRequirementRegexes, PasswordRequirements } from '../../shared';

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
  // const disabled = false;
  const { handleSubmit, control } = useForm<FormData>();
  const [updateValidationErrors, setUpdateValidationErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<PasswordRequirements[]>();
  const [passwordsNotMatch, setPasswordsNotMatch] = useState(false);

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
      .then(async (response) => {
        if (response.status === 400) {
          const json = await response.json();
          const { message } = json;
          console.error('error message', message);
          throw new Error(message);
        }
        if (response.status !== 200) {
          throw new Error('unexpected error');
        }
        // else it's 200
        return await response.json();
      })
      .then((responseJson) => {
        console.log('successfully logged in!', responseJson);
        Router.push('/');
      })
      .catch((err) => {
        console.error('error registering', err);
        setDisabled(false);
      });
  };

  // return <p>Hello world</p>;
  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised className="p8">
          <CardHeader title="Register" />
          <CardContent className={classes.card}>
            <form noValidate onSubmit={handleSubmit(onClickRegister)}>
              <div>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    pattern: {
                      value: /^\S+@\S+\.\S+$/i,
                      message: 'must be an email like <text>@<text>.<text>',
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      fullWidth
                      autoFocus
                      disabled={disabled}
                      id="email"
                      name="email"
                      label="Email Address"
                      placeholder="someone@example.com"
                      autoComplete="email"
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </div>
              <div className="mt8">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    validate: (value) => {
                      for (const key in PasswordRequirementRegexes) {
                        if (!value.match(PasswordRequirementRegexes[key])) {
                          return 'Length (8-24). Require upper, lower, symbol, and number';
                        }
                      }

                      return false;
                    },
                    // minLength: { value: 8, message: 'must be between 8-24 characters' },
                    // maxLength: { value: 24, message: 'must be between 8-24 characters' },
                    // pattern: { value: PasswordRequirementRegexes[Password], message: 'must include a symbol and number' }
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      fullWidth
                      disabled={disabled}
                      id="password"
                      label="Password"
                      type="password"
                      autoComplete="password"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </div>
              <div className="mt8">
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: { value: 8, message: 'password must have at least 8 characters' },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      fullWidth
                      disabled={disabled}
                      id="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      autoComplete="confirm-password"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
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
