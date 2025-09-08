import React, { useState, useMemo } from "react";

// OptimisticConstructionEstimator.jsx
// Single-file React component (Tailwind) for an optimistic construction duration calculator
// Default assumptions target Cambodia: 8 hrs/day, 7 days/week, optimistic durations.

export default function OptimisticConstructionEstimator() {
  // Required inputs
  const [aFloor, setAFloor] = useState(555); // m2
  const [nFloors, setNFloors] = useState(9);
  const [workers, setWorkers] = useState(65);
  const [hDay, setHDay] = useState(8); // hours/day
  const [dWeek, setDWeek] = useState(7); // days/week (Cambodia default)

  // Optimistic defaults for durations and productivity
  const [daysPerFloorStruct, setDaysPerFloorStruct] = useState(10); // optimistic: 10 days/floor
  const [finishesMHPerM2, setFinishesMHPerM2] = useState(30); // optimistic mid-light finishes
  const [preDays, setPreDays] = useState(42); // 6 weeks
  const [foundDays, setFoundDays] = useState(28); // 4 weeks
  const [commissionDays, setCommissionDays] = useState(14); // 2 weeks
  const [overlapFraction, setOverlapFraction] = useState(0.8); // 80% overlap optimistic

  // Helper to format days -> weeks/months
  const daysToWeeks = (days) => (days / dWeek).toFixed(1);
  const daysToMonths = (days) => (days / 30.44).toFixed(1);

  // Core calculations using useMemo for performance
  const results = useMemo(() => {
    const GFA = aFloor * nFloors; // m2
    const MHPerDay = workers * hDay; // man-hours/day
    const structDays = daysPerFloorStruct * nFloors; // days
    const finishesMHTotal = finishesMHPerM2 * GFA; // total man-hours for finishes & MEP
    const finishesDaysFull = finishesMHTotal / MHPerDay; // days if run alone
    const finishesDaysRemaining = (1 - overlapFraction) * finishesDaysFull;

    const totalDays = preDays + foundDays + structDays + finishesDaysRemaining + commissionDays;

    // Breakdown for UI
    return {
      GFA,
      MHPerDay,
      structDays,
      finishesMHTotal,
      finishesDaysFull,
      finishesDaysRemaining,
      totalDays,
    };
  }, [aFloor, nFloors, workers, hDay, daysPerFloorStruct, finishesMHPerM2, preDays, foundDays, commissionDays, overlapFraction, dWeek]);

  // Simple progress bars for phases (rough proportion of totalDays)
  const phaseDurations = useMemo(() => {
    const pre = preDays;
    const found = foundDays;
    const struct = results.structDays;
    const finishesRem = results.finishesDaysRemaining;
    const comm = commissionDays;
    const total = pre + found + struct + finishesRem + comm;
    return { pre, found, struct, finishesRem, comm, total };
  }, [results, preDays, foundDays, commissionDays]);

  // Small helper to clamp slider values shown
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-2">Optimistic Construction Duration Estimator</h1>
      <p className="text-sm text-gray-600 mb-6">Tailored for Cambodia defaults (8 hrs/day, 7 days/week). This is an <strong>optimistic</strong> calculator — adjust sliders to match your reality.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-medium">Project inputs</h2>

          <label className="block">
            <span className="text-sm">Area per floor (m²)</span>
            <input type="number" value={aFloor} onChange={(e) => setAFloor(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm">Number of storeys</span>
            <input type="number" value={nFloors} onChange={(e) => setNFloors(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm">Workers on site (people)</span>
            <input type="number" value={workers} onChange={(e) => setWorkers(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm">Hours per day</span>
              <input type="number" value={hDay} onChange={(e) => setHDay(clamp(Number(e.target.value), 1, 24))} className="w-full mt-1 p-2 border rounded" />
            </label>

            <label className="block">
              <span className="text-sm">Days per week</span>
              <input type="number" value={dWeek} onChange={(e) => setDWeek(clamp(Number(e.target.value), 1, 7))} className="w-full mt-1 p-2 border rounded" />
            </label>
          </div>

        </div>

        <div className="space-y-4">
          <h2 className="font-medium">Optimistic defaults & sliders</h2>

          <label className="block">
            <span className="text-sm">Days per floor (structural cycle)</span>
            <input type="range" min="6" max="18" value={daysPerFloorStruct} onChange={(e) => setDaysPerFloorStruct(Number(e.target.value))} />
            <div className="text-xs mt-1">{daysPerFloorStruct} days / floor</div>
          </label>

          <label className="block">
            <span className="text-sm">Finishes man-hours per m²</span>
            <input type="range" min="15" max="60" value={finishesMHPerM2} onChange={(e) => setFinishesMHPerM2(Number(e.target.value))} />
            <div className="text-xs mt-1">{finishesMHPerM2} man-hours / m²</div>
          </label>

          <label className="block">
            <span className="text-sm">Pre-construction (days)</span>
            <input type="number" value={preDays} onChange={(e) => setPreDays(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm">Foundations (days)</span>
            <input type="number" value={foundDays} onChange={(e) => setFoundDays(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm">Commission & snagging (days)</span>
            <input type="number" value={commissionDays} onChange={(e) => setCommissionDays(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            <span className="text-sm">Finishes overlap fraction</span>
            <input type="range" min="0" max="0.95" step="0.05" value={overlapFraction} onChange={(e) => setOverlapFraction(Number(e.target.value))} />
            <div className="text-xs mt-1">{Math.round(overlapFraction * 100)}% overlap</div>
          </label>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Calculated outputs (optimistic)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="space-y-2">
            <div className="text-sm text-gray-700">Gross floor area (GFA)</div>
            <div className="text-lg font-medium">{results.GFA.toLocaleString()} m²</div>

            <div className="text-sm text-gray-700">Man-hours available / day</div>
            <div className="text-lg font-medium">{results.MHPerDay.toLocaleString()} MH/day</div>

            <div className="text-sm text-gray-700">Structural duration (days)</div>
            <div className="text-lg font-medium">{results.structDays} days • {daysToWeeks(results.structDays)} weeks</div>

            <div className="text-sm text-gray-700">Finishes total man-hours</div>
            <div className="text-lg font-medium">{Math.round(results.finishesMHTotal).toLocaleString()} MH</div>

            <div className="text-sm text-gray-700">Finishes if run alone (days)</div>
            <div className="text-lg font-medium">{Math.ceil(results.finishesDaysFull)} days • {daysToWeeks(results.finishesDaysFull)} weeks</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-700">Finishes remaining after overlap</div>
            <div className="text-lg font-medium">{Math.ceil(results.finishesDaysRemaining)} days • {daysToWeeks(results.finishesDaysRemaining)} weeks</div>

            <div className="text-sm text-gray-700">Pre + Foundations + Commission (days)</div>
            <div className="text-lg font-medium">{preDays + foundDays + commissionDays} days</div>

            <div className="text-sm text-gray-700">Estimated total project duration</div>
            <div className="text-2xl font-bold">{Math.ceil(results.totalDays)} days</div>
            <div className="text-sm text-gray-700">~ {daysToWeeks(results.totalDays)} weeks • ~ {daysToMonths(results.totalDays)} months (calendar)</div>

            <div className="text-xs text-gray-600 mt-2">Note: optimistic assumptions used. Increase sliders for more conservative estimates.</div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Phase breakdown (visual)</h4>
          <div className="w-full bg-white border rounded p-3">
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="inline-block w-3 h-3 bg-indigo-400 rounded-sm" /> <span>Pre</span>
              <span className="inline-block w-3 h-3 bg-yellow-300 rounded-sm ml-3" /> <span>Foundations</span>
              <span className="inline-block w-3 h-3 bg-blue-400 rounded-sm ml-3" /> <span>Structure</span>
              <span className="inline-block w-3 h-3 bg-green-400 rounded-sm ml-3" /> <span>Finishes Remaining</span>
              <span className="inline-block w-3 h-3 bg-red-300 rounded-sm ml-3" /> <span>Commission</span>
            </div>

            <div className="h-8 w-full bg-gray-200 rounded overflow-hidden flex">
              {/* Bars sized proportionally to durations */}
              {['pre', 'found', 'struct', 'finishesRem', 'comm'].map((k, i) => {
                const dur = phaseDurations[k];
                const width = Math.max(1, Math.round((dur / phaseDurations.total) * 100));
                const colors = ["bg-indigo-400", "bg-yellow-300", "bg-blue-400", "bg-green-400", "bg-red-300"];
                return (
                  <div key={k} className={`${colors[i]} h-full`} style={{ width: `${width}%` }} title={`${k}: ${dur} days`} />
                );
              })}
            </div>

            <div className="text-xs text-gray-600 mt-2">Hover/click bars (title shows days). Visual proportions are rounded.</div>
          </div>
        </div>

      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => {
          const sample = {
            aFloor, nFloors, workers, hDay, dWeek, daysPerFloorStruct, finishesMHPerM2, preDays, foundDays, commissionDays, overlapFraction
          };
          navigator.clipboard?.writeText(`// Optimistic estimator inputs (JSON)\n${JSON.stringify(sample, null, 2)}`)
        }} className="px-4 py-2 bg-indigo-600 text-white rounded">Copy inputs (JSON)</button>

        <button onClick={() => window.print()} className="px-4 py-2 border rounded">Print view</button>

        <button onClick={() => alert('You can paste this component into your React app. Tailwind required for styles.') } className="px-4 py-2 border rounded">Usage note</button>
      </div>

      <footer className="mt-6 text-xs text-gray-500">Built for quick optimistic estimates. For production planning, combine with supplier lead-times and local permit calendars.</footer>
    </div>
  );
}
