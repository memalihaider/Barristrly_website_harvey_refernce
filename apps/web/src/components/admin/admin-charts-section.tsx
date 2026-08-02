"use client";

import { useState } from "react";
import type {
  PlatformTimeSeriesPoint,
  PracticeAreaShare,
  ConversionStage,
} from "@/features/enterprise";
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Filter,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface AdminChartsSectionProps {
  timeSeries: PlatformTimeSeriesPoint[];
  practiceAreas: PracticeAreaShare[];
  conversionFunnel: ConversionStage[];
}

export default function AdminChartsSection({
  timeSeries,
  practiceAreas,
  conversionFunnel,
}: AdminChartsSectionProps) {
  const [timeframe, setTimeframe] = useState<"7D" | "14D" | "30D" | "YTD">("14D");
  const [activeMetric, setActiveMetric] = useState<"gmv" | "escrow">("gmv");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Filter timeframe data points
  const displayData =
    timeframe === "7D" ? timeSeries.slice(-7) : timeSeries;

  // Chart calculation parameters
  const chartWidth = 700;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  const values = displayData.map((d) =>
    activeMetric === "gmv" ? d.gmv : d.escrow
  );
  const maxValue = Math.max(...values, 100);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue || 1;

  const getX = (index: number) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    return padding.left + (index / (displayData.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const usableHeight = chartHeight - padding.top - padding.bottom;
    return (
      chartHeight -
      padding.bottom -
      ((val - minValue) / valueRange) * usableHeight
    );
  };

  const svgPoints = displayData
    .map((d, i) => {
      const val = activeMetric === "gmv" ? d.gmv : d.escrow;
      return `${getX(i)},${getY(val)}`;
    })
    .join(" ");

  const areaPoints = `${getX(0)},${
    chartHeight - padding.bottom
  } ${svgPoints} ${getX(displayData.length - 1)},${
    chartHeight - padding.bottom
  }`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Revenue Trajectory & Time Series Chart (2 cols) */}
      <div className="lg:col-span-2 bg-white border border-black/10 rounded-lg p-6 flex flex-col justify-between shadow-2xs">
        <div>
          {/* Header controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <h2 className="font-serif text-xl font-normal text-ink">
                  Marketplace Revenue & Transaction Flow
                </h2>
              </div>
              <p className="text-xs text-text-on-light-muted mt-0.5">
                Real-time volume tracking across gross marketplace value and escrow capital.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-surface-soft p-1 rounded-md">
              <button
                type="button"
                onClick={() => setActiveMetric("gmv")}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  activeMetric === "gmv"
                    ? "bg-white text-ink shadow-2xs border border-black/5"
                    : "text-text-muted hover:text-ink"
                }`}
              >
                GMV Volume
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric("escrow")}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  activeMetric === "escrow"
                    ? "bg-white text-ink shadow-2xs border border-black/5"
                    : "text-text-muted hover:text-ink"
                }`}
              >
                Escrow Funds
              </button>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="flex items-center justify-between bg-surface-soft/50 border border-black/5 rounded-md p-3 mb-6">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">
                  Current Trajectory
                </span>
                <span className="font-serif text-2xl font-normal text-ink">
                  ${(values[values.length - 1] ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-px bg-black/10" />
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">
                  Peak Daily Volume
                </span>
                <span className="font-serif text-lg text-ink">
                  ${maxValue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Timeframe pill selection */}
            <div className="flex items-center gap-1">
              {(["7D", "14D", "30D", "YTD"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    timeframe === tf
                      ? "bg-primary text-white"
                      : "text-text-on-light-muted hover:bg-black/5"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Main Chart */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible"
            >
              <defs>
                <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E85D04" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#E85D04" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="primaryLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF8A3D" />
                  <stop offset="100%" stopColor="#E85D04" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y =
                  padding.top +
                  ratio * (chartHeight - padding.top - padding.bottom);
                return (
                  <line
                    key={ratio}
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#E5E5E3"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area Fill */}
              <polygon points={areaPoints} fill="url(#primaryAreaGrad)" />

              {/* Stroke Line */}
              <polyline
                fill="none"
                stroke="url(#primaryLineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgPoints}
              />

              {/* Interactive Dots and Labels */}
              {displayData.map((d, i) => {
                const val = activeMetric === "gmv" ? d.gmv : d.escrow;
                const cx = getX(i);
                const cy = getY(val);
                const isHovered = hoveredPointIndex === i;

                return (
                  <g key={d.date} className="cursor-pointer">
                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line
                        x1={cx}
                        y1={padding.top}
                        x2={cx}
                        y2={chartHeight - padding.bottom}
                        stroke="#E85D04"
                        strokeDasharray="2 2"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Outer glow ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 7 : 4}
                      fill={isHovered ? "#E85D04" : "#FFFFFF"}
                      stroke="#E85D04"
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />

                    {/* X Axis Labels */}
                    <text
                      x={cx}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      className="text-[10px] fill-text-muted font-mono"
                    >
                      {d.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredPointIndex !== null && (
              <div
                className="absolute top-2 right-4 bg-ink text-ivory p-3 rounded-md shadow-lg text-xs flex flex-col gap-1 border border-white/10 z-10 animate-fade-in"
              >
                <div className="font-semibold text-primary-light">
                  {displayData[hoveredPointIndex]?.date}
                </div>
                <div>
                  GMV Volume: ${displayData[hoveredPointIndex]?.gmv.toLocaleString()}
                </div>
                <div>
                  Escrow Held: ${displayData[hoveredPointIndex]?.escrow.toLocaleString()}
                </div>
                <div className="text-[10px] text-text-secondary border-t border-white/10 pt-1 mt-1">
                  Active Leads: {displayData[hoveredPointIndex]?.leads}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Escrow Ledger Synchronized
          </span>
          <span>Updated every 5 mins</span>
        </div>
      </div>

      {/* Right Column: Practice Area Breakdown & Funnel */}
      <div className="space-y-6">
        {/* Practice Area Distribution Donut Card */}
        <div className="bg-white border border-black/10 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-normal text-ink">
              Practice Area Demand
            </h3>
            <PieChart className="w-4 h-4 text-primary" />
          </div>

          <div className="space-y-3">
            {practiceAreas.map((pa) => (
              <div key={pa.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: pa.color }}
                    />
                    {pa.category}
                  </span>
                  <span className="font-mono text-text-on-light-muted">
                    {pa.percentage}% ({pa.count})
                  </span>
                </div>
                {/* Progress bar fill */}
                <div className="h-1.5 w-full bg-surface-soft rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pa.percentage}%`,
                      backgroundColor: pa.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Conversion Funnel Card */}
        <div className="bg-white border border-black/10 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-normal text-ink">
              Marketplace Conversion Funnel
            </h3>
            <Zap className="w-4 h-4 text-primary" />
          </div>

          <div className="space-y-3">
            {conversionFunnel.map((stage, idx) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-on-light-muted font-medium">
                    {idx + 1}. {stage.stage}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{stage.count}</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                      {stage.rate}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-surface-soft rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${stage.rate}%`,
                      opacity: 1 - idx * 0.15,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
