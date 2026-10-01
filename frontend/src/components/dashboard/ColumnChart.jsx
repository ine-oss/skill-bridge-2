import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { GRID, INK, SERIES, axisProps } from './viz'

/** Single-series columns (≤24px, rounded top), value on each cap. */
export default function ColumnChart({ data, xKey = 'label', yKey = 'count', name = 'Count', height = 220, format = (v) => v }) {
  return (
    <div style={{ height }} role="img" aria-label={`${name} by ${xKey}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey={xKey} {...axisProps} interval={0} />
          <YAxis {...axisProps} axisLine={false} allowDecimals={false} width={44} />
          <Tooltip cursor={{ fill: 'rgba(42,120,214,0.06)' }} content={<ChartTooltip format={format} />} />
          <Bar dataKey={yKey} name={name} fill={SERIES[0]} maxBarSize={24} radius={[4, 4, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey={yKey} position="top" fill={INK.secondary} fontSize={12} formatter={format} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
