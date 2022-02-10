import requests
import time

time.sleep(60)

github_url="https://api.github.com/repos/shamantraghav/twilio-cli/actions/workflows/release-token-validation.yml/runs"
response = requests.get(github_url)
output=response.json()
print(output['workflow_runs'][0]['conclusion'])
