import React from 'react';
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

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    paddingTop: 0,
    maxWidth: '400px',
  },
}));

const Login = (): JSX.Element => {
  const classes = useStyles();
  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised className="p8">
          <CardHeader title="Login"></CardHeader>
          <CardContent className={classes.card}>
            <form noValidate>
              <div>
                <TextField
                  required
                  fullWidth
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
                  className="mt16"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
              </div>
            </form>
          </CardContent>
          <CardActions className="jc">
            <div className="flex flexcolumn">
              <div className="flex jc">
                <Button variant="contained" color="primary">
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
          </CardActions>
        </Card>
      </div>
    </>
  );
};

export default Login;
