export const getLoggedInUser = (req): any => {
  const user = req.user;
  console.log('checking the user session', user);
  return user || null;
};

export const getLoggedInUserServerSideProps = ({ req }) => {
  const user = getLoggedInUser(req);
  if (!user) {
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

export const getLoggedOutUserServerSideProps = ({ req }) => {
  const user = getLoggedInUser(req);
  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
