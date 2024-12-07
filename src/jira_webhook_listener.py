from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/jira-webhook', methods=['POST'])
def jira_webhook_listener():
    data = request.json
    # Process the Jira webhook event data here
    print(f"Received Jira event: {data}")
    # Respond with a 200 status to acknowledge receipt
    return jsonify({'status': 'success'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
