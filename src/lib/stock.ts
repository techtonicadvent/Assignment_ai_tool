const map: Record<string, string> = {
    apple: "AAPL",
    tesla: "TSLA",
    microsoft: "MSFT",
    google: "GOOGL",
    amazon: "AMZN",
    meta: "META",
    netflix: "NFLX",
    nvidia: "NVDA",
    intel: "INTC",
    amd: "AMD",
    oracle: "ORCL",
    adobe: "ADBE",
    salesforce: "CRM",
    uber: "UBER",
    paypal: "PYPL",
    walmart: "WMT",
    coca: "KO",
    nike: "NKE",
    shell: "SHEL",
    boeing: "BA",
    ford: "F",
    toyota: "TM",
    reliance: "RELIANCE.BSE",
    infosys: "INFY.BSE",
    tcs: "TCS.BSE",
    hdfc: "HDFCBANK.BSE",
    icici: "ICICIBANK.BSE",
    sbi: "SBIN.BSE",
    wipro: "WIPRO.BSE",
  };
  
  export async function getStock(input: string) {
    const key = process.env.STOCK_KEY;
    const cleaned = input.trim().toLowerCase();
    const symbol = map[cleaned] || cleaned.toUpperCase();
  
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`
      );
  
      const data = await res.json();
      const price = data["Global Quote"]?.["05. price"];
  
      if (!price) {
        return { type: "text", content: `Stock not found for ${input}` };
      }
  
      return {
        type: "stock",
        symbol,
        price,
      };
    } catch {
      return { type: "text", content: "Stock service unavailable." };
    }
  }
  