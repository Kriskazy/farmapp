import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { getWeatherForecast } from '../../services/weatherService';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherForecast();
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card className="h-full min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-none overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-yellow-300 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Conditions */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-100 mb-1">
              <span className="text-sm">📍 {weather.current.location}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-6xl">{weather.current.condition.icon}</span>
              <div>
                <h2 className="text-5xl font-bold">{weather.current.temp}°</h2>
                <p className="text-blue-100 text-lg">{weather.current.condition.description}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div>
              <p className="text-blue-200 text-xs">Humidity</p>
              <p className="font-semibold">{weather.current.humidity}%</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Wind</p>
              <p className="font-semibold">{weather.current.windSpeed} km/h</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Pressure</p>
              <p className="font-semibold">{weather.current.pressure} hPa</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Precipitation</p>
              <p className="font-semibold">0%</p>
            </div>
          </div>
        </div>

        {/* Hourly Chart */}
        <div className="lg:col-span-2 flex flex-col">
          <h3 className="text-blue-100 font-medium mb-4">24-Hour Temperature Trend</h3>
          <div className="flex-grow min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weather.hourly}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#bfdbfe" 
                  tick={{fill: '#bfdbfe', fontSize: 12}}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', color: '#1e3a8a' }}
                  itemStyle={{ color: '#1e3a8a' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Forecast Mini-List */}
          <div className="grid grid-cols-7 gap-2 mt-4">
            {weather.daily.map((day, index) => (
              <div key={index} className="text-center bg-white/5 rounded-lg p-2 backdrop-blur-sm">
                <p className="text-xs text-blue-200 mb-1">{day.day}</p>
                <p className="text-lg mb-1">{day.icon}</p>
                <p className="text-sm font-bold">{day.maxTemp}°</p>
                <p className="text-xs text-blue-300">{day.minTemp}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
