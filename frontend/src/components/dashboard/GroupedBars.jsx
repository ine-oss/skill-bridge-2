import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { GRID, INK, SERIES, axisProps } from './viz'

/** Horizontal grouped bars for comparing 2–3 counts per category (legend lives in ChartCard). */
export default function GroupedBars({ data, categoryKey, series, rowHeight = 34 }) {
  const height = Math.max(160, data.length * rowHeight + 40)
  return (
    <div style={{ height }} role="img" aria-label={`${series.map((item) => item.label).join(' and ')} by ${categoryKey}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }} barGap={2} barCategoryGap="28%">
          <CartesianGrid horizontal={false} stroke={GRID} />
          <XAxis type="number" {...axisProps} allowDecimals={false} />
          <YAxis type="category" dataKey={categoryKey} {...axisProps} axisLine={false} width={110} tick={{ fill: INK.secondary, fontSize: 12 }} />
          <Tooltip cursor={{ fill: 'rgba(42,120,214,0.06)' }} content={<ChartTooltip />} />
          {series.map((item, index) => (
            <Bar key={item.key} dataKey={item.key} name={item.label} fill={SERIES[index]} maxBarSize={10} radius={[0, 4, 4, 0]} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
