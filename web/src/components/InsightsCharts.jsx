import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import EmptyState from "./EmptyState";

const adherenceColors = ["#2f7dcc", "#f29b38"];

function ChartCard({ title, description, children }) {
  return (
    <div className="card chart-card">
      <div className="section-title-row">
        <div>
          <h3>{title}</h3>
          <p className="section-subtext">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function InsightsCharts({ data }) {
  if (!data) {
    return null;
  }

  const appointments = data.appointmentsPerMonth || [];
  const symptoms = data.commonSymptoms || [];
  const adherence = [
    { name: "Taken", value: data.medicationAdherence?.taken || 0 },
    { name: "Missed", value: data.medicationAdherence?.missed || 0 },
  ];
  const weekly = data.weeklyHealthActivity || [];

  return (
    <div className="chart-grid">
      <ChartCard
        title="Appointments Per Month"
        description="Bar chart data comes directly from the backend insights format."
      >
        {appointments.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={appointments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2f7dcc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No appointment trends yet" description="Appointments will appear here once scheduled." />
        )}
      </ChartCard>

      <ChartCard
        title="Common Symptoms"
        description="Top symptoms are sorted by count from the backend response."
      >
        {symptoms.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={symptoms.slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="symptom" width={90} />
              <Tooltip />
              <Bar dataKey="count" fill="#6db4ff" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No symptom data yet" description="Run symptom checks to populate this chart." />
        )}
      </ChartCard>

      <ChartCard
        title="Medication Adherence"
        description={`Current adherence: ${data.medicationAdherence?.percentage || 0}%`}
      >
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={adherence}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
            >
              {adherence.map((entry, index) => (
                <Cell key={entry.name} fill={adherenceColors[index % adherenceColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Weekly Health Activity"
        description="Displays the seven-day activity trend in dashboard-friendly format."
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="activityCount"
              stroke="#1d5ea6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

export default InsightsCharts;
