export async function getNextRace() {
    try {
      const res = await fetch("https://ergast.com/api/f1/current.json");
  
      const data = await res.json();
      const races = data?.MRData?.RaceTable?.Races;
  
      if (!races || races.length === 0) {
        return "No race schedule available.";
      }
  
      // Find next upcoming race
      const today = new Date();
  
      const next = races.find((race: any) => {
        return new Date(race.date) >= today;
      });
  
      if (!next) {
        const last = races[races.length - 1];
        return `Last race: ${last.raceName} in ${last.Circuit.Location.locality}`;
      }
  
      return `🏎 Next F1 Race: ${next.raceName} in ${next.Circuit.Location.locality} on ${next.date}`;
    } catch {
      return "F1 service unavailable.";
    }
  }
  