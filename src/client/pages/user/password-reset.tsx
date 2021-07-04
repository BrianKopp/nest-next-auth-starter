import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, makeStyles, TextField } from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../../shared/utils/get-logged-in-user';
import NavBar from '../../shared/components/NavBar';
import { Controller, useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import { PasswordRequirementRegexes } from '../../../shared';

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

interface FormData {
  password: string;
  confirmPassword: string;
}

const useStyles = makeStyles(() => ({
  card: {
    paddingTop: 0,
    maxWidth: '400px',
  },
}));

const PasswordReset = (): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const { handleSubmit, control } = useForm<FormData>();

  const onClickForgotPassword = (data) => {
    setDisabled(true);
    const resetId = router.query.r;
    const userId = router.query.u;
    fetch(`/api/v1/auth/password-reset/${resetId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        password: data.password,
      }),
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error('password reset not found');
        }
        if (response.status !== 200) {
          console.error('unexpected non 200 response', response.status, response.statusText);
          throw new Error('unexpected error');
        }
        return response.json();
      })
      .then((respJson) => {
        console.log('successfully reset password!', respJson);
        Router.push('/user/login');
      })
      .catch((err) => {
        console.error('an error occurred while resetting password', err);
      });
  };
  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised className="p8">
          <CardHeader title="Reset Password"></CardHeader>
          <CardContent className={classes.card}>
            <form noValidate onSubmit={handleSubmit(onClickForgotPassword)}>
              <div className="">
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

                      return true;
                    },
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
              </div>{' '}
              <div className="flex flexcolumn mt32">
                <div className="flex jc">
                  <Button type="submit" variant="contained" color="primary" disabled={disabled}>
                    Reset Password
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PasswordReset;
