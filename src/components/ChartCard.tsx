import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

type ChartCardProps = {
  title: string
  data: any[]
  dataKey: string
}

export default function ChartCard({ title, data, dataKey }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="var(--color-primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}