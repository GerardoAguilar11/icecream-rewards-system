import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


function SalesChart({ data }) {
  const chartData = data.map((day) => ({
    ...day,
    sales: Number(day.sales),
  }));


  if (chartData.length === 0) {
    return (
      <p>
        No hay información de ventas disponible.
      </p>
    );
  }


  return (
    <div className="sales-chart">
      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
          />

          <YAxis />

          <Tooltip
            formatter={(value, name) => {
              if (name === "Ventas") {
                return [
                  `$${Number(value).toFixed(2)}`,
                  name,
                ];
              }

              return [
                value,
                name,
              ];
            }}
          />

          <Legend />

          <Bar
            dataKey="sales"
            name="Ventas"
          />

          <Bar
            dataKey="purchases"
            name="Compras"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


export default SalesChart;