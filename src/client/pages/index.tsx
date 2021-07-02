import React, { FunctionComponent } from 'react';
import { getLoggedInUserServerSideProps } from '../shared/utils/get-logged-in-user';

interface Props {
  user: any;
}

export const getServerSideProps = async function (context) {
  return getLoggedInUserServerSideProps(context);
};

const Home: FunctionComponent<Props> = ({ user }) => {
  return (
    <div>
      <h1>Welcome to your profile!</h1>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  );
};

export default Home;
