import React from 'react';
import {
  Card,
  CardContent,
  Container,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../shared/utils/get-logged-in-user';
import NavBar from '../shared/components/NavBar';

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

const useStyles = makeStyles((theme: Theme) => ({
  someClass: {},
}));

const Login = (): JSX.Element => {
  const classes = useStyles();
  return (
    <>
      <NavBar />
      <div className="flex flexcolumn aligncenter mt16">
        <Card raised>
          <CardContent>
            <p>Do something</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
