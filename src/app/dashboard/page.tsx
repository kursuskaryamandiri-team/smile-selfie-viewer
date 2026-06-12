'use client';

import { useEffect, useState, useRef } from 'react';
import { Person, DatabaseStructure, AdjustImagePayload } from '@/lib/types';
import { RefreshCw } from 'lucide-react';
import './dashboard.css';

export default function Dashboard() {
  const [structure, setStructure] = useState<DatabaseStructure | null>(null);
  
  const [selectedDay, setSelectedDay] = useState<string>('hari-1');
  const [selectedSession, setSelectedSession] = useState<'datang' | 'pulang'>('datang');
  
  const [playlist, setPlaylist] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const [adjustments, setAdjustments] = useState<AdjustImagePayload>({
    brightness: 100,
    saturation: 100,
    gamma: 1.0,
    zoom: 100
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    fetch('/api/structure')
      .then(res => res.json())
      .then((data: DatabaseStructure) => {
        setStructure(data);
        if (data.days.length > 0) {
          setSelectedDay(data.days[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedDay) return;
    
    fetch(`/api/photos?day=${selectedDay}&session=${selectedSession}`)
      .then(res => res.json())
      .then((data: { people: Person[] }) => {
        if (data.people && data.people.length > 0) {
          const shuffled = [...data.people].sort(() => Math.random() - 0.5);
          setPlaylist(shuffled);
          setCurrentIndex(0);
        } else {
          setPlaylist([]);
        }
      });
  }, [selectedDay, selectedSession]);

  useEffect(() => {
    if (playlist.length > 0) {
      const activePerson = playlist[currentIndex];
      
      fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'show-photo',
          data: {
            photoUrl: activePerson.photoUrl,
            personName: activePerson.name
          }
        })
      });
    }
  }, [currentIndex, playlist]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const timeout = setTimeout(() => {
      fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'adjust-image',
          data: adjustments
        })
      });
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [adjustments]);

  const handleNext = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleJumpToPerson = (folderName: string) => {
    const idx = playlist.findIndex(p => p.folder === folderName);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  };

  const updateAdjustment = (key: keyof AdjustImagePayload, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const resetAdjustment = (key: keyof AdjustImagePayload) => {
    const defaults: AdjustImagePayload = {
      brightness: 100,
      saturation: 100,
      gamma: 1.0,
      zoom: 100
    };
    updateAdjustment(key, defaults[key]);
  };

  const resetAll = () => {
    setAdjustments({
      brightness: 100,
      saturation: 100,
      gamma: 1.0,
      zoom: 100
    });
  };

  if (!structure) {
    return <div className="loading">Memuat Dashboard...</div>;
  }

  const activePerson = playlist[currentIndex];
  
  const filterStyle = `brightness(${adjustments.brightness}%) saturate(${adjustments.saturation}%) contrast(${adjustments.gamma})`;
  const transformStyle = `scale(${adjustments.zoom / 100})`;

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Control Panel</h1>
        <div className="status">Online</div>
      </header>

      <section className="preview-section">
        <div className="preview-container">
          {activePerson ? (
            <div className="preview-overflow">
              <img 
                src={activePerson.photoUrl} 
                alt="Preview" 
                style={{ filter: filterStyle, transform: transformStyle }}
              />
            </div>
          ) : (
            <div className="preview-empty">Tidak ada foto di sesi ini</div>
          )}
        </div>
      </section>

      <section className="card">
        <h3>Pengaturan Sesi</h3>
        
        <div className="form-group">
          <label>Hari ke-</label>
          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
            {structure.days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="segmented-control">
          <button 
            className={selectedSession === 'datang' ? 'active' : ''} 
            onClick={() => setSelectedSession('datang')}
          >
            Datang
          </button>
          <button 
            className={selectedSession === 'pulang' ? 'active' : ''} 
            onClick={() => setSelectedSession('pulang')}
          >
            Pulang
          </button>
        </div>
      </section>

      <section className="card">
        <h3>Navigasi Orang</h3>
        
        <div className="nav-buttons">
          <button onClick={handlePrev} className="btn-nav">⬅ Prev</button>
          <button onClick={handleNext} className="btn-nav primary">Next ➡</button>
        </div>

        <div className="form-group mt-3">
          <label>Tampilkan Nama:</label>
          <select 
            value={activePerson?.folder || ''} 
            onChange={e => handleJumpToPerson(e.target.value)}
          >
            {playlist.length === 0 && <option value="">-- Kosong --</option>}
            {playlist.map((p, idx) => (
              <option key={p.folder + idx} value={p.folder}>{p.name}</option>
            ))}
          </select>
        </div>
        <p className="hint">Urutan telah diacak otomatis (Auto-Randomizer aktif)</p>
      </section>

      <section className="card mb-5">
        <div className="adjust-header">
          <h3>Pengaturan Gambar</h3>
          <button onClick={resetAll} className="btn-reset-all">Reset All</button>
        </div>

        <AdjustmentSlider 
          label="Kecerahan" 
          value={adjustments.brightness} 
          min={0} max={200} 
          onChange={(v: number) => updateAdjustment('brightness', v)}
          onReset={() => resetAdjustment('brightness')}
          unit="%"
        />
        
        <AdjustmentSlider 
          label="Saturasi Warna" 
          value={adjustments.saturation} 
          min={0} max={300} 
          onChange={(v: number) => updateAdjustment('saturation', v)}
          onReset={() => resetAdjustment('saturation')}
          unit="%"
        />

        <AdjustmentSlider 
          label="Gamma (Contrast)" 
          value={adjustments.gamma} 
          min={0.2} max={5.0} step={0.1}
          onChange={(v: number) => updateAdjustment('gamma', v)}
          onReset={() => resetAdjustment('gamma')}
          unit=""
        />

        <AdjustmentSlider 
          label="Zoom In/Out" 
          value={adjustments.zoom} 
          min={50} max={300} 
          onChange={(v: number) => updateAdjustment('zoom', v)}
          onReset={() => resetAdjustment('zoom')}
          unit="%"
        />
      </section>
    </div>
  );
}

function AdjustmentSlider({ label, value, min, max, step = 1, onChange, onReset, unit }: any) {
  return (
    <div className="slider-group">
      <div className="slider-header">
        <label>{label}</label>
        <div className="slider-actions">
          <span className="value">{value}{unit}</span>
          <button onClick={onReset} className="btn-reset" title="Reset">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={e => onChange(parseFloat(e.target.value))} 
      />
    </div>
  );
}
