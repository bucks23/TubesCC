import requests
from prometheus_client import CollectorRegistry, Gauge, generate_latest

# Ganti dengan token GitHub Anda
GITHUB_TOKEN = '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'
REPO_OWNER = 'bucks23'
REPO_NAME = 'TubesCC'

# URL API GitHub untuk statistik komit
url = f'https://api.github.com/repos/bucks23/TubesCC/stats/contributors'

headers = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    contributors = response.json()
    registry = CollectorRegistry()
    g = Gauge('github_contributors', 'Number of contributors', labelnames=['contributor'], registry=registry)

    for contributor in contributors:
        g.labels(contributor=contributor['author']['login']).set(contributor['total'])

    # Menyimpan metrik ke file
    with open('metrics.prom', 'w') as f:
        f.write(generate_latest(registry).decode('utf-8'))
else:
    print(f'Error fetching data: {response.status_code}')
