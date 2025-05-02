import React from 'react';

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3">
          <h5 className="text-muted">Please wait...</h5>
          <div className="progress" style={{ height: '2px', width: '120px' }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;