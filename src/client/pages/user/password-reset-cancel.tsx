import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, makeStyles } from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../../shared/utils/get-logged-in-user';
import NavBar from '../../shared/components/NavBar';
import Router, { useRouter } from 'next/router';

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

const useStyles = makeStyles(() => ({
  card: {
    paddingTop: 0,
    maxWidth: '400px',
  },
}));

const PasswordResetCancel = (): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const onClickCancel = () => {
    setDisabled(true);
    const resetId = router.query.r;
    fetch(`/api/v1/auth/password-reset/${resetId}/cancel`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error('password reset request not found');
        }
        if (response.status !== 200) {
          console.error('unexpected non 200 response', response.status, response.statusText);
          throw new Error('unexpected error');
        }
        return response.json();
      })
      .then((respJson) => {
        console.log('successfully cancelled password reset request!', respJson);
        Router.push('/user/login');
      })
      .catch((err) => {
        console.error('an error occurred while cancelling password reset', err);
      });
  };
  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised className="p8">
          <CardHeader title="Cancel Password Reset Request"></CardHeader>
          <CardContent className={classes.card}>
            <form noValidate onSubmit={onClickCancel}>
              <div className="flex flexcolumn mt32">
                <div className="flex jc">
                  <Button type="submit" variant="contained" color="primary" disabled={disabled}>
                    Cancel Password Reset
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

export default PasswordResetCancel;
