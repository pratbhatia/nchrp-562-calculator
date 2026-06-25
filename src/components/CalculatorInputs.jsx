import React from 'react';

export default function CalculatorInputs({ inputs, setInputs, onLoadElmStreet }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = value === '' ? '' : parseFloat(value);
    }
    
    const updatedInputs = { ...inputs, [name]: newValue };
    
    // Auto-select worksheet mode based on speed input
    if (name === 'speed') {
      if (newValue !== '') {
        updatedInputs.worksheet = newValue <= 35 ? 1 : 2;
      }
    }
    
    // Automatically manage V_maj_d when refuge island status changes
    if (name === 'hasRefuge') {
      if (newValue) {
        updatedInputs.V_maj_d = inputs.V_maj_s ? Math.round(inputs.V_maj_s / 2) : 0;
      } else {
        updatedInputs.V_maj_d = inputs.V_maj_s;
      }
    }
    
    // Automatically match V_maj_d to V_maj_s if no refuge island
    if (name === 'V_maj_s' && !inputs.hasRefuge) {
      updatedInputs.V_maj_d = newValue;
    }
    
    setInputs(updatedInputs);
  };

  const handleSpeedPreset = (presetSpeed) => {
    setInputs({
      ...inputs,
      S_p: presetSpeed
    });
  };

  return (
    <div className="card inputs-container">
      <div className="card-header">
        <h3>⚡ Calculator Parameters</h3>
        <button className="btn btn-secondary" onClick={onLoadElmStreet}>
          ✏️ Load Page 72 (Elm St) Example
        </button>
      </div>
      
      <div className="inputs-grid">
        <div className="input-group">
          <label htmlFor="speed">Speed on Major Street, Smaj (mph):</label>
          <input
            id="speed"
            name="speed"
            type="number"
            min="0"
            value={inputs.speed}
            onChange={handleChange}
            placeholder="e.g. 35"
            className="speed-input-highlight"
          />
          <span className="input-hint">
            Speeds ≤ 35 mph load Worksheet 1. Speeds &gt; 35 mph load Worksheet 2.
          </span>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="V_p">Pedestrian Peak Hour Volume (ped/h):</label>
            <input
              id="V_p"
              name="V_p"
              type="number"
              min="0"
              value={inputs.V_p}
              onChange={handleChange}
              placeholder="e.g. 50"
            />
          </div>

          <div className="input-group">
            <label htmlFor="V_maj_s">Major Road Vehicle Volume, Both Approaches (veh/h):</label>
            <input
              id="V_maj_s"
              name="V_maj_s"
              type="number"
              min="0"
              value={inputs.V_maj_s}
              onChange={handleChange}
              placeholder="e.g. 1000"
            />
          </div>
        </div>

        <div className="refuge-box">
          <label className="checkbox-label">
            <input
              name="hasRefuge"
              type="checkbox"
              checked={inputs.hasRefuge}
              onChange={handleChange}
            />
            <span>Is a pedestrian median refuge island present (min 6 ft wide)?</span>
          </label>
          {inputs.hasRefuge && (
            <div className="input-group fade-in" style={{ marginTop: '10px' }}>
              <label htmlFor="V_maj_d">Approach Vehicle Volume Being Crossed (veh/h):</label>
              <input
                id="V_maj_d"
                name="V_maj_d"
                type="number"
                min="0"
                value={inputs.V_maj_d}
                onChange={handleChange}
              />
              <span className="input-hint">
                Calculations check delay for the crossed approach individually when a refuge is present.
              </span>
            </div>
          )}
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="L">Pedestrian Crossing Distance (ft):</label>
            <input
              id="L"
              name="L"
              type="number"
              min="0"
              value={inputs.L}
              onChange={handleChange}
              placeholder="e.g. 56"
            />
          </div>

          <div className="input-group">
            <label htmlFor="t_s">Start-up & clearance time, ts (s):</label>
            <input
              id="t_s"
              name="t_s"
              type="number"
              min="0"
              step="0.5"
              value={inputs.t_s}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Pedestrian Walking Speed, Sp (ft/s):</label>
          <div className="speed-preset-container">
            <input
              name="S_p"
              type="number"
              min="0.1"
              step="0.1"
              value={inputs.S_p}
              onChange={handleChange}
            />
            <button 
              type="button" 
              className={`preset-btn ${inputs.S_p === 3.5 ? 'active' : ''}`}
              onClick={() => handleSpeedPreset(3.5)}
            >
              General (3.5 ft/s)
            </button>
            <button 
              type="button" 
              className={`preset-btn ${inputs.S_p === 3.0 ? 'active' : ''}`}
              onClick={() => handleSpeedPreset(3.0)}
            >
              Older/Less-Able (3.0 ft/s)
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Expected Regional Motorist Compliance:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="compliance"
                value="high"
                checked={inputs.compliance === 'high'}
                onChange={handleChange}
              />
              <span className="radio-custom"></span>
              <span>🟢 High (Drivers yield at uncontrolled crosswalks)</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="compliance"
                value="low"
                checked={inputs.compliance === 'low'}
                onChange={handleChange}
              />
              <span className="radio-custom"></span>
              <span>🔴 Low (Drivers rarely yield)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
