import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { GRID, SERIES, axisProps } from './viz'

/**
 * Weekly trend. One series → line with a light area wash; 2–3 series → lines (legend in ChartCard).
 *   series: [{ key: 'applications', label: 'Applications' }]
 */
export default function TrendChart({ data, series, height = 240, xKey = 'label' }) {
  const single = series.length === 1
  const Chart = single ? AreaChart : LineChart
  const last = data.length - 1
  const endDot = (color) => (props) => (props.index === last ? <circle key="end" cx={props.cx} cy={props.cy} r={4} fill={color} stroke="#fff" strokeWidth={2} /> : <g key={props.index} />)

  return (
    <div style={{ height }} role="img" aria-label={`${series.map((item) => item.label).join(', ')} per week`}>
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="trendWash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES[0]} stopOpacity={0.14} />
              <stop offset="100%" stopColor={SERIES[0]} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey={xKey} {...axisProps} interval="preserveStartEnd" minTickGap={24} />
          <YAxis {...axisProps} axisLine={false} allowDecimals={false} width={44} />
          <Tooltip cursor={{ stroke: '#9b9a94', strokeWidth: 1 }} content={<ChartTooltip labelFormat={(value) => `Week of ${value}`} />} />
          {series.map((item, index) => (single ? (
            <Area key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={SERIES[index]} strokeWidth={2} fill="url(#trendWash)" dot={endDot(SERIES[index])} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
          ) : (
            <Line key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={SERIES[index]} strokeWidth={2} strokeLinecap="round" dot={endDot(SERIES[index])} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
          )))}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
