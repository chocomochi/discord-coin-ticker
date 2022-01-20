import os
from flask import Flask, jsonify, request
from threading import Thread
from subprocess import call
import json

# creating a Flask app
app = Flask(__name__)

@app.route('/')
def index():
  return "tf u think u doing?"

@app.route('/getCoin', methods = ['POST'])
def home():
  body = json.loads(request.data)
  try: # check if we got the right post_data
    currency = body['currency']
    coin_id = body['coin_id']
    server_id = body['server_id']
    currency_symbol = body['currency_symbol']
    freq = body['frequency']
    token = body['token']
    password = body['password']
  except:
    return jsonify({
      "success": False,
      "message": "ULOOL!"
    })
  else:
    if password == os.environ['PASSWORD']:
      _args = ["npx", "node", "./api.js", currency, coin_id, server_id, currency_symbol, f"{freq}", token] # run a command shell for the api.js file
      bot_thread = Thread(target=call, args=(_args,), daemon=True) # create a thread for it
      bot_thread.start()
      bot_thread.join()
      
      return jsonify({
        "success": True
      })
    else:
      return jsonify({
        "success": False,
        "message": "ULOOL!"
      })

def run():
  app.run(host='0.0.0.0', port=8080)

def keep_alive():
  forever_thread = Thread(target=run, daemon=True)
  forever_thread.start()
  forever_thread.join()

if __name__ == '__main__':
	keep_alive()
