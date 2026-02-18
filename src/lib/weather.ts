export async function getWeather(city: string) {
    const key = process.env.WEATHERAPI_KEY;
  
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`
    );
  
    const data = await res.json();
  
    if (!data.current) {
      return { type: "text", content: `Weather not found for ${city}` };
    }
  
    return {
      type: "weather",
      city: data.location.name,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
    };
  }