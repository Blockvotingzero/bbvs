import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip } from "./ui/chart";

const gradientIds = {
  apc: 'gradientAPC',
  pdp: 'gradientPDP',
  lp: 'gradientLP'
};

interface VoteData {
  state: string;
  apc: number;
  pdp: number;
  lp: number;
}

export function VoteDistributionChart({ data }: { data: VoteData[] }) {
  return (
    <ChartContainer
      config={{
        apc: { label: "APC (Tinubu)" },
        pdp: { label: "PDP (Atiku)" },
        lp: { label: "LP (Obi)" }
      }}
      className="h-[300px]"
    >
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id={gradientIds.apc} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 99, 71, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 99, 71, 0.2)" />
          </linearGradient>
          <linearGradient id={gradientIds.pdp} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 128, 0, 0.8)" />
            <stop offset="100%" stopColor="rgba(0, 128, 0, 0.2)" />
          </linearGradient>
          <linearGradient id={gradientIds.lp} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(70, 130, 180, 0.8)" />
            <stop offset="100%" stopColor="rgba(70, 130, 180, 0.2)" />
          </linearGradient>
        </defs>
      </svg>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            dataKey="state" 
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid gap-2">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded"
                          style={{
                            backgroundColor: entry.color,
                          }}
                        />
                        <span className="font-medium">{entry.name}:</span>
                        <span>{entry.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }} />
          <Bar
            dataKey="apc"
            stackId="votes"
            fill={`url(#${gradientIds.apc})`}
            name="APC (Tinubu)"
          />
          <Bar
            dataKey="pdp"
            stackId="votes"
            fill={`url(#${gradientIds.pdp})`}
            name="PDP (Atiku)"
          />
          <Bar
            dataKey="lp"
            stackId="votes"
            fill={`url(#${gradientIds.lp})`}
            name="LP (Obi)"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
