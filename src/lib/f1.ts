export async function getNextRace() {
    const res = await fetch(
      "https://ergast.com/api/f1/current/next.json"
    );
  
    const data = await res.json();
  
    const race = data.MRData.RaceTable.Races[0];
  
    if (!race) return "No upcoming race found.";
  
    return `Next F1 Race: ${race.raceName} in ${race.Circuit.Location.locality} on ${race.date}`;
  }
  