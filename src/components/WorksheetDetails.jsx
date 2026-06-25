import React from 'react';

export default function WorksheetDetails({ inputs, setInputs, results }) {
  const { worksheet, V_p, V_maj_s, V_maj_d, L, S_p, t_s, compliance, hasRefuge, speed, analyst, analysisDate, collectionDate, majorStreet, minorStreet, peakHour } = inputs;
  const { meetsMinPed, minPed, SC, SC_adj, meetsSignalWarrant, t_c, v, d_p, D_p, treatment } = results;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = value === '' ? '' : parseFloat(value);
    }

    const updatedInputs = { ...inputs, [name]: newValue };

    // Auto-update worksheet mode based on speed
    if (name === 'speed' && newValue !== '') {
      updatedInputs.worksheet = newValue <= 35 ? 1 : 2;
    }

    // Auto-sync V_maj_d when V_maj_s changes (if no refuge island)
    if (name === 'V_maj_s' && !inputs.hasRefuge) {
      updatedInputs.V_maj_d = newValue;
    }

    // Auto-sync V_maj_d when hasRefuge toggles
    if (name === 'hasRefuge') {
      if (newValue) {
        updatedInputs.V_maj_d = inputs.V_maj_s ? Math.round(inputs.V_maj_s / 2) : 0;
      } else {
        updatedInputs.V_maj_d = inputs.V_maj_s;
      }
    }

    setInputs(updatedInputs);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTreatmentColorClass = (tr) => {
    if (tr === 'NO TREATMENT') return 'treatment-val-grey';
    if (tr === 'CROSSWALK') return 'treatment-val-blue';
    if (tr === 'ACTIVE OR ENHANCED') return 'treatment-val-yellow';
    if (tr === 'RED' || tr === 'SIGNAL PROPOSED') return 'treatment-val-red';
    return '';
  };

  return (
    <div className="card worksheet-details-card printable-worksheet">
      <div className="card-header no-print">
        <h3>📄 NCHRP 562 Calculation Worksheet</h3>
        <button className="btn btn-primary" onClick={handlePrint}>
          🖨️ Print Worksheet
        </button>
      </div>

      <div className="print-header-show only-print">
        <h2>NCHRP REPORT 562 / TCRP REPORT 112 EVALUATION WORKSHEET</h2>
        <p>Calculated via NCHRP 562 Guidelines for Pedestrian Crossing Treatments</p>
      </div>

      {/* Analyst and Site Information */}
      <div className="worksheet-section">
        <h4 className="worksheet-section-title">Analyst and Site Information</h4>
        <div className="metadata-grid">
          <div className="meta-group">
            <label>Analyst:</label>
            <input 
              type="text" 
              name="analyst" 
              value={analyst} 
              onChange={handleInputChange} 
              className="worksheet-input" 
              placeholder="e.g. Maria"
            />
          </div>
          <div className="meta-group">
            <label>Major Street:</label>
            <input 
              type="text" 
              name="majorStreet" 
              value={majorStreet} 
              onChange={handleInputChange} 
              className="worksheet-input" 
              placeholder="e.g. Elm Street"
            />
          </div>
          <div className="meta-group">
            <label>Analysis Date:</label>
            <input 
              type="text" 
              name="analysisDate" 
              value={analysisDate} 
              onChange={handleInputChange} 
              className="worksheet-input" 
            />
          </div>
          <div className="meta-group">
            <label>Minor Street / Location:</label>
            <input 
              type="text" 
              name="minorStreet" 
              value={minorStreet} 
              onChange={handleInputChange} 
              className="worksheet-input" 
              placeholder="e.g. 2700 Block"
            />
          </div>
          <div className="meta-group">
            <label>Data Collection Date:</label>
            <input 
              type="text" 
              name="collectionDate" 
              value={collectionDate} 
              onChange={handleInputChange} 
              className="worksheet-input" 
            />
          </div>
          <div className="meta-group">
            <label>Peak Hour:</label>
            <input 
              type="text" 
              name="peakHour" 
              value={peakHour} 
              onChange={handleInputChange} 
              className="worksheet-input" 
              placeholder="e.g. 5 to 6 pm"
            />
          </div>
          <div className="meta-group">
            <label>Major Road Speed (mph):</label>
            <input 
              type="number" 
              name="speed" 
              value={speed} 
              onChange={handleInputChange} 
              className="worksheet-input speed-input-highlight" 
              min="0"
              placeholder="e.g. 35"
            />
          </div>
        </div>
      </div>

      {/* Worksheet Table */}
      <table className="worksheet-table">
        <thead>
          <tr>
            <th colSpan="2" className="table-step-header">
              {worksheet === 1 
                ? 'WORKSHEET 1: PEAK-HOUR, 35 MPH (55 KM/H) OR LESS' 
                : 'WORKSHEET 2: PEAK-HOUR, EXCEEDS 35 MPH (55 KM/H)'}
            </th>
            <th className="table-box-header" style={{ width: '80px' }}>Box</th>
            <th className="table-val-header" style={{ width: '180px' }}>Value / Input</th>
          </tr>
        </thead>
        <tbody>
          {/* Step 1 */}
          <tr className="step-row-header">
            <td colSpan="4">Step 1: Select worksheet (speed reflects posted or statutory speed limit or 85th percentile speed on the major street):</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              a) Worksheet 1 – 35 mph (55 km/h) or less<br />
              b) Worksheet 2 – exceeds 35 mph (55 km/h), communities with less than 10,000, or where major transit stop exists
            </td>
            <td className="box-number-col">1a</td>
            <td className="value-col highlight-val">
              {worksheet === 1 ? 'Worksheet 1 (≤35 mph)' : 'Worksheet 2 (>35 mph)'}
            </td>
          </tr>

          {/* Step 2 */}
          <tr className="step-row-header">
            <td colSpan="4">Step 2: Does the crossing meet minimum pedestrian volumes to be considered for a TCD type of treatment?</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Peak-hour pedestrian volume (ped/h), <em>Vp</em>
            </td>
            <td className="box-number-col">2a</td>
            <td className="value-col editable-col">
              <input 
                type="number" 
                name="V_p" 
                value={V_p} 
                onChange={handleInputChange} 
                className="table-input"
                min="0"
              />
            </td>
          </tr>
          <tr className="conditional-row">
            <td colSpan="4" className="condition-note">
              {worksheet === 1
                ? `If 2a ≥ 20 ped/h, then go to Step 3. If 2a < 20 ped/h, then consider median refuge islands, curb extensions, traffic calming, etc. as feasible.`
                : `If 2a ≥ 14 ped/h, then go to Step 3. If 2a < 14 ped/h, then consider median refuge islands, curb extensions, traffic calming, etc. as feasible.`}
              <span className={`status-tag ${meetsMinPed ? 'pass' : 'fail'}`} style={{ marginLeft: '10px' }}>
                {meetsMinPed ? 'Passed (Go to Step 3)' : 'Failed (No treatment)'}
              </span>
            </td>
          </tr>

          {/* Step 3 */}
          <tr className="step-row-header">
            <td colSpan="4">Step 3: Does the crossing meet the pedestrian volume warrant for a traffic signal?</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Major road volume, total of both approaches during peak hour (veh/h), <em>Vmaj-s</em>
            </td>
            <td className="box-number-col">3a</td>
            <td className="value-col editable-col">
              <input 
                type="number" 
                name="V_maj_s" 
                value={V_maj_s} 
                onChange={handleInputChange} 
                className="table-input"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Minimum signal warrant volume for peak hour (use 3a for Vmaj-s), <em>SC</em><br />
              <small className="math-formula">
                {worksheet === 1
                  ? 'SC = (0.00021 * Vmaj-s² - 0.74072 * Vmaj-s + 734.125)/0.75 OR [(0.00021 * 3a² - 0.74072 * 3a + 734.125)/0.75]'
                  : 'SC = (0.00035 * Vmaj-s² - 0.80083 * Vmaj-s + 529.197)/0.75 OR [(0.00035 * 3a² - 0.80083 * 3a + 529.197)/0.75]'}
              </small>
            </td>
            <td className="box-number-col">3b</td>
            <td className="value-col">{(SC || 0).toFixed(0)}</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              {worksheet === 1 
                ? 'If 3b < 133, then enter 133. If 3b >= 133, then enter 3b:' 
                : 'If 3b < 93, then enter 93. If 3b >= 93, then enter 3b:'}
            </td>
            <td className="box-number-col">3c</td>
            <td className="value-col">{worksheet === 1 ? Math.max(133, Math.round(SC || 0)) : Math.max(93, Math.round(SC || 0))}</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              If 15th percentile crossing speed of pedestrians is less than 3.5 ft/s (1.1 m/s), then reduce 3c by up to 50 percent; otherwise enter 3c:
            </td>
            <td className="box-number-col">3d</td>
            <td className="value-col highlight-val">{(SC_adj || 0).toFixed(0)}</td>
          </tr>
          <tr className="conditional-row">
            <td colSpan="4" className="condition-note">
              {meetsSignalWarrant 
                ? `If 2a ≥ 3d, then the warrant has been met and a traffic signal should be considered if not within 300 ft (91 m) of another traffic signal. Otherwise, the warrant has not been met. Go to Step 4.`
                : `Warrant NOT MET (2a < 3d). Go to Step 4.`}
              <span className={`status-tag ${meetsSignalWarrant ? 'pass' : 'info'}`} style={{ marginLeft: '10px' }}>
                {meetsSignalWarrant ? 'Warrant Met' : 'Go to Step 4'}
              </span>
            </td>
          </tr>

          {/* Step 4 */}
          <tr className="step-row-header">
            <td colSpan="4">Step 4: Estimate pedestrian delay</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Pedestrian crossing distance, curb to curb (ft), <em>L</em>
            </td>
            <td className="box-number-col">4a</td>
            <td className="value-col editable-col">
              <input 
                type="number" 
                name="L" 
                value={L} 
                onChange={handleInputChange} 
                className="table-input"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Pedestrian walking speed (ft/s), <em>Sp</em>
            </td>
            <td className="box-number-col">4b</td>
            <td className="value-col editable-col">
              <input 
                type="number" 
                name="S_p" 
                value={S_p} 
                onChange={handleInputChange} 
                className="table-input"
                min="0.1"
                step="0.1"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Pedestrian start-up time and end clearance time (s), <em>ts</em>
            </td>
            <td className="box-number-col">4c</td>
            <td className="value-col editable-col">
              <input 
                type="number" 
                name="t_s" 
                value={t_s} 
                onChange={handleInputChange} 
                className="table-input"
                min="0"
                step="0.5"
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Critical gap required for crossing pedestrian (s), tc = (L/Sp) + ts OR [(4a/4b) + 4c)]
            </td>
            <td className="box-number-col">4d</td>
            <td className="value-col">{(t_c || 0).toFixed(1)}</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col flex-instruction">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Major road volume, total both approaches or approach being crossed if median refuge island is present during peak hour (veh/h), <em>Vmaj-d</em></span>
                <label className="checkbox-label no-print" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  <input 
                    type="checkbox" 
                    name="hasRefuge" 
                    checked={hasRefuge} 
                    onChange={handleInputChange} 
                  />
                  <span>Is median refuge present?</span>
                </label>
              </div>
            </td>
            <td className="box-number-col">4e</td>
            <td className="value-col editable-col">
              <input 
                type="number" 
                name="V_maj_d" 
                value={V_maj_d} 
                onChange={handleInputChange} 
                className="table-input"
                min="0"
                disabled={!hasRefuge}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              {worksheet === 1
                ? 'Major road flow rate (veh/s), v = Vmaj-d/3600 OR [4e/3600]'
                : 'Major road flow rate (veh/s), v = (Vmaj-d/0.7)/3600 OR [(4e/0.7)/3,600]'}
            </td>
            <td className="box-number-col">4f</td>
            <td className="value-col">{(v || 0).toFixed(4)}</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Average pedestrian delay (s/person), <em>dp = (e^(v * tc) - v * tc - 1)/v OR [ (e^(4f * 4d) - 4f * 4d - 1)/4f ]</em>
            </td>
            <td className="box-number-col">4g</td>
            <td className="value-col">{(d_p || 0).toFixed(0)}</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Total pedestrian delay (h), <em>Dp = (dp x Vp)/3,600 OR [(4g x 2a)/3,600]</em><br />
              <small className="math-formula">
                (this is estimated delay for all pedestrians crossing the major roadway without a crossing treatment – assumes 0% compliance). This calculated value can be replaced with the actual total pedestrian delay measured at the site.
              </small>
            </td>
            <td className="box-number-col">4h</td>
            <td className="value-col highlight-val">{(D_p || 0).toFixed(1)}</td>
          </tr>

          {/* Step 5 */}
          <tr className="step-row-header">
            <td colSpan="4">Step 5: Select treatment based upon total pedestrian delay and expected motorist compliance</td>
          </tr>
          <tr>
            <td colSpan="2" className="instruction-col">
              Expected motorist compliance at pedestrian crossings in region, Comp = high or low:
            </td>
            <td className="box-number-col">5a</td>
            <td className="value-col editable-col">
              <select 
                name="compliance" 
                value={compliance} 
                onChange={handleInputChange} 
                className="table-input-select"
              >
                <option value="high">HIGH</option>
                <option value="low">LOW</option>
              </select>
            </td>
          </tr>

          {/* Step 5 Verbatim Decision Matrix Headers */}
          <tr className="table-subheader-row">
            <td style={{ fontWeight: 'bold', fontSize: '0.8rem', background: '#1e293b', color: '#cbd5e1' }}>
              Total Pedestrian Delay, Dp (from 4h) and Motorist Compliance, Comp (from 5a)
            </td>
            <td colSpan="2" style={{ fontWeight: 'bold', fontSize: '0.8rem', background: '#1e293b', color: '#cbd5e1', textAlign: 'center' }}>
              Treatment Category (see Descriptions of Sample Treatments for examples)
            </td>
            <td style={{ fontWeight: 'bold', fontSize: '0.8rem', background: '#1e293b', color: '#cbd5e1', textAlign: 'center' }}>
              Value Box
            </td>
          </tr>

          {/* Condition Row 1 (RED) */}
          <tr className={meetsMinPed && !meetsSignalWarrant && (D_p >= 21.3 || (D_p >= 5.3 && compliance === 'low')) ? 'active-treatment-row' : ''}>
            <td className="instruction-col font-medium">
              Dp ≥ 21.3 h (Comp = high or low)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OR<br />
              5.3 h ≤ Dp &lt; 21.3 h and Comp = low
            </td>
            <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
              RED
            </td>
            <td className={`value-col final-val ${meetsMinPed && !meetsSignalWarrant && (D_p >= 21.3 || (D_p >= 5.3 && compliance === 'low')) ? getTreatmentColorClass('RED') : ''}`}>
              {meetsMinPed && !meetsSignalWarrant && (D_p >= 21.3 || (D_p >= 5.3 && compliance === 'low')) ? 'RED' : ''}
            </td>
          </tr>

          {/* Condition Row 2 (ACTIVE OR ENHANCED) */}
          <tr className={
            worksheet === 1 
              ? (meetsMinPed && !meetsSignalWarrant && ((D_p >= 1.3 && D_p < 5.3) || (D_p >= 5.3 && D_p < 21.3 && compliance === 'high')) ? 'active-treatment-row' : '')
              : (meetsMinPed && !meetsSignalWarrant && (D_p < 5.3 || (D_p >= 5.3 && D_p < 21.3 && compliance === 'high')) ? 'active-treatment-row' : '')
          }>
            <td className="instruction-col font-medium">
              {worksheet === 1 
                ? (
                  <>
                    1.3 h ≤ Dp &lt; 5.3 h (Comp = high or low)<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OR<br />
                    5.3 h ≤ Dp &lt; 21.3 h and Comp = high
                  </>
                )
                : (
                  <>
                    Dp &lt; 5.3 h (Comp = high or low)<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OR<br />
                    5.3 h ≤ Dp &lt; 21.3 h and Comp = high
                  </>
                )
              }
            </td>
            <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
              ACTIVE OR ENHANCED
            </td>
            <td className={`value-col final-val ${
              worksheet === 1
                ? (meetsMinPed && !meetsSignalWarrant && ((D_p >= 1.3 && D_p < 5.3) || (D_p >= 5.3 && D_p < 21.3 && compliance === 'high')) ? getTreatmentColorClass('ACTIVE OR ENHANCED') : '')
                : (meetsMinPed && !meetsSignalWarrant && (D_p < 5.3 || (D_p >= 5.3 && D_p < 21.3 && compliance === 'high')) ? getTreatmentColorClass('ACTIVE OR ENHANCED') : '')
            }`}>
              {
                worksheet === 1
                  ? (meetsMinPed && !meetsSignalWarrant && ((D_p >= 1.3 && D_p < 5.3) || (D_p >= 5.3 && D_p < 21.3 && compliance === 'high')) ? 'ACTIVE OR ENHANCED' : '')
                  : (meetsMinPed && !meetsSignalWarrant && (D_p < 5.3 || (D_p >= 5.3 && D_p < 21.3 && compliance === 'high')) ? 'ACTIVE OR ENHANCED' : '')
              }
            </td>
          </tr>

          {/* Condition Row 3 (CROSSWALK - Worksheet 1 only) */}
          {worksheet === 1 && (
            <tr className={meetsMinPed && !meetsSignalWarrant && D_p < 1.3 ? 'active-treatment-row' : ''}>
              <td className="instruction-col font-medium">
                Dp &lt; 1.3 h (Comp = high or low)
              </td>
              <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }}>
                CROSSWALK
              </td>
              <td className={`value-col final-val ${meetsMinPed && !meetsSignalWarrant && D_p < 1.3 ? getTreatmentColorClass('CROSSWALK') : ''}`}>
                {meetsMinPed && !meetsSignalWarrant && D_p < 1.3 ? 'CROSSWALK' : ''}
              </td>
            </tr>
          )}

          {/* Step 5b Summary Row (representing box 5b) */}
          <tr className="final-result-row">
            <td colSpan="2" className="instruction-col">
              <strong>RECOMMENDED TREATMENT CATEGORY (Box 5b):</strong>
            </td>
            <td className="box-number-col" style={{ fontWeight: 'bold' }}>5b</td>
            <td className={`value-col final-val ${getTreatmentColorClass(treatment)}`}>
              {treatment}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
