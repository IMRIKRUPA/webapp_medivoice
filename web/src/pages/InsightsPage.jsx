import { useEffect, useState } from "react";

import EmptyState from "../components/EmptyState";
import InsightsCharts from "../components/InsightsCharts";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { getInsights } from "../services/insightService";
import { extractApiError } from "../utils/apiHelpers";

function InsightsPage() {
  const { patientId } = useAuth();
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await getInsights({ patientId, range });
        setInsights(response.data);
      } catch (error) {
        setErrorMessage(extractApiError(error).message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      loadInsights();
    }
  }, [patientId, range]);

  return (
    <>
      <PageHeader
        title="Health Insights"
        description="Chart-friendly analytics page built directly from the `GET /api/insights` response object."
        actions={
          <select className="select" value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last 12 months</option>
          </select>
        }
      />

      {loading ? (
        <LoadingSpinner label="Loading insights..." />
      ) : errorMessage ? (
        <EmptyState title="Unable to load insights" description={errorMessage} />
      ) : (
        <InsightsCharts data={insights} />
      )}
    </>
  );
}

export default InsightsPage;
