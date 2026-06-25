import React, { useState } from 'react';

const GLOSSARY_ITEMS = [
  {
    term: "Pedestrian Hybrid Beacon (PHB) / HAWK",
    definition: "A traffic control device used at unsignalized locations to assist pedestrians in crossing a street. Originally developed in Tucson as the HAWK (High-Intensity Activated Crosswalk), it remains dark for drivers until activated by a pedestrian, then displays a yellow-then-red sequence to halt vehicles."
  },
  {
    term: "Critical Gap (tc)",
    definition: "The time interval (in seconds) below which a pedestrian will not attempt to cross. Mathematically, it is the sum of the crossing time (distance divided by walking speed) and a startup/clearance time: tc = (L / Sp) + ts."
  },
  {
    term: "Total Pedestrian Delay (Dp)",
    definition: "The cumulative delay experienced by all crossing pedestrians during the peak hour, measured in pedestrian-hours (ped-h). It is computed as (dp * Vp) / 3600, where dp is the average delay in seconds per pedestrian, and Vp is the hourly pedestrian volume."
  },
  {
    term: "Motorist Compliance",
    definition: "A regional rating of how driver behavior affects yielding. NCHRP 562 classifies compliance as 'High' (drivers commonly yield at marked crosswalks) or 'Low' (yielding is rare). Low compliance increases pedestrian delays and requires more restrictive crossing treatments (like RED signals) at lower delay levels."
  },
  {
    term: "Signal Warrant Volume (SC)",
    definition: "The minimum peak-hour pedestrian volume crossing the roadway required to justify a traffic signal. In NCHRP 562, it is computed using regression formulas derived from vehicle warrants, and is reduced by 50% if the pedestrian walking speed is less than 3.5 ft/s."
  },
  {
    term: "Pedestrian Walking Speed (Sp)",
    definition: "The 15th percentile walking speed of the crossing population. The standard value is 3.5 ft/s (1.1 m/s) for the general population, and 3.0 ft/s (0.9 m/s) if there is a high share of older or less-able pedestrians."
  },
  {
    term: "Worksheet 1 vs. Worksheet 2",
    definition: "Worksheet 1 is used for roadways with posted/85th-percentile speeds of 35 mph or less. Worksheet 2 is used when speeds exceed 35 mph, in communities under 10,000 population, or near major transit stops. Worksheet 2 has more stringent warrant levels and does not recommend a basic 'Crosswalk' treatment due to high vehicle speeds."
  }
];

export default function Glossary() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div className={`card glossary-container ${isOpen ? 'open' : ''}`}>
      <div className="card-header glossary-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>📚 NCHRP 562 Glossary & Definitions</h3>
        <span className="toggle-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="glossary-body">
          <p className="glossary-intro">
            Below are definitions and equations from the NCHRP Report 562 / TCRP Report 112 guidelines:
          </p>
          <div className="glossary-list">
            {GLOSSARY_ITEMS.map((item, idx) => (
              <div key={idx} className="glossary-item">
                <button 
                  className={`glossary-term-btn ${activeItem === idx ? 'active' : ''}`}
                  onClick={() => setActiveItem(activeItem === idx ? null : idx)}
                >
                  <span>{item.term}</span>
                  <span>{activeItem === idx ? '−' : '+'}</span>
                </button>
                {activeItem === idx && (
                  <div className="glossary-definition">
                    {item.definition}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
