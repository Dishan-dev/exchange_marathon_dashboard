import csv
import random
import datetime

# Config
# Timezone Asia/Colombo is +05:30
COLOMBO_TZ = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
END_DATE = datetime.datetime(2026, 3, 23, 23, 59, 59, tzinfo=COLOMBO_TZ)
START_DATE = END_DATE - datetime.timedelta(days=90)
TOTAL_ROWS = 1200

TEAMS_SQUADS = {
    'b2b': ['B2B Titans', 'B2B Hunters'],
    'ir': ['IR Connect', 'IR Explore'],
    'matching': ['Match Makers', 'Match Ops'],
    'marcom': ['Marcom Stars', 'Marcom Sparks']
}

# Roles: The user didn't specify exactly, so I'll use a mix.
ROLES = ['Team Member', 'Activity Lead', 'Project Coordinator', 'Support Associate']

# Generate 56 unique members (7 per squad)
members = []
member_id = 1
for team, squads in TEAMS_SQUADS.items():
    for squad in squads:
        for i in range(7):
            name = f"Member {member_id:02d}"
            email = f"member{member_id:02d}@exchangemarathon.com"
            # Assign fixed role
            role = random.choice(ROLES)
            
            # Performance groups: 20% low, 60% average, 20% high
            r = random.random()
            if r < 0.2:
                perf = 'low'
            elif r < 0.8:
                perf = 'average'
            else:
                perf = 'high'
            
            members.append({
                'id': member_id,
                'name': name,
                'email': email,
                'role': role,
                'team': team,
                'squad': squad,
                'perf': perf
            })
            member_id += 1

def generate_activity(perf):
    if perf == 'low':
        return random.randint(0, 1), random.randint(0, 8), random.randint(0, 6)
    elif perf == 'average':
        return random.randint(0, 2), random.randint(5, 12), random.randint(5, 10)
    else: # high
        return random.randint(1, 3), random.randint(12, 20), random.randint(10, 15)

# We need to distribute 1200 rows over 91 days (last 90 days from March 23)
days = []
curr = START_DATE
while curr <= END_DATE:
    days.append(curr.date())
    curr += datetime.timedelta(days=1)

rows = []
used_timestamps = set() # (email, timestamp_str)

# Group members by team to ensure team-day constraint
team_map = {team: [m for m in members if m['team'] == team] for team in TEAMS_SQUADS}

# Requirement: At least 10 submissions per day overall
# Requirement: At least one submission per team per day

# 1. Satisfy constraints first
for day in days:
    # At least one per team
    for team in TEAMS_SQUADS:
        m = random.choice(team_map[team])
        mous, calls, followups = generate_activity(m['perf'])
        
        # Random time during the day
        while True:
            hour = random.randint(8, 20)
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            ts = datetime.datetime.combine(day, datetime.time(hour, minute, second), tzinfo=COLOMBO_TZ)
            ts_str = ts.isoformat()
            if (m['email'], ts_str) not in used_timestamps:
                used_timestamps.add((m['email'], ts_str))
                rows.append([m['email'], m['name'], m['role'], m['team'], m['squad'], ts_str, mous, calls, followups])
                break
    
    # Fill up to 10/day
    while len([r for r in rows if r[5].startswith(day.isoformat())]) < 10:
        m = random.choice(members)
        mous, calls, followups = generate_activity(m['perf'])
        while True:
            hour = random.randint(8, 20)
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            ts = datetime.datetime.combine(day, datetime.time(hour, minute, second), tzinfo=COLOMBO_TZ)
            ts_str = ts.isoformat()
            if (m['email'], ts_str) not in used_timestamps:
                used_timestamps.add((m['email'], ts_str))
                rows.append([m['email'], m['name'], m['role'], m['team'], m['squad'], ts_str, mous, calls, followups])
                break

# 2. Add remaining rows to reach 1200
while len(rows) < TOTAL_ROWS:
    day = random.choice(days)
    m = random.choice(members)
    mous, calls, followups = generate_activity(m['perf'])
    while True:
        hour = random.randint(8, 20)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        ts = datetime.datetime.combine(day, datetime.time(hour, minute, second), tzinfo=COLOMBO_TZ)
        ts_str = ts.isoformat()
        if (m['email'], ts_str) not in used_timestamps:
            used_timestamps.add((m['email'], ts_str))
            rows.append([m['email'], m['name'], m['role'], m['team'], m['squad'], ts_str, mous, calls, followups])
            break
        # This loop might be infinite if we run out of member-timestamps, but 1200 / (56 * 12 hours * 3600 sec) is tiny.

# Sort by timestamp
rows.sort(key=lambda x: x[5])

# Ensure exactly 1200 rows
if len(rows) > 1200:
    rows = rows[:1200]

# Write to CSV
with open('c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\mock_data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Email Address', 'Member Name', 'Role', 'Team', 'Squad', 'Timestamp', 'MOUs', 'Cold Calls', 'Followups'])
    writer.writerows(rows)
