import React from 'react';
import Map from '../../components/map';
import RecordsList from '../../components/recordsList';

const HomePage = () => {
  return (
    <div className='App'>
      <Map />
      <RecordsList />
    </div>
  );
};

export default HomePage;
