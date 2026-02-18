const map: Record<string, string> = {
    apple: "AAPL",
    tesla: "TSLA",
    microsoft: "MSFT",
    google: "GOOGL",
    alphabet: "GOOGL",
    amazon: "AMZN",
    meta: "META",
    facebook: "META",
    netflix: "NFLX",
    nvidia: "NVDA",
    intel: "INTC",
    amd: "AMD",
    oracle: "ORCL",
    ibm: "IBM",
    adobe: "ADBE",
    salesforce: "CRM",
    uber: "UBER",
    airbnb: "ABNB",
    paypal: "PYPL",
    spotify: "SPOT",
    shopify: "SHOP",
    zoom: "ZM",
    walmart: "WMT",
    costco: "COST",
    "coca cola": "KO",
    pepsi: "PEP",
    nike: "NKE",
    mcdonalds: "MCD",
    starbucks: "SBUX",
    shell: "SHEL",
    bp: "BP",
    exxon: "XOM",
    chevron: "CVX",
    boeing: "BA",
    "lockheed martin": "LMT",
    ford: "F",
    "general motors": "GM",
    toyota: "TM",
    samsung: "005930.KS",
    tsmc: "TSM",
    reliance: "RELIANCE.BSE",
    infosys: "INFY.BSE",
    tcs: "TCS.BSE",
    "hdfc bank": "HDFCBANK.BSE",
    "icici bank": "ICICIBANK.BSE",
    sbi: "SBIN.BSE",
    wipro: "WIPRO.BSE",
    "bharti airtel": "BHARTIARTL.BSE",
    "adani enterprises": "ADANIENT.BSE",
    "coal india": "COALINDIA.BSE",
  };
  
  export async function getStock(input: string) {
    const key = process.env.STOCK_KEY;
  
    if (!key) return "Stock API key missing.";
  
    const cleaned = input.trim().toLowerCase();
  
    // Try mapped company name first
    let symbol = map[cleaned];
  
    // If not found, assume user typed ticker already
    if (!symbol) {
      symbol = cleaned.toUpperCase();
    }
  
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`
      );
  
      const data = await res.json();
      const price = data["Global Quote"]?.["05. price"];
  
      if (!price) {
        return `Could not fetch stock data for "${input}". Try using the ticker symbol.`;
      }
  
      return `${symbol} current price: $${price}`;
    } catch {
      return "Stock service temporarily unavailable.";
    }
  }
  