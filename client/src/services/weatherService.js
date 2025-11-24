// Simulated Weather Service

const CONDITIONS = [
  { type: 'Sunny', icon: '☀️', description: 'Clear Sky' },
  { type: 'Cloudy', icon: '☁️', description: 'Partly Cloudy' },
  { type: 'Rainy', icon: '🌧️', description: 'Light Rain' },
  { type: 'Stormy', icon: '⛈️', description: 'Thunderstorms' },
  { type: 'Windy', icon: '💨', description: 'Strong Winds' },
];

export const getWeatherForecast = (location = 'Farm Location') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate realistic looking data
      const currentHour = new Date().getHours();
      
      // Current Conditions
      const current = {
        temp: 22 + Math.floor(Math.random() * 5),
        condition: CONDITIONS[Math.floor(Math.random() * 2)], // Mostly sunny/cloudy
        humidity: 45 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 15),
        pressure: 1012 + Math.floor(Math.random() * 10),
        location: location
      };

      // Hourly Forecast (Next 24h)
      const hourly = Array.from({ length: 24 }, (_, i) => {
        const hour = (currentHour + i) % 24;
        const isDay = hour >= 6 && hour <= 18;
        const baseTemp = isDay ? 20 : 15;
        
        return {
          time: `${hour}:00`,
          temp: baseTemp + Math.floor(Math.random() * 5),
          rainChance: Math.floor(Math.random() * 30)
        };
      });

      // Daily Forecast (Next 7 days)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      
      const daily = Array.from({ length: 7 }, (_, i) => {
        const dayIndex = (today + i) % 7;
        const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
        
        return {
          day: i === 0 ? 'Today' : days[dayIndex],
          maxTemp: 24 + Math.floor(Math.random() * 6),
          minTemp: 14 + Math.floor(Math.random() * 4),
          condition: condition.type,
          icon: condition.icon
        };
      });

      resolve({ current, hourly, daily });
    }, 1000); // 1s delay
  });
};
