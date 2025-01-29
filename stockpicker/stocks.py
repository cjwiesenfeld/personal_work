# File path: analyze_volatility.py

import yfinance as yf
import pandas as pd

# Fetch the list of S&P 500 companies
def get_sp500_tickers():
    sp500_url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    tables = pd.read_html(sp500_url)
    df = tables[0]
    tickers = df['Symbol'].tolist()
    return tickers

# Calculate daily volatility as (High - Low) / Open
def calculate_volatility(data):
    data['Volatility'] = (data['High'] - data['Low']) / data['Open']
    return data

# Analyze the volatility over the past week (Monday to Thursday)
def analyze_weekly_volatility(tickers):
    weekly_volatilities = {}
    for ticker in tickers:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="5d")  # Last 5 trading days
        if len(hist) < 5:
            continue  # Skip if data is not sufficient
        hist = calculate_volatility(hist)
        avg_volatility = hist['Volatility'].mean()
        current_price = hist['Close'].iloc[-1]
        potential_price = current_price * (1 + avg_volatility)
        weekly_volatilities[ticker] = {
            'avg_volatility': avg_volatility,
            'current_price': current_price,
            'potential_price': potential_price
        }
    return weekly_volatilities

# Get the top 5 stocks with the highest expected volatility
def get_top_5_volatile_stocks(volatilities):
    sorted_stocks = sorted(volatilities.items(), key=lambda x: x[1]['avg_volatility'], reverse=True)
    return sorted_stocks[:5]

def main():
    tickers = get_sp500_tickers()
    volatilities = analyze_weekly_volatility(tickers)
    top_5_stocks = get_top_5_volatile_stocks(volatilities)
    
    print("Top 5 stocks with highest expected volatility for next market day:")
    for ticker, data in top_5_stocks:
        print(f"Ticker: {ticker}, Avg Volatility: {data['avg_volatility']:.2%}, "
              f"Current Price: ${data['current_price']:.2f}, "
              f"Potential Price: ${data['potential_price']:.2f}")

if __name__ == "__main__":
    main()
