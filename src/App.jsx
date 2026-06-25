import React, { useState, useMemo } from 'react';
import { calculatePHB } from './utils/formulas';
import CalculatorInputs from './components/CalculatorInputs';
import ResultCard from './components/ResultCard';
import DelayChart from './components/DelayChart';
import WorksheetDetails from './components/WorksheetDetails';
import Glossary from './components/Glossary';

export default function App() {
  const [inputs, setInputs] = useState({
    worksheet: 1, // 1 for <=35 mph, 2 for >35 mph
    V_p: 50,
    V_maj_s: 1000,
    V_maj_d: 1000,
    hasRefuge: false,
    L: 56,
    S_p: 3.5,
    t_s: 3.0,
    compliance: 'high',
    speed: 35,
    analyst: 'Maria',
    analysisDate: '1/19/06',
    collectionDate: '1/19/06',
    majorStreet: 'Elm Street',
    minorStreet: '2700 Block',
    peakHour: '5 to 6 pm'
  });

  const results = useMemo(() => {
    return calculatePHB(inputs);
  }, [inputs]);

  const loadElmStreetExample = () => {
    setInputs({
      worksheet: 1,
      V_p: 50,
      V_maj_s: 1000,
      V_maj_d: 1000,
      hasRefuge: false,
      L: 56,
      S_p: 3.5,
      t_s: 3.0,
      compliance: 'high',
      speed: 35,
      analyst: 'Maria',
      analysisDate: '1/19/06',
      collectionDate: '1/19/06',
      majorStreet: 'Elm Street',
      minorStreet: '2700 Block',
      peakHour: '5 to 6 pm'
    });
  };

  return (
    <div className="app-container">
      {/* HEADER SECTION */}
      <header className="app-header no-print">
        <div className="header-title-container">
          <svg className="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48" style={{ marginRight: '12px' }}>
            <rect width="100" height="100" rx="20" fill="#16a34a" />
            <rect x="15" y="20" width="10" height="60" fill="#ffffff" />
            <rect x="35" y="20" width="10" height="60" fill="#ffffff" />
            <rect x="55" y="20" width="10" height="60" fill="#ffffff" />
            <rect x="75" y="20" width="10" height="60" fill="#ffffff" />
          </svg>
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>NCHRP 562 Guidelines for Pedestrian Crossing Treatments</h1>
            <h2>Pedestrian Hybrid Beacon &amp; Crossing Treatment Calculator</h2>
          </div>
        </div>
        <div className="header-badge">
          <span>Guidelines Edition</span>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <main className="dashboard-grid">
        {/* LEFT COLUMN: INPUTS & GLOSSARY */}
        <div className="column left-column no-print">
          <CalculatorInputs 
            inputs={inputs} 
            setInputs={setInputs} 
            onLoadElmStreet={loadElmStreetExample} 
          />
          <Glossary />
        </div>

        {/* RIGHT COLUMN: GRAPHS & RESULTS */}
        <div className="column right-column">
          <div className="no-print">
            <ResultCard results={results} />
          </div>
          <DelayChart inputs={inputs} results={results} />
        </div>

        {/* FULL WIDTH: EVALUATION SHEET */}
        <div className="column full-width">
          <WorksheetDetails inputs={inputs} setInputs={setInputs} results={results} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="app-footer no-print">
        <p>
          Calculations are based on <strong>NCHRP Report 562 / TCRP Report 112</strong>: 
          <em>Improving Pedestrian Safety at Unsignalized Crossings</em>.
        </p>
        <p className="copyright">&copy; 2026 NCHRP 562 Guidelines. Deployment Ready.</p>
      </footer>
    </div>
  );
}
