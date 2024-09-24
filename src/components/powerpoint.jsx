import React from 'react';
import { Carousel } from 'antd';
const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
//   background: '#364d79',
};
import './powerpoint.css';
const Powerpoint = () => (
  <Carousel autoplay className='h-full'>
    <div className='h-[600px] powerpoint-bg'>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div className='h-[600px] powerpoint-bg'>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div className='h-[600px] powerpoint-bg'>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div className='h-[600px] powerpoint-bg'>
      <h3 style={contentStyle}>4</h3>
    </div>
    
  </Carousel>
);
export default Powerpoint;