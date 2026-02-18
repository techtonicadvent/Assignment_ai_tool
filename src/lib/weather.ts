export async function getWeather(city: string) {
    const key = process.env.WEATHERAPI_KEY;
  
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`
    );
  
    const data = await res.json();
  
    if (!data.current) {
      return `Weather data not found for ${city}.`;
    }
  
    return `Weather in ${city}: ${data.current.temp_c}°C, ${data.current.condition.text}`;
  }
  