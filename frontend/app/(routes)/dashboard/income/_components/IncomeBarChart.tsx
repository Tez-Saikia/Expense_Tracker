import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ChartData {
  label: string;
  income: number;
}

interface IncomeBarChartProps {
  data: ChartData[];
}

function IncomeBarChart({ data }: IncomeBarChartProps) {
  return (
    <div className="w-full h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />

          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 14, fontFamily: "Roboto" }}/>

          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 14, fontFamily: "Roboto" }} />

          <Tooltip />

          <Bar dataKey="income" fill="#4685ec" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomeBarChart;
