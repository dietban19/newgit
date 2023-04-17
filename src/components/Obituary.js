import ObituaryContainer from './ObituaryContainer'
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




const Obituary = ({ obituaries }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRefresh = (e) => {
      if (e.currentTarget.performance.navigation.type === 1) {
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('load', handleRefresh);
    return () => {
      window.removeEventListener('load', handleRefresh);
    };
  }, [navigate]);
    return obituaries.length > 0 ? (
      <div className="obituary-list">
        {obituaries.map((item, index) => (

          <ObituaryContainer obituary={item} key={`node-item-${index}`} index={index} />
        ))}
      </div>
    ) : (

      <p id="no-note-yet"></p>

    );
  };
  

export default Obituary;