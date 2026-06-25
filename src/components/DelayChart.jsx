import React from 'react';

export default function DelayChart({ inputs, results }) {
  const { worksheet, V_p, V_maj_s, L, S_p, t_s, compliance } = inputs;
  
  // Chart dimensions & margins
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Data ranges
  const xMax = 2100;
  const yMax = 700;

  // Helpers to map data space to SVG coordinates
  const getSvgX = (xVal) => margin.left + (xVal / xMax) * plotWidth;
  const getSvgY = (yVal) => margin.top + plotHeight - (yVal / yMax) * plotHeight;

  // Generate curve points
  const getDelayCurvePoints = (DpVal) => {
    const points = [];
    const tc = (L / S_p) + t_s;
    
    for (let x = 0; x <= xMax; x += 30) {
      const v = worksheet === 1 ? x / 3600 : (x / 0.7) / 3600;
      let y = yMax * 2; // Default to off-chart
      if (v > 0) {
        const dp_factor = (Math.exp(v * tc) - v * tc - 1) / v;
        const calcY = (3600 * DpVal) / dp_factor;
        if (calcY > 0 && calcY < yMax * 2) {
          y = calcY;
        }
      }
      points.push({ x, y });
    }
    return points;
  };

  const getWarrantCurvePoints = () => {
    const points = [];
    for (let x = 0; x <= xMax; x += 30) {
      let scVal;
      if (worksheet === 1) {
        scVal = (0.00021 * x * x - 0.74072 * x + 734.125) / 0.75;
        if (scVal < 133) scVal = 133;
      } else {
        scVal = (0.00035 * x * x - 0.80083 * x + 529.197) / 0.75;
        if (scVal < 93) scVal = 93;
      }
      if (S_p < 3.5) {
        scVal = scVal * 0.5;
      }
      points.push({ x, y: Math.min(scVal, yMax * 2) });
    }
    return points;
  };

  // Compute curve paths
  const warrantPoints = getWarrantCurvePoints();
  const delay1_3_Points = getDelayCurvePoints(1.3);
  const delay5_3_Points = getDelayCurvePoints(5.3);
  const delay21_3_Points = getDelayCurvePoints(21.3);

  // Helper to convert points to SVG path string (for filled area below the curve)
  const getAreaPath = (points) => {
    if (points.length === 0) return '';
    let path = `M ${getSvgX(points[0].x)},${getSvgY(0)}`;
    points.forEach((p) => {
      path += ` L ${getSvgX(p.x)},${getSvgY(p.y)}`;
    });
    path += ` L ${getSvgX(points[points.length - 1].x)},${getSvgY(0)} Z`;
    return path;
  };

  // Helper to convert points to SVG stroke line
  const getLinePath = (points) => {
    if (points.length === 0) return '';
    let path = `M ${getSvgX(points[0].x)},${getSvgY(points[0].y)}`;
    points.forEach((p) => {
      path += ` L ${getSvgX(p.x)},${getSvgY(p.y)}`;
    });
    return path;
  };

  // SVG coordinates for No Treatment line
  const noTreatmentY = worksheet === 1 ? 20 : 14;
  const noTreatmentSvgY = getSvgY(noTreatmentY);

  // 1. Background / Signal Proposed (Dark Red)
  const signalProposedPath = `M ${getSvgX(0)},${getSvgY(yMax)} L ${getSvgX(xMax)},${getSvgY(yMax)} L ${getSvgX(xMax)},${getSvgY(0)} L ${getSvgX(0)},${getSvgY(0)} Z`;

  // 2. Red HAWK Device Area (below warrant curve, above delay threshold)
  const redDevicePath = getAreaPath(warrantPoints);

  // 3. Active/Enhanced Area (below warrant and below active limit)
  // Active limit is 21.3 if compliance is high, 5.3 if compliance is low
  const activeLimitPoints = compliance === 'high' ? delay21_3_Points : delay5_3_Points;
  
  // We intersect the activeLimitPoints with the warrant curve
  const activeEnhancedPoints = activeLimitPoints.map((pt, idx) => {
    const warrantPt = warrantPoints[idx];
    return {
      x: pt.x,
      y: Math.min(pt.y, warrantPt.y)
    };
  });
  const activeEnhancedPath = getAreaPath(activeEnhancedPoints);

  // 4. Crosswalk Area (below warrant and below 1.3 delay - Worksheet 1 only)
  const crosswalkPoints = delay1_3_Points.map((pt, idx) => {
    const warrantPt = warrantPoints[idx];
    return {
      x: pt.x,
      y: Math.min(pt.y, warrantPt.y)
    };
  });
  const crosswalkPath = worksheet === 1 ? getAreaPath(crosswalkPoints) : '';

  // Current user point SVG coordinates
  const userSvgX = getSvgX(V_maj_s || 0);
  const userSvgY = getSvgY(V_p || 0);

  // Grid Ticks
  const xTicks = [0, 300, 600, 900, 1200, 1500, 1800, 2100];
  const yTicks = [0, 100, 200, 300, 400, 500, 600, 700];

  return (
    <div className="card chart-container-card">
      <div className="card-header">
        <h3>📈 NCHRP 562 Graphical Solution</h3>
        <div className="chart-legend-row">
          <span className="legend-item"><span className="legend-box grey"></span> No Treatment</span>
          {worksheet === 1 && <span className="legend-item"><span className="legend-box blue"></span> Crosswalk</span>}
          <span className="legend-item"><span className="legend-box yellow"></span> Active/Enhanced</span>
          <span className="legend-item"><span className="legend-box red"></span> Red (HAWK)</span>
          <span className="legend-item"><span className="legend-box darkred"></span> Signal Proposed</span>
        </div>
      </div>
      
      <div className="chart-wrapper">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="nchrp-chart-svg"
          width="100%" 
          height="100%"
        >
          {/* DEFINITIONS FOR GRADIENTS */}
          <defs>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="30%" stopColor="#1e90ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e90ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. BACKGROUND (SIGNAL PROPOSED) */}
          <path d={signalProposedPath} fill="#7A0000" opacity="0.8" />

          {/* 2. RED DEVICE AREA */}
          <path d={redDevicePath} fill="#C62828" opacity="0.85" />

          {/* 3. ACTIVE / ENHANCED AREA */}
          <path d={activeEnhancedPath} fill="#FBC02D" opacity="0.9" />

          {/* 4. CROSSWALK AREA */}
          {worksheet === 1 && (
            <path d={crosswalkPath} fill="#1565C0" opacity="0.85" />
          )}

          {/* 5. NO TREATMENT AREA */}
          <rect 
            x={getSvgX(0)} 
            y={noTreatmentSvgY} 
            width={plotWidth} 
            height={getSvgY(0) - noTreatmentSvgY} 
            fill="#5D6D7E" 
            opacity="0.9" 
          />

          {/* DRAW BOUNDARY STROKES */}
          {/* No Treatment horizontal line */}
          <line 
            x1={getSvgX(0)} 
            y1={noTreatmentSvgY} 
            x2={getSvgX(xMax)} 
            y2={noTreatmentSvgY} 
            stroke="#2C3E50" 
            strokeWidth="2" 
            strokeDasharray="4 4"
          />

          {/* Delay 1.3 Curve (Crosswalk limit) */}
          {worksheet === 1 && (
            <path 
              d={getLinePath(delay1_3_Points)} 
              fill="none" 
              stroke="#0D47A1" 
              strokeWidth="2.5" 
            />
          )}

          {/* Active limit Curve (5.3 or 21.3) */}
          <path 
            d={getLinePath(activeLimitPoints)} 
            fill="none" 
            stroke="#F57F17" 
            strokeWidth="2.5" 
          />

          {/* Signal Warrant SC Curve */}
          <path 
            d={getLinePath(warrantPoints)} 
            fill="none" 
            stroke="#8E0000" 
            strokeWidth="3" 
          />

          {/* GRID LINES & AXES */}
          {/* X Grid & Ticks */}
          {xTicks.map((tick, idx) => (
            <g key={`x-${idx}`}>
              <line 
                x1={getSvgX(tick)} 
                y1={margin.top} 
                x2={getSvgX(tick)} 
                y2={margin.top + plotHeight} 
                stroke="#dcdcdc" 
                strokeWidth="1" 
                strokeOpacity="0.2"
              />
              <line 
                x1={getSvgX(tick)} 
                y1={margin.top + plotHeight} 
                x2={getSvgX(tick)} 
                y2={margin.top + plotHeight + 5} 
                stroke="#666" 
                strokeWidth="1.5"
              />
              <text 
                x={getSvgX(tick)} 
                y={margin.top + plotHeight + 20} 
                className="axis-label-tick"
                textAnchor="middle"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Y Grid & Ticks */}
          {yTicks.map((tick, idx) => (
            <g key={`y-${idx}`}>
              <line 
                x1={margin.left} 
                y1={getSvgY(tick)} 
                x2={margin.left + plotWidth} 
                y2={getSvgY(tick)} 
                stroke="#dcdcdc" 
                strokeWidth="1" 
                strokeOpacity="0.2"
              />
              <line 
                x1={margin.left - 5} 
                y1={getSvgY(tick)} 
                x2={margin.left} 
                y2={getSvgY(tick)} 
                stroke="#666" 
                strokeWidth="1.5"
              />
              <text 
                x={margin.left - 10} 
                y={getSvgY(tick) + 4} 
                className="axis-label-tick text-right"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* AXIS LABELS */}
          {/* X Axis Title */}
          <text 
            x={margin.left + plotWidth / 2} 
            y={height - 10} 
            className="axis-title"
            textAnchor="middle"
          >
            Major Road Volume - Total of Both Approaches (veh/h)
          </text>

          {/* Y Axis Title */}
          <text 
            x={-(margin.top + plotHeight / 2)} 
            y={18} 
            className="axis-title"
            textAnchor="middle"
            transform="rotate(-90)"
          >
            Pedestrian Volume Crossing Major Road (ped/h)
          </text>

          {/* GRAPH LABELS FOR ZONES */}
          <text x={getSvgX(180)} y={noTreatmentSvgY + (getSvgY(0) - noTreatmentSvgY) / 2 + 5} className="zone-text" textAnchor="middle">No Treatment</text>
          
          {worksheet === 1 && (
            <text x={getSvgX(250)} y={getSvgY(60)} className="zone-text white-text" textAnchor="middle">Crosswalk</text>
          )}

          <text x={getSvgX(650)} y={getSvgY(180)} className="zone-text" textAnchor="middle">Active / Enhanced</text>
          
          <text x={getSvgX(1200)} y={getSvgY(250)} className="zone-text white-text" textAnchor="middle">
            {compliance === 'high' ? 'E/A HC, Red LC*' : 'Red (HAWK)'}
          </text>
          
          <text x={getSvgX(1700)} y={getSvgY(450)} className="zone-text white-text" textAnchor="middle">Signal Proposed</text>

          {/* CURRENT OPERATING POINT INDICATOR */}
          {V_maj_s > 0 && V_p > 0 && userSvgX >= margin.left && userSvgX <= margin.left + plotWidth && userSvgY >= margin.top && userSvgY <= margin.top + plotHeight && (
            <g>
              {/* Outer pulsing glow */}
              <circle 
                cx={userSvgX} 
                cy={userSvgY} 
                r="18" 
                fill="url(#glowGrad)" 
                className="pulse-glow"
              />
              {/* Inner white circle */}
              <circle 
                cx={userSvgX} 
                cy={userSvgY} 
                r="6" 
                fill="#ffffff" 
                stroke="#1e90ff" 
                strokeWidth="2.5"
                className="glow-dot"
              />
              {/* Coordinates tooltip text */}
              <g className="chart-tooltip">
                <rect 
                  x={userSvgX + 12} 
                  y={userSvgY - 32} 
                  width="110" 
                  height="26" 
                  rx="4" 
                  fill="rgba(33, 33, 33, 0.9)"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                <text 
                  x={userSvgX + 22} 
                  y={userSvgY - 15} 
                  fill="#ffffff" 
                  fontSize="10" 
                  fontWeight="bold"
                >
                  ({V_maj_s} veh, {V_p} ped)
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
