import React from 'react';

const TREATMENT_STYLES = {
  'NO TREATMENT': {
    colorClass: 'treatment-grey',
    title: '⚪ No Traffic Control Treatment Recommended',
    description: 'The minimum peak-hour pedestrian volume is not met. Consider geometric elements (e.g. median refuge islands, curb extensions, traffic calming) if feasible, but active traffic control devices (signs, signals, beacons) are not recommended.'
  },
  'CROSSWALK': {
    colorClass: 'treatment-green',
    title: '🟢 Crosswalk Treatment Recommended',
    description: 'Marked crosswalk and pedestrian warning signs (W11-2) are appropriate. Motorists generally yield under low delay conditions on lower-speed roads.'
  },
  'ACTIVE OR ENHANCED': {
    colorClass: 'treatment-yellow',
    title: '🟡 Active or Enhanced Treatment Recommended',
    description: 'Active warning devices such as pedestrian-activated overhead/side-mounted flashing amber beacons, in-street pedestrian crossing signs, or high-visibility signs and markings should be considered.'
  },
  'RED': {
    colorClass: 'treatment-red',
    title: '🔴 Red Device (HAWK / Pedestrian Hybrid Beacon) Proposed',
    description: 'Pedestrian delays are high. A Pedestrian Hybrid Beacon (PHB / HAWK signal) or other red-beacon device is recommended to stop vehicular traffic and ensure safe crossing.'
  },
  'SIGNAL PROPOSED': {
    colorClass: 'treatment-red-dark',
    title: '🚨 Full Traffic Control Signal Proposed',
    description: 'The pedestrian signal warrant is fully met. A conventional pedestrian-actuated traffic control signal (green/yellow/red) should be considered, provided the crossing is not within 300 ft of another signal.'
  }
};

export default function ResultCard({ results }) {
  const { meetsMinPed, meetsSignalWarrant, t_c, d_p, D_p, treatment } = results;
  const style = TREATMENT_STYLES[treatment] || {
    colorClass: 'treatment-grey',
    title: 'Calculating...',
    description: 'Enter parameters to calculate results.'
  };

  return (
    <div className={`card result-card ${style.colorClass}`}>
      <div className="card-header">
        <h3>📊 Recommended Crossing Treatment</h3>
      </div>
      <div className="result-body">
        <div className="treatment-badge">
          <h2 className="treatment-title">{style.title}</h2>
        </div>
        <p className="treatment-desc">{style.description}</p>
        
        <hr className="divider" />
        
        <div className="result-metrics-grid">
          <div className="metric-box">
            <span className="metric-label">Critical Gap (tc):</span>
            <span className="metric-value">{t_c.toFixed(1)} s</span>
            <span className="metric-hint">Min. gap size needed to cross</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Avg. Pedestrian Delay (dp):</span>
            <span className="metric-value">{d_p.toFixed(0)} s/person</span>
            <span className="metric-hint">Average waiting time</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Total Approach Delay (Dp):</span>
            <span className="metric-value">{D_p.toFixed(1)} ped-h</span>
            <span className="metric-hint">Cumulative hourly delay</span>
          </div>
        </div>

        <div className="result-checks">
          <div className={`check-item ${meetsMinPed ? 'passed' : 'failed'}`}>
            <span className="check-icon">{meetsMinPed ? '✓' : '✗'}</span>
            <span>
              <strong>Minimum Pedestrian Volume Check:</strong>{' '}
              {meetsMinPed ? 'Passed' : 'Failed'}
            </span>
          </div>
          <div className={`check-item ${meetsSignalWarrant ? 'passed' : 'failed'}`}>
            <span className="check-icon">{meetsSignalWarrant ? '🚨' : '○'}</span>
            <span>
              <strong>MUTCD Pedestrian Signal Warrant:</strong>{' '}
              {meetsSignalWarrant ? 'MET (Signal Proposed)' : 'Not Met'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
