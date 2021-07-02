import React, { FunctionComponent } from 'react';
import NavBar from '../shared/components/NavBar';

const Public: FunctionComponent = () => {
  return (
    <div>
      <NavBar />
      <h1>You're not logged in.</h1>
    </div>
  );
};

export default Public;
