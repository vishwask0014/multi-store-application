"use client";

interface BarChartProps {
  data: { label: string; value: number; secondary?: number }[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  showLabels?: boolean;
}

export default function SimpleChart({ data, height = 200, color = "var(--color-primary)", secondaryColor = "var(--color-accent)", showLabels = true }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.value, d.secondary || 0)), 1);

  return (
    <div className="w-full">
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((d, i) => {
          const h = (d.value / maxVal) * 100;
          const h2 = d.secondary ? (d.secondary / maxVal) * 100 : 0;
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end h-full gap-0.5">
              <div className="relative w-full flex flex-col items-center justify-end" style={{ height: "100%" }}>
                {d.secondary !== undefined && (
                  <div className="w-full rounded-t" style={{ height: `${h2}%`, backgroundColor: secondaryColor, opacity: 0.4, minHeight: h2 > 0 ? 2 : 0 }} />
                )}
                <div className="w-full rounded-t transition-all duration-300 hover:opacity-80" style={{ height: `${h}%`, backgroundColor: color, minHeight: h > 0 ? 2 : 0 }} />
              </div>
              {showLabels && (
                <span className="pt-1.5 text-[10px] text-text-muted truncate w-full text-center">
                  {d.label.length > 5 ? d.label.slice(0, 5) + "…" : d.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
