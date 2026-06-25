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
  // Step 2: Minimum Pedestrian Volume Check
  const minPed = worksheet === 1 ? 20 : 14;
  const meetsMinPed = V_p >= minPed;

  // Step 3: Signal Warrant Check (SC)
  let SC;
  if (worksheet === 1) {
    // Equation for speed <= 35 mph
    SC = (0.00021 * Math.pow(V_maj_s, 2) - 0.74072 * V_maj_s + 734.125) / 0.75;
    if (SC < 133) SC = 133;
  } else {
    // Equation for speed > 35 mph
    SC = (0.00035 * Math.pow(V_maj_s, 2) - 0.80083 * V_maj_s + 529.197) / 0.75;
    if (SC < 93) SC = 93;
  }

  // Walking speed adjustment (Step 3d)
  let SC_adj = SC;
  const hasSpeedReduction = S_p < 3.5;
  if (hasSpeedReduction) {
    SC_adj = SC * 0.5; // up to 50% reduction (standard is 50%)
  }

  const meetsSignalWarrant = V_p >= SC_adj;

  // Step 4: Pedestrian Delay Estimation
  // Critical Gap (tc)
  const t_c = (L / S_p) + t_s;

  // Major road flow rate (v) - rounded to 2 decimal places to match Report Page 72 example
  let raw_v;
  if (worksheet === 1) {
    raw_v = V_maj_d / 3600;
  } else {
    raw_v = (V_maj_d / 0.7) / 3600; // high-speed adjustment
  }
  const v = Math.round(raw_v * 100) / 100;

  // Average pedestrian delay (dp) in seconds
  let d_p = 0;
  if (v > 0) {
    d_p = (Math.exp(v * t_c) - v * t_c - 1) / v;
  }

  // Total pedestrian delay (Dp) in pedestrian-hours (ped-h)
  const D_p = (d_p * V_p) / 3600;

  // Step 5: Select Treatment Category
  let treatment = '';
  if (!meetsMinPed) {
    treatment = 'NO TREATMENT';
  } else if (meetsSignalWarrant) {
    treatment = 'SIGNAL PROPOSED';
  } else {
    if (worksheet === 1) {
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
