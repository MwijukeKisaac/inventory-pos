import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import api from "../services/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState([]);
  const [profit, setProfit] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, salesRes, profitRes, productsRes] = await Promise.all([
          api.get("/reports/summary"),
          api.get("/reports/sales-daily"),
          api.get("/reports/profit"),
          api.get("/reports/top-products")
        ]);
        setSummary(summaryRes.data);
        setSales(salesRes.data);
        setProfit(profitRes.data.profit);
        setTopProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📊 Admin Sales Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Today's Sales</h3>
            <p className="text-2xl font-bold text-green-600">UGX {summary.today || 0}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Monthly Sales</h3>
            <p className="text-2xl font-bold text-blue-600">UGX {summary.month || 0}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">Total Profit</h3>
            <p className="text-2xl font-bold text-purple-600">UGX {profit || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-4">Daily Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sales}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-4">Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
