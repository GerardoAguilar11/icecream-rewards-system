import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }
  );


const formatShortDate = (value) => {
  if (!value) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] = value.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return date.toLocaleDateString(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
    }
  );
};


const getXAxisInterval = (length) => {
  if (length <= 10) {
    return 0;
  }

  if (length <= 20) {
    return 1;
  }

  if (length <= 35) {
    return 2;
  }

  if (length <= 60) {
    return 4;
  }

  return Math.ceil(
    length / 12
  ) - 1;
};


function SalesChart({ data }) {
  const chartData = data.map(
    (day) => ({
      ...day,
      sales: Number(
        day.sales
      ),
      purchases: Number(
        day.purchases
      ),
    })
  );


  if (chartData.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <p>
          No hay información de ventas
          disponible para este periodo.
        </p>
      </div>
    );
  }


  return (
    <div className="sales-chart">

      <ResponsiveContainer
        width="100%"
        height={360}
      >

        <ComposedChart
          data={chartData}
          margin={{
            top: 12,
            right: 10,
            left: 5,
            bottom: 5,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />


          <XAxis
            dataKey="date"
            tickFormatter={
              formatShortDate
            }
            interval={
              getXAxisInterval(
                chartData.length
              )
            }
            minTickGap={20}
          />


          <YAxis
            yAxisId="sales"
            orientation="left"
            tickFormatter={(value) =>
              `$${Number(
                value
              ).toLocaleString(
                "es-MX"
              )}`
            }
            width={72}
          />


          <YAxis
            yAxisId="purchases"
            orientation="right"
            allowDecimals={false}
            width={38}
          />


          <Tooltip
            labelFormatter={
              (value) =>
                `Fecha: ${formatShortDate(
                  value
                )}`
            }
            formatter={(
              value,
              name
            ) => {
              if (
                name === "Ventas"
              ) {
                return [
                  formatCurrency(
                    value
                  ),
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
            yAxisId="sales"
            dataKey="sales"
            name="Ventas"
            radius={[
              5,
              5,
              0,
              0,
            ]}
            maxBarSize={42}
          />


          <Line
            yAxisId="purchases"
            type="monotone"
            dataKey="purchases"
            name="Compras"
            strokeWidth={2}
            dot={
              chartData.length <= 15
            }
            activeDot={{
              r: 5,
            }}
          />

        </ComposedChart>

      </ResponsiveContainer>

    </div>
  );
}


export default SalesChart;