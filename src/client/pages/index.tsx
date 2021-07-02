import React, { FunctionComponent } from 'react';

interface Props {
  user: any;
}

export const getServerSideProps = async function ({ req, res }) {
  const user = req.session.get('user');
  console.log('checking the user session', user);
  if (!user) {
    console.log('user session not found, zoinks!');
    return {
      redirect: {
        destination: '/public',
        permanent: false,
      },
    };
  }
  return {
    props: { user },
  };
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
