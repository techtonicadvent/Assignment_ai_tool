export async function getStock(symbol: string) {
    const key = process.env.STOCK_KEY;
  
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`
    );
  
    const data = await res.json();
  
    const price = data["Global Quote"]?.["05. price"];
  
    if (!price) return `Stock data not found for ${symbol}.`;
  
    return `Stock ${symbol.toUpperCase()}: $${price}`;
  }
  