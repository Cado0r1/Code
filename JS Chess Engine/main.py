from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

Board = 'rbnqknbr,pppppppp,8,8,8,8,PPPPPPPP,RBNQKNBR'

@app.route('/Board/')
def ChessBoardSetUp():
    return jsonify({'Board':Board})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)