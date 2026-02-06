import { useEffect, useState } from "react";
import { fetchPendingLeads } from "../api/approvals";
import LeadCard from "./LeadCard";

export default function LeadList() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL | HOT | WARM | HOT_WARM

  const loadLeads = async () => {
    setLoading(true);
    const data = await fetchPendingLeads();
    setLeads(data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (filter === "HOT") return lead.lead_type === "HOT";
    if (filter === "WARM") return lead.lead_type === "WARM";
    if (filter === "HOT_WARM")
      return lead.lead_type === "HOT" || lead.lead_type === "WARM";
    return true; // ALL
  });

  if (loading) return <p>Loading pending leads...</p>;

  return (
    <div>
      <h2>Pending Lead Approvals</h2>

      {/* 🔍 FILTER CONTROLS */}
      <div className="filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={filter === "HOT" ? "active" : ""}
          onClick={() => setFilter("HOT")}
        >
          🔥 Hot
        </button>

        <button
          className={filter === "WARM" ? "active" : ""}
          onClick={() => setFilter("WARM")}
        >
          🌤 Warm
        </button>

        <button
          className={filter === "HOT_WARM" ? "active" : ""}
          onClick={() => setFilter("HOT_WARM")}
        >
          🔥 + 🌤 Hot & Warm
        </button>
      </div>

      {filteredLeads.length === 0 && (
        <p>No leads match this filter.</p>
      )}

      {filteredLeads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onAction={loadLeads}
        />
      ))}
    </div>
  );
}
