import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { getLoggedOutUserServerSideProps } from '../shared/utils/get-logged-in-user';
import NavBar from '../shared/components/NavBar';

export const getServerSideProps = async function (context) {
  return getLoggedOutUserServerSideProps(context);
};

const useStyles = makeStyles((theme: Theme) => ({
  someClass: {},
}));

const Register = (): JSX.Element => {
  const classes = useStyles();
  return (
    <>
      <NavBar />
      <p>Need to register</p>
    </>
  );
};

export default Register;
