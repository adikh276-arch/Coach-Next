import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import type { DayEntry } from '@/hooks/useGoalData';

interface MomentumChartProps {
  data: DayEntry[];
}

export default function MomentumChart({ data }: MomentumChartProps) {
  const today = new Date();
  const days: typeof data[number][] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const entry = data.find(e => e.date === key);
    days.push(entry || { date: key, drive: 0, energy: 0, focus: 0, clarity: 0, tookAction: false, impactLevel: 0, actionNote: '', blocker: '' });
  }

  const chartData = days.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    drive: e.drive,
    energy: e.energy,
    focus: e.focus,
    clarity: e.clarity,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
        No data yet. Start tracking to see trends.
      </div>
    );
  }

  return (
    <div className="w-full h-64 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="momentumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            dy={10}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            dx={-5}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="drive" 
            name="Motivation" 
            stroke="hsl(160, 84%, 39%)" 
            strokeWidth={3} 
            fill="url(#momentumGrad)" 
            dot={{ r: 4, fill: 'hsl(160, 84%, 39%)', strokeWidth: 2, stroke: 'white' }} 
            activeDot={{ r: 6 }} 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="energy" 
            name="Energy Level" 
            stroke="hsl(213, 94%, 68%)" 
            strokeWidth={2} 
            fill="none" 
            dot={{ r: 3, fill: 'hsl(213, 94%, 68%)', strokeWidth: 2, stroke: 'white' }} 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="focus" 
            name="Focus Quality" 
            stroke="hsl(280, 67%, 65%)" 
            strokeWidth={2} 
            fill="none" 
            dot={{ r: 3, fill: 'hsl(280, 67%, 65%)', strokeWidth: 2, stroke: 'white' }} 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="clarity" 
            name="Mental Clarity" 
            stroke="hsl(35, 92%, 60%)" 
            strokeWidth={2} 
            fill="none" 
            dot={{ r: 3, fill: 'hsl(35, 92%, 60%)', strokeWidth: 2, stroke: 'white' }} 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
