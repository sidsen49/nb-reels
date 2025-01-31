import React from 'react';
import './blog.css'

const Blog = () => {
  const [ showPopup, setPopup ] = React.useState(false);
  return <>
    {showPopup && <><div className='videoOverlay'></div>
    <video src="/sample.mp4" width="500" height="440" type="video/mp4" controls className='videoStyle' />
    <img src='/closeButton.webp' className='crossIcon' onClick={() => {setPopup(false)}} /></>}
  <div className='blogOuterContainer'>
    <div className='blogInnerContainer'>
    <div className='headLineContainer'>
    <p className='headLine'>
    Is South East Corner Plot Good?
    </p>
    </div>
    <div className='imageHolder'>
      <div style={{ position: 'relative' }}>
        <div class='overLayScreen' onClick={() => {setPopup(true)}}></div>
        <img className='loader' src='/playButton.png' style={{ height: '40px', width: '40px' }}/>
      <img src="/dummyImage.jpg" style={{ height: '300px' }} />
      </div>
    </div>
    <div className='blogPost'>
      <div className='profileContainer'>
        <img src='profile.png' className='profilePic' alt='profile' /> <p className='profileText'>Priyanka</p>
      </div>
      <div className='blogTextStyle'>

      <p>I follow Vastu principles ardently and I know that according to Vastu Shastra

south east corner plot house plans

is considered to be a good plot for building a house. It is believed that this direction is ruled by the fire element, which represents energy, vitality, and prosperity. Houses built in the southeast corner are said to be blessed with positive energy and good fortune.</p>
<p><b>House Plans for South East Corner Cut Plot Vastu</b></p>

Here are some southeast corner plot house plans:
<p>Plan 1: This plan is for a two-story house with four bedrooms and three bathrooms. The ground floor includes a living room, dining room, kitchen, and two bedrooms. The first floor includes two bedrooms, a bathroom, and a balcony. The master bedroom is located in the southeast corner of the house, which is the best location for this room according to Vastu Shastra.</p>

<p>Plan 2: This plan is for a two-story house with three bedrooms and two bathrooms. The ground floor includes a living room, dining room, kitchen, and one bedroom. The first floor includes two bedrooms and a bathroom. The master bedroom is located in the southeast corner of the house, which is the best location for this room according to Vastu Shastra.</p>

<p>Plan 3: This plan is for a single-story house with three bedrooms and two bathrooms. The house includes a living room, dining room, kitchen, and three bedrooms. The master bedroom is located in the southeast corner of the house, which is the best location for this room according to Vastu Shastra.</p>

<p>You can make use of these

south east corner plot house plans or consult a Vastu experts yourself to find teh most suitable house plan for yourself.</p>


<p>
How to rent my warehouse to Amazon or other e-commerce companies:
You can post your property advertisement on Nobroker. Another way to find out if any company looking for a warehouse is to reach out to the companies through mail or use your personal contacts to get your warehouse property rented to a big company like Amazon. These are the important tips to keep in mind before approaching a client. And hope your query ‘How to rent my warehouse to Amazon by reading this answer’  is resolved.
</p>

      </div>
    </div>
    </div>
  </div>
  </>
}

export default Blog;
