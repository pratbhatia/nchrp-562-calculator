/**
 * NCHRP Report 562 Pedestrian Hybrid Beacon / Crossing Treatment Calculator
 * Formulas & Logic
 */

export function calculatePHB({
  worksheet, // 1 (<= 35 mph) or 2 (> 35 mph)
  V_p,       // Pedestrian volume (ped/h)
  V_maj_s,   // Major road volume for signal warrant (veh/h)
  V_maj_d,   // Major road volume for delay (veh/h)
  L,         // Crossing distance (ft)
  S_p,       // Pedestrian walking speed (ft/s)
  t_s = 3,   // Start-up and clearance time (s)
  compliance // 'high' or 'low'
}) {
  const worksheetNum = parseInt(worksheet) || 1;
  const V_p_num = parseFloat(V_p) || 0;
  const V_maj_s_num = parseFloat(V_maj_s) || 0;
  const V_maj_d_num = parseFloat(V_maj_d) || 0;
  const L_num = parseFloat(L) || 0;
  const S_p_num = parseFloat(S_p) || 3.5;
  const t_s_num = parseFloat(t_s) !== undefined && parseFloat(t_s) !== null && !isNaN(parseFloat(t_s)) ? parseFloat(t_s) : 3.0;

  // Step 2: Minimum Pedestrian Volume Check
  const minPed = worksheetNum === 1 ? 20 : 14;
  const meetsMinPed = V_p_num >= minPed;

  // Step 3: Signal Warrant Check (SC)
  let SC;
  if (worksheetNum === 1) {
    // Equation for speed <= 35 mph, capped at the parabola vertex (1764 veh/h)
    const V_maj_cap = Math.min(V_maj_s_num, 1764);
    SC = (0.00021 * Math.pow(V_maj_cap, 2) - 0.74072 * V_maj_cap + 734.125) / 0.75;
    if (SC < 133) SC = 133;
  } else {
    // Equation for speed > 35 mph, capped at the parabola vertex (1144 veh/h)
    const V_maj_cap = Math.min(V_maj_s_num, 1144);
    SC = (0.00035 * Math.pow(V_maj_cap, 2) - 0.80083 * V_maj_cap + 529.197) / 0.75;
    if (SC < 93) SC = 93;
  }

  // Walking speed adjustment (Step 3d)
  let SC_adj = SC;
  const hasSpeedReduction = S_p_num < 3.5;
  if (hasSpeedReduction) {
    SC_adj = SC * 0.5; // up to 50% reduction (standard is 50%)
  }

  const meetsSignalWarrant = V_p_num >= SC_adj;

  // Step 4: Pedestrian Delay Estimation
  // Critical Gap (tc)
  const t_c = (L_num / S_p_num) + t_s_num;

  // Major road flow rate (v) - rounded to 2 decimal places to match Report Page 72 example
  let raw_v;
  if (worksheetNum === 1) {
    raw_v = V_maj_d_num / 3600;
  } else {
    raw_v = (V_maj_d_num / 0.7) / 3600; // high-speed adjustment
  }
  const v = Math.round(raw_v * 100) / 100;

  // Average pedestrian delay (dp) in seconds
  let d_p = 0;
  if (v > 0) {
    d_p = (Math.exp(v * t_c) - v * t_c - 1) / v;
  }

  // Total pedestrian delay (Dp) in pedestrian-hours (ped-h)
  const D_p = (d_p * V_p_num) / 3600;

  // Step 5: Select Treatment Category
  let treatment = '';
  if (!meetsMinPed) {
    treatment = 'NO TREATMENT';
  } else if (meetsSignalWarrant) {
    treatment = 'SIGNAL PROPOSED';
  } else {
    if (worksheetNum === 1) {
      if (D_p >= 21.3 || (D_p >= 5.3 && compliance === 'low')) {
        treatment = 'RED';
      } else if (D_p >= 1.3 || (D_p >= 5.3 && compliance === 'high')) {
        treatment = 'ACTIVE OR ENHANCED';
      } else {
        treatment = 'CROSSWALK';
      }
    } else {
      // Worksheet 2 (No Crosswalk option)
      if (D_p >= 21.3 || (D_p >= 5.3 && compliance === 'low')) {
        treatment = 'RED';
      } else {
        treatment = 'ACTIVE OR ENHANCED';
      }
    }
  }

  return {
    meetsMinPed,
    minPed,
    SC,
    SC_adj,
    hasSpeedReduction,
    meetsSignalWarrant,
    t_c,
    v,
    d_p,
    D_p,
    treatment
  };
}
