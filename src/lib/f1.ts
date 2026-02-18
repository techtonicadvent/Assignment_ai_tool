export async function getNextRace() {
    try {
      const res = await fetch(
        "https://api.jolpi.ca/ergast/f1/current/next.json"
      );
  
      const data = await res.json();
      const race = data?.MRData?.RaceTable?.Races?.[0];
  
      if (!race) {
        return { type: "text", content: "No upcoming race found." };
      }
  
      return {
        type: "f1",
        race: race.raceName,
        location: race.Circuit.Location.locality,
        date: race.date,
      };
    } catch {
      return { type: "text", content: "F1 service unavailable." };
    }
  }
  