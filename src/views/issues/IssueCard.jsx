import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function IssueCard({ issue }) {
  return (
    <Card title={issue.title} subTitle={issue.description} style={{ height: '100px', textAlign: 'center',backgrouzndColor: "AppWorkspace" ,margin: '5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ marginTop: '20px' }}> 
        <Link to={`/issues/detail/${issue.id}`}>
          <Button label="View Details" className="p-button-info" style={{display: "flex", marginBottom:"2rem"}} />
        </Link>
      </div>
    </Card>
  );
}

export default IssueCard;
