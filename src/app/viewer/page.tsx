'use client';

import { useEffect, useState } from 'react';
import { getPusherClient } from '@/lib/pusher-client';
import { ShowPhotoPayload, AdjustImagePayload } from '@/lib/types';
import './viewer.css';

export default function Viewer() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [personName, setPersonName] = useState<string>('');
  
  const [adjustments, setAdjustments] = useState<AdjustImagePayload>({
    brightness: 100,
    saturation: 100,
    gamma: 1.0,
    zoom: 100
  });

  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe('viewer');

    channel.bind('show-photo', (data: ShowPhotoPayload) => {
      setPhotoUrl(data.photoUrl);
      setPersonName(data.personName);
      setFadeKey(prev => prev + 1);
    });

    channel.bind('adjust-image', (data: AdjustImagePayload) => {
      setAdjustments(data);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('viewer');
    };
  }, []);
  
  const filterStyle = `brightness(${adjustments.brightness}%) saturate(${adjustments.saturation}%) contrast(${adjustments.gamma})`;
  const transformStyle = `scale(${adjustments.zoom / 100})`;

  if (!photoUrl) {
    return (
      <div className="viewer-empty">
        <p>Menunggu foto dari Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      <div className="image-wrapper">
        <img 
          key={fadeKey}
          src={photoUrl} 
          alt={personName}
          className="viewer-image fade-in"
          style={{ 
            filter: filterStyle,
            transform: transformStyle
          }}
        />
      </div>
    </div>
  );
}
