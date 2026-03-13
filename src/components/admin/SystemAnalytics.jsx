import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Server, Database, Zap, ShieldAlert, RefreshCw } from 'lucide-react';
import { fetchSystemLogs } from '../analytics/logSlice'; 

const SystemAnalytics = () => {
    const dispatch = useDispatch();
    const { activityData, summary, loading } = useSelector((state) => state.logs);

    useEffect(() => {
        dispatch(fetchSystemLogs());

        const POLLING_INTERVAL = 60000; 
        const intervalId = setInterval(() => {
            dispatch(fetchSystemLogs());
        }, POLLING_INTERVAL);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">System Health & Analytics</h1>
                {loading && <RefreshCw size={18} className="animate-spin text-indigo-500" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <HealthCard 
                    icon={Server} 
                    label="API Status" 
                    value={summary?.status || "Checking..."} 
                    color="text-emerald-500" 
                />
                <HealthCard 
                    icon={Zap} 
                    label="Daily Requests" 
                    value={summary?.dailyRequests?.toLocaleString() || "0"} 
                    color="text-amber-500" 
                />
                <HealthCard 
                    icon={ShieldAlert} 
                    label="Security Logs" 
                    value={`${summary?.securityLogs || 0} Alerts`} 
                    color={summary?.securityLogs > 0 ? "text-red-500" : "text-emerald-500"} 
                />
                <HealthCard 
                    icon={Database} 
                    label="DB Latency" 
                    value="24ms" 
                    color="text-blue-500" 
                />
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold">User Activity (24h)</h3>
                    <span className="text-xs text-slate-400">Live Updates Enabled</span>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="time" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="requests" 
                                stroke="#6366f1" 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                                strokeWidth={2} 
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line no-unused-vars
const HealthCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm">
        <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
            <Icon size={20}/>
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-lg font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default SystemAnalytics;