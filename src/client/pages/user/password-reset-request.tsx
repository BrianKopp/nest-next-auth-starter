import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, makeStyles, TextField } from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../../shared/utils/get-logged-in-user';
import NavBar from '../../shared/components/NavBar';
import { useForm } from 'react-hook-form';

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

interface FormData {
  username: string;
}

const useStyles = makeStyles(() => ({
  card: {
    paddingTop: 0,
    maxWidth: '400px',
  },
}));

const PasswordResetRequest = (): JSX.Element => {
  const classes = useStyles();
  const [disabled, setDisabled] = useState(false);
  const { handleSubmit, register } = useForm<FormData>();
  const [userNotFound, setUserNotFound] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const onClickForgotPassword = (data) => {
    setDisabled(true);
    fetch('/api/v1/auth/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error('user not found');
        }
        if (response.status !== 200) {
          console.error('unexpected non 200 response', response.status, response.statusText);
          throw new Error('unexpected error');
        }
        return response.json();
      })
      .then((respJson) => {
        console.log('successfully sent password reset email!', respJson);
        setShowInstructions(true);
        setUserNotFound(false);
      })
      .catch((err) => {
        console.error('an error occurred sending password reset', err);
        setUserNotFound(true);
        setDisabled(false);
      });
  };
  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised className="p8">
          <CardHeader title="Forgot Password"></CardHeader>
          <CardContent className={classes.card}>
            <form noValidate onSubmit={handleSubmit(onClickForgotPassword)}>
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
              <div className="flex flexcolumn mt32">
                <div className="flex jc">
                  <Button type="submit" variant="contained" color="primary" disabled={disabled}>
                    Reset Password
                  </Button>
                </div>
              </div>
            </form>
            {userNotFound && <p>User not found</p>}
            {showInstructions && <p>A password reset link has been sent to the email.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PasswordResetRequest;
