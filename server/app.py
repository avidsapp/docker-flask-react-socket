import os
from flask import Flask, session, request, copy_current_request_context, jsonify
from flask_socketio import SocketIO, send, emit, disconnect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app, cors_allowed_origins="*")

#Define home route /
@app.route('/')
def welcome():
    return jsonify({'status': 'api/socket working'})

# Handle connection to socketserver
@socketio.on('connect')
def handleConnect():
    emit('serverMsg', 'Server response - Client connected')

# Handle the webapp sending a message to the websocket
@socketio.on('clientMsg')
def handle_message(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('serverMsg', {
        'id':session['receive_count'],
        'data':message["data"],
        'value':message["value"],
        'status':message["status"]
    })
    emit('appendBoard', 'Message #{} - Value entered: {}'.format(session['receive_count'],message['value']))


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
