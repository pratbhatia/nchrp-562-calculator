# NCHRP 562 Guidelines for Pedestrian Crossing Treatments
### Pedestrian Hybrid Beacon & Crossing Treatment Calculator

An interactive, responsive React application built with Vite to calculate pedestrian crossing treatment recommendations and visualize NCHRP Report 562 / TCRP Report 112 guidelines.

---

## 📈 Methodology & Mathematical Derivations

### 1. Pedestrian Delay Boundary Curves (Delay = 1.3, 5.3, and 21.3 ped-h)
The downward-sloping curves on the graphical solution represent threshold boundaries where the cumulative peak-hour pedestrian delay ($D_p$) reaches exactly **1.3, 5.3, or 21.3 pedestrian-hours**. 

#### **Step-by-Step Derivation**:
1. **Critical Gap (tc)**: The minimum time window a pedestrian needs to cross safely:
   `tc = (L / Sp) + ts`
   * `L` = Crossing distance (feet)
   * `Sp` = 15th-percentile walking speed (feet per second)
   * `ts` = Startup/clearance time (seconds)
   
   *Example: For a crossing length of 56 ft, Sp of 3.5 ft/s, and ts of 3.0 s:*
   `tc = (56 / 3.5) + 3.0 = 19.0 seconds`

2. **Major Road Flow Rate (v)**: The vehicle flow rate per second:
   * **Low Speeds (<= 35 mph - Worksheet 1)**: `v = Vmaj / 3600`
   * **High Speeds (> 35 mph - Worksheet 2)**: `v = (Vmaj / 0.7) / 3600` *(adds a 43% traffic flow inflation to reflect high-speed stress)*

3. **Average Pedestrian Delay (dp)**: Wait time per pedestrian in seconds:
   `dp = (e^(v * tc) - (v * tc) - 1) / v`

4. **Curve Coordinates (Vp)**: Pedestrian volume on the Y-axis needed to reach a target total delay boundary `Dp` (e.g., 21.3 ped-h, which equals 76,680 seconds of delay):
   `Vp = 76,680 / dp`

Because average delay increases exponentially with traffic volume, the pedestrian volume required to hit target delay thresholds drops rapidly as vehicle volume increases, creating the downward-sloping curves.

---

## 🚦 Worksheet 1 vs. Worksheet 2 (Speeds > 35 mph)

When the major street speed limit (or 85th-percentile speed) exceeds 35 mph, the calculator automatically switches to **Worksheet 2**, introducing key safety adjustments:

| Parameter | Worksheet 1 (<= 35 mph) | Worksheet 2 (> 35 mph) |
| :--- | :--- | :--- |
| **Minimum Ped Volume** | 20 ped/h | 14 ped/h *(easier to warrant a treatment)* |
| **Major Road Flow Rate (v)**| `Vmaj / 3600` | `(Vmaj / 0.7) / 3600` *(inflated by 43%)* |
| **Delay Curves** | Normal | **Shifted downward and left** *(due to flow inflation)* |
| **Signal Warrant Floor** | 133 ped/h | 93 ped/h |
| **Crosswalk Zone (Green)** | Active (for Dp < 1.3) | **Removed** *(Active/Enhanced is the minimum)* |

---

## 📚 Definitions & Glossary

* **E/A HC, Red LC\***:
  * **E/A** = Enhanced / Active treatment (Yellow zone on graph)
  * **HC** = High motorist Compliance (drivers yield to pedestrians)
  * **Red** = RED device (Pedestrian Hybrid Beacon / HAWK, Red zone)
  * **LC** = Low motorist Compliance (drivers rarely yield)
  * **Meaning**: In this transition region (between 5.3 and 21.3 ped-h of delay), an **Active/Enhanced** device (yellow) is recommended if yielding compliance is High, but a **RED** beacon is required if compliance is Low.
* **Pedestrian Hybrid Beacon (PHB) / HAWK**: A traffic control device that remains dark for drivers until activated by a pedestrian, then displays a yellow-then-red sequence to halt vehicles.
* **Signal Warrant Volume (SC)**: The minimum peak-hour pedestrian volume crossing the roadway required to justify a traffic signal.

---

## 💻 Local Development Setup

To run the application locally:

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/pratbhatia/nchrp-562-calculator.git
   cd nchrp-562-calculator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
