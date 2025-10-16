import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/appPaths";
import { Lightbulb } from "lucide-react";

export const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY
        );
        setInsights(response.data.insights || []);
      } catch (error) {
        console.error("Error fetching AI insights:", error);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm shadow-gray-100">
      <div className="flex items-center mb-4">
        <Lightbulb className="size-6 text-yellow-500 mr-3" />
        <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
      </div>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      ) : (
        <ul className="space-y-3 list-disc list-inside text-slate-600 ml-3">
          {insights.map((insight, index) => (
            <li className="text-sm" key={index}>
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
