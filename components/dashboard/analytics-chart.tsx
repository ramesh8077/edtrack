"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";

export function AnalyticsChart({ data }: { data: { date: Date; minutes: number }[] }) {
  // Memoize daily buckets to prevent rerenders on massive datasets
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }).map((_, i) => ({
      date: format(subDays(new Date(), 29 - i), "MMM dd"),
      minutes: 0,
    }));

    data.forEach((entry) => {
      const entryDate = format(new Date(entry.date), "MMM dd");
      const match = last30Days.find((d) => d.date === entryDate);
      if (match) {
        match.minutes += entry.minutes;
      }
    });

    return last30Days;
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed text-muted-foreground bg-muted/20">
        Not enough studying data to display chart.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            minTickGap={20}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              backgroundColor: "hsl(var(--background))",
            }}
            formatter={(value) =>
              value !== undefined ? [`${value} min`, "Studied"] : ["0 min", "Studied"]
            }
          />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMinutes)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
