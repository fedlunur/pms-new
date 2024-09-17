import React from 'react';
import { Toolbar } from 'react-big-calendar';

const CustomToolbar = ({ label, onNavigate, view }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button
          type="button"
          className="rbc-btn"
          onClick={() => onNavigate('TODAY')}
          style={{ fontWeight: view === 'day' && 'bold' }} 
        >
          Today
        </button>
        <button
          type="button"
          className="rbc-btn"
          onClick={() => onNavigate('PREV')}
        >
          Back
        </button>
        <button
          type="button"
          className="rbc-btn"
          onClick={() => onNavigate('NEXT')}
        >
          Next
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
    </div>
  );
};

export default CustomToolbar;
