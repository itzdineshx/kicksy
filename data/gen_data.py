import csv
import random
from datetime import datetime, timedelta

NUM_ROWS = 10000
FILENAME = "indian_sports_ticket_sales.csv"


TEAMS = {
    'IPL': {
        'Chennai Super Kings': {'City': 'Chennai', 'Stadium': 'M. A. Chidambaram Stadium', 'Tier': 1},
        'Mumbai Indians': {'City': 'Mumbai', 'Stadium': 'Wankhede Stadium', 'Tier': 1},
        'Royal Challengers Bengaluru': {'City': 'Bengaluru', 'Stadium': 'M. Chinnaswamy Stadium', 'Tier': 1},
        'Kolkata Knight Riders': {'City': 'Kolkata', 'Stadium': 'Eden Gardens', 'Tier': 1},
        'Gujarat Titans': {'City': 'Ahmedabad', 'Stadium': 'Narendra Modi Stadium', 'Tier': 2},
        'Rajasthan Royals': {'City': 'Jaipur', 'Stadium': 'Sawai Mansingh Stadium', 'Tier': 2},
        'Sunrisers Hyderabad': {'City': 'Hyderabad', 'Stadium': 'Rajiv Gandhi International Stadium', 'Tier': 2},
        'Lucknow Super Giants': {'City': 'Lucknow', 'Stadium': 'BRSABV Ekana Cricket Stadium', 'Tier': 2},
        'Delhi Capitals': {'City': 'Delhi', 'Stadium': 'Arun Jaitley Stadium', 'Tier': 3},
        'Punjab Kings': {'City': 'Mohali', 'Stadium': 'PCA Stadium', 'Tier': 3},
    },
    'ISL': {
        'Mohun Bagan Super Giant': {'City': 'Kolkata', 'Stadium': 'Salt Lake Stadium', 'Tier': 1},
        'Bengaluru FC': {'City': 'Bengaluru', 'Stadium': 'Sree Kanteerava Stadium', 'Tier': 1},
        'Kerala Blasters FC': {'City': 'Kochi', 'Stadium': 'Jawaharlal Nehru Stadium', 'Tier': 1},
        'Mumbai City FC': {'City': 'Mumbai', 'Stadium': 'Mumbai Football Arena', 'Tier': 2},
        'FC Goa': {'City': 'Margao', 'Stadium': 'Fatorda Stadium', 'Tier': 2},
        'Chennaiyin FC': {'City': 'Chennai', 'Stadium': 'Jawaharlal Nehru Stadium, Chennai', 'Tier': 2},
        'Odisha FC': {'City': 'Bhubaneswar', 'Stadium': 'Kalinga Stadium', 'Tier': 3},
        'Jamshedpur FC': {'City': 'Jamshedpur', 'Stadium': 'JRD Tata Sports Complex', 'Tier': 3},
        'NorthEast United FC': {'City': 'Guwahati', 'Stadium': 'Indira Gandhi Athletic Stadium', 'Tier': 3},
        'Hyderabad FC': {'City': 'Hyderabad', 'Stadium': 'G. M. C. Balayogi Athletic Stadium', 'Tier': 3},
    },
    'PKL': {
        'Jaipur Pink Panthers': {'City': 'Jaipur', 'Stadium': 'Sawai Mansingh Indoor Stadium', 'Tier': 1},
        'Patna Pirates': {'City': 'Patna', 'Stadium': 'Patliputra Sports Complex', 'Tier': 1},
        'U Mumba': {'City': 'Mumbai', 'Stadium': 'Sardar Vallabhbhai Patel Indoor Stadium', 'Tier': 1},
        'Bengaluru Bulls': {'City': 'Bengaluru', 'Stadium': 'Kanteerava Indoor Stadium', 'Tier': 2},
        'Dabang Delhi K.C.': {'City': 'Delhi', 'Stadium': 'Thyagaraj Sports Complex', 'Tier': 2},
        'Puneri Paltan': {'City': 'Pune', 'Stadium': 'Shree Shiv Chhatrapati Sports Complex', 'Tier': 2},
        'Telugu Titans': {'City': 'Hyderabad', 'Stadium': 'Gachibowli Indoor Stadium', 'Tier': 3},
        'Tamil Thalaivas': {'City': 'Chennai', 'Stadium': 'Jawaharlal Nehru Indoor Stadium', 'Tier': 3},
        'Haryana Steelers': {'City': 'Panchkula', 'Stadium': 'Tau Devi Lal Sports Complex', 'Tier': 3},
        'UP Yoddhas': {'City': 'Noida', 'Stadium': 'Noida Indoor Stadium', 'Tier': 3},
        'Gujarat Giants': {'City': 'Ahmedabad', 'Stadium': 'EKA Arena', 'Tier': 3},
        'Bengal Warriors': {'City': 'Kolkata', 'Stadium': 'Netaji Indoor Stadium', 'Tier': 3},
    }
}

LEAGUE_SEASON_DATES = {
    'IPL': {'start_month': 3, 'start_day': 20, 'end_month': 5, 'end_day': 30},
    'ISL': {'start_month': 10, 'start_day': 1, 'end_month': 3, 'end_day': 15}, # Spans across year-end
    'PKL': {'start_month': 7, 'start_day': 1, 'end_month': 10, 'end_day': 15}
}

PRICE_INFO = {
    'leagues': {'IPL': 1200, 'ISL': 500, 'PKL': 300},
    'demand': {'High': 1.8, 'Medium': 1.2, 'Low': 0.8},
    'seats': {'General': 1.0, 'Premium': 2.5, 'VIP': 5.0, 'Corporate Box': 11.0}
}

