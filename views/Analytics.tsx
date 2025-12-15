import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const retentionData = [
  { month: 'Jan', rate: 85 },
  { month: 'Feb', rate: 88 },
  { month: 'Mar', rate: 87 },
  { month: 'Apr', rate: 90 },
  { month: 'May', rate: 92 },
];

const contentHeatData = [
  { topic: 'Tech', volume: 450 },
  { topic: 'Politics', volume: 300 },
  { topic: 'Finance', volume: 200 },
  { topic: 'Health', volume: 150 },
];

const COLORS = ['#000000', '#333333', '#666666', '#999999'];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* User Retention */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-6">User Retention Rate</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="month" tick={{fill: '#64748b'}} />
                   <YAxis unit="%" tick={{fill: '#64748b'}} />
                   <Tooltip />
                   <Line type="monotone" dataKey="rate" stroke="#000000" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Content Heatmap */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-6">Content Heatmap (Volume)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={contentHeatData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="volume"
                      label
                    >
                      {contentHeatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-500 mt-4">
                {contentHeatData.map((d, i) => (
                    <div key={d.topic} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                        {d.topic}
                    </div>
                ))}
            </div>
         </div>
      </div>
      
      {/* System Health */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">System Health Status</h3>
          <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-600 font-bold uppercase">API Latency</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">45ms</div>
                  <div className="text-xs text-gray-500 mt-1">Optimal</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-600 font-bold uppercase">Crawler Uptime</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">99.9%</div>
                  <div className="text-xs text-gray-500 mt-1">No incidents (30d)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-600 font-bold uppercase">DB Load</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">12%</div>
                  <div className="text-xs text-gray-500 mt-1">Healthy</div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Analytics;