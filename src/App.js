import React from 'react';

import StepForm from './component/stepForm';
import Blog from './component/blog';
import './App.css';

function App() {
  const [ isBlog, setBlog ] = React.useState(false);
  const [ video, setVideo ] = React.useState('');

  return (
    <>
    {!isBlog ? <div className='formOuterContainer'>
      <StepForm setBlog={setBlog} setVideo={setVideo} />
    </div> : null}
    {isBlog && <Blog />}
    </>
  );
}

export default App;