WEATHER_PATTERNS = {
    'Mumbai': {'Rainy': [6,7,8,9], 'Clear': [10,11,12,1,2,3,4,5]},
    'Delhi': {'Hazy': [11,12,1], 'Sunny': [2,3,4,5,6,9,10]},
    'Kolkata': {'Humid': [4,5,6,7,8,9,10], 'Clear': [11,12,1,2,3]},
    'Bengaluru': {'Cloudy': [1,2,3,4,5,6,7,8,9,10,11,12]},
    'Chennai': {'Rainy': [10,11,12], 'Humid': [4,5,6,7,8,9], 'Sunny': [1,2,3]},
    'Default': ['Sunny', 'Clear', 'Cloudy', 'Rainy', 'Hazy']
}


def get_demand_level(league, team1_name, team2_name):
    tier1 = TEAMS[league][team1_name]['Tier']
    tier2 = TEAMS[league][team2_name]['Tier']
    if tier1 == 1 and tier2 == 1:
        return 'High'
    if tier1 == 1 or tier2 == 1:
        return 'High'
    if tier1 == 2 and tier2 == 2:
        return 'Medium'
    if (tier1 == 2 and tier2 == 3) or (tier1 == 3 and tier2 == 2):
        return 'Medium'
    return 'Low'

def get_weather(city, month):
    pattern = WEATHER_PATTERNS.get(city)
    if pattern:
        for condition, months in pattern.items():
            if month in months:
                return condition
    return random.choice(WEATHER_PATTERNS['Default'])

def generate_random_date(year, season):
    start_date = datetime(year, season['start_month'], season['start_day'])
    end_date = datetime(year, season['end_month'], season['end_day'])
    if season['start_month'] > season['end_month']: # Season spans across New Year
        end_date = datetime(year + 1, season['end_month'], season['end_day'])
    
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)
    return random_date

def generate_events(num_events=300):
    events = []
    for i in range(num_events):
        league = random.choices(['IPL', 'ISL', 'PKL'], weights=[45, 35, 20], k=1)[0]
        team1_name, team2_name = random.sample(list(TEAMS[league].keys()), 2)
        
        home_team_name = random.choice([team1_name, team2_name])
        home_team_info = TEAMS[league][home_team_name]
        
        year = random.choice([2023, 2024, 2025])
        match_date = generate_random_date(year, LEAGUE_SEASON_DATES[league])

        demand = get_demand_level(league, team1_name, team2_name)
        # Boost demand for weekend matches
        if match_date.weekday() in [4, 5, 6] and demand == 'Medium': # Fri, Sat, Sun
            demand = 'High'
        elif match_date.weekday() in [4, 5, 6] and demand == 'Low':
            demand = 'Medium'
            
        event = {
            "Event_ID": f"EVT{i+1:04d}",
            "League": league,
            "Match_Name": f"{team1_name} vs {team2_name}",
            "Match_Date": match_date,
            "Stadium": home_team_info['Stadium'],
            "City": home_team_info['City'],
            "Weather": get_weather(home_team_info['City'], match_date.month),
            "Day_of_Week": match_date.strftime('%A'),
            "Demand_Level": demand
        }
        events.append(event)
    return events

print("Generating synthetic sports ticket data...")

events = generate_events()
demand_weights = [1 if e['Demand_Level'] == 'Low' else (3 if e['Demand_Level'] == 'Medium' else 6) for e in events]

with open(FILENAME, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)

    header = [
        "Event_ID", "League", "Match_Name", "Match_Date", "Stadium", "City",
        "Seat_Category", "Ticket_Price", "Sale_Date", "Days_Before_Match",
        "Quantity", "Weather", "Day_of_Week", "Demand_Level"
    ]
    writer.writerow(header)
    
    # Generate and Write Rows
    for _ in range(NUM_ROWS):
        event = random.choices(events, weights=demand_weights, k=1)[0]
        
        seat_category = random.choices(
            list(PRICE_INFO['seats'].keys()),
            weights=[60, 25, 12, 3], # General, Premium, VIP, Corporate
            k=1
        )[0]
        
        # Calculate Price
        base_price = PRICE_INFO['leagues'][event['League']]
        demand_multiplier = PRICE_INFO['demand'][event['Demand_Level']]
        seat_multiplier = PRICE_INFO['seats'][seat_category]
        price = base_price * demand_multiplier * seat_multiplier
        price *= random.uniform(0.95, 1.05) # Add small noise

        ticket_price = int(round(price / 50) * 50)
        if ticket_price < 200: ticket_price = 200 # Floor price

        # Generate Sale Date
        days_before_match = int(random.triangular(1, 90, 10))
        sale_date = event['Match_Date'] - timedelta(days=days_before_match)

        # Quantity of tickets
        quantity = random.choices(range(1, 11), weights=[25, 35, 10, 15, 5, 3, 2, 2, 1, 2], k=1)[0]

        row = [
            event['Event_ID'],
            event['League'],
            event['Match_Name'],
            event['Match_Date'].strftime('%d-%m-%Y'),
            event['Stadium'],
            event['City'],
            seat_category,
            ticket_price,
            sale_date.strftime('%d-%m-%Y'),
            days_before_match,
            quantity,
            event['Weather'],
            event['Day_of_Week'],
            event['Demand_Level']
        ]
        writer.writerow(row)

print(f"Successfully generated {NUM_ROWS} rows of data in '{FILENAME}'.")
