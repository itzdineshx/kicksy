import pandas as pd
import numpy as np
from datetime import date, timedelta

np.random.seed(42)

# Leagues
leagues = {
    'IPL': 1, 'ISL': 2, 'PKL': 3, 'PBL': 4, 'UTT': 5,
    'HIL': 6, 'SBL': 7, 'PWL': 8, 'WPL': 9, 'WKL': 10
}

# Stadiums and Cities
stadium_city_map = {
    1: 'Mumbai', 2: 'Delhi', 3: 'Bengaluru', 4: 'Chennai', 5: 'Kolkata',
    6: 'Hyderabad', 7: 'Pune', 8: 'Ahmedabad', 9: 'Jaipur', 10: 'Lucknow'
}

# Teams for each league (simplified for this task)
teams = {
    'IPL': [f'IPL_Team_{i}' for i in range(1, 11)],
    'ISL': [f'ISL_Team_{i}' for i in range(1, 11)],
    'PKL': [f'PKL_Team_{i}' for i in range(1, 11)],
    'PBL': [f'PBL_Team_{i}' for i in range(1, 11)],
    'UTT': [f'UTT_Team_{i}' for i in range(1, 11)],
    'HIL': [f'HIL_Team_{i}' for i in range(1, 11)],
    'SBL': [f'SBL_Team_{i}' for i in range(1, 11)],
    'PWL': [f'PWL_Team_{i}' for i in range(1, 11)],
    'WPL': [f'WPL_Team_{i}' for i in range(1, 11)],
    'WKL': [f'WKL_Team_{i}' for i in range(1, 11)],
}

# Team codes
team_codes = {}
current_code = 1
for league, team_list in teams.items():
    for team in team_list:
        team_codes[team] = current_code
        current_code += 1

# Popular matchups (simplified)
popular_matchups = {
    'IPL': [('IPL_Team_1', 'IPL_Team_2'), ('IPL_Team_3', 'IPL_Team_4')],
    'ISL': [('ISL_Team_1', 'ISL_Team_2'), ('ISL_Team_3', 'ISL_Team_4')],
}

# Seat categories
seat_categories = {
    'General': 1, 'Premium': 2, 'VIP': 3, 'Corporate Box': 4
}

# Weather codes
weather_codes = {
    'Sunny': 1, 'Rainy': 2, 'Cloudy': 3, 'Hazy': 4, 'Humid': 5
}

# Demand levels
demand_levels = {
    'Low': 1, 'Medium': 2, 'High': 3
}

# Date range
start_date = date(2023, 1, 1)
end_date = date(2025, 12, 31)
num_transactions = 10000

# --- Generate the Dataset ---
data = []

for i in range(num_transactions):
    league_name = np.random.choice(list(leagues.keys()))
    league_code = leagues[league_name]
    event_id = np.random.randint(1, 501)

    team_list = teams[league_name]
    team_a_name, team_b_name = np.random.choice(team_list, 2, replace=False)
    team_a_code = team_codes[team_a_name]
    team_b_code = team_codes[team_b_name]

    match_date = start_date + timedelta(days=np.random.randint(0, (end_date - start_date).days + 1))

    stadium_code = np.random.randint(1, len(stadium_city_map) + 1)
    city_code = stadium_code

    seat_category_code = np.random.randint(1, 5)

    days_before_match = np.random.randint(1, 181)
    sale_date = match_date - timedelta(days=days_before_match)
    
    if sale_date >= match_date:
        sale_date = match_date - timedelta(days=1)
    
    days_before_match = (match_date - sale_date).days
    
    quantity = np.random.randint(1, 11)

    weather_code = np.random.randint(1, 6)

    day_of_week_code = match_date.isoweekday()

    demand_code = np.random.choice([1, 2, 3], p=[0.4, 0.4, 0.2])  # Default distribution

    if league_name in popular_matchups:
        if (team_a_name, team_b_name) in popular_matchups[league_name] or \
           (team_b_name, team_a_name) in popular_matchups[league_name]:
            demand_code = np.random.choice([1, 2, 3], p=[0.1, 0.2, 0.7]) # Higher probability for High demand

    base_price = np.random.randint(200, 15001)

    if demand_code == 2:  # Medium
        base_price *= 1.2
    elif demand_code == 3: # High
        base_price *= 1.5

    seat_price_multipliers = {1: 1.0, 2: 2.0, 3: 3.0, 4: 5.0}
    base_price *= seat_price_multipliers[seat_category_code]

    price_multiplier_days = 1 + (1 / days_before_match)
    base_price *= price_multiplier_days

    ticket_price = int(np.clip(base_price, 200, 15000))

    data.append([
        event_id, league_code, team_a_code, team_b_code, match_date,
        stadium_code, city_code, seat_category_code, ticket_price,
        sale_date, days_before_match, quantity, weather_code,
        day_of_week_code, demand_code
    ])

# Create a DataFrame
columns = [
    'Event_ID', 'League_Code', 'Team_A_Code', 'Team_B_Code', 'Match_Date',
    'Stadium_Code', 'City_Code', 'Seat_Category_Code', 'Ticket_Price',
    'Sale_Date', 'Days_Before_Match', 'Quantity', 'Weather_Code',
    'Day_of_Week_Code', 'Demand_Level_Code'
]
df = pd.DataFrame(data, columns=columns)

df.to_csv('synthetic_sports_transactions.csv', index=False)

print("Generated a dataset of 10,000 synthetic sports ticket transactions.")
print(df.head())
print(df.info())
