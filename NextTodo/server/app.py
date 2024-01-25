from flask import Flask, Response, current_app, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson import ObjectId
from bson import json_util
from flask import Flask, session
from flask_session import Session


app = Flask(__name__)
CORS(app)

@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()


 
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*') 
  # response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173') 
  # response.headers.add('Access-Control-Allow-Origin', 'https://cc1b-2401-4900-614c-cde2-c31-3e5d-3a60-bfeb.ngrok-free.app') 
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  
  return response

@app.route('/sw.js')
def sw():
    # Specify the correct MIME type for JavaScript
    return send_file('path/to/your/sw.js', mimetype='application/javascript')

 

# app.config['SESSION_TYPE'] = 'filesystem'
# app.config['SESSION_PERMANENT'] = False
# app.config['SESSION_USE_SIGNER'] = True


# Session(app)


client = MongoClient('mongodb://localhost:27017/')
db = client.db4react
user_collection = db.users
notes_collection = db.notes
info_collection = db.info

stat={'logged_in':0}



@app.route('/login/', methods=['POST'])
def login():
    email = request.json['email']
    user = user_collection.find_one({'email': email})
    notes = list(notes_collection.find({'email': email}))
    
    if not user or request.json['password'] != user['password']:
        return jsonify({'error': 'Invalid email or password'}), 401
    print('attempt to login')
    stat['logged_in']=1
    return json_util.dumps({
        'notes': notes,
        'loggedIn': stat['logged_in']}), 200


@app.route('/logout/', methods=['GET'])
def logout():
    stat['logged_in']=0
    print(stat['logged_in'])
    stat['logged_in']=0
    return json_util.dumps({
        'loggedIn': stat['logged_in']}), 200


@app.route('/signup/', methods=['POST'])
def signup():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    existing_user = user_collection.find_one({'email': email})
    if existing_user:
        return jsonify('notsuccess')
    
    notes = []
    user_collection.insert_one({
        'username': username,
        'email': email,
        'password': password
    })
    stat['logged_in']=1

    return json_util.dumps({
        'notes': notes,
        'loggedIn': stat['logged_in']}), 200



@app.route('/home/', methods=['POST', 'GET', 'DELETE'])
def home():
    if request.method == 'POST':
        if stat['logged_in']==1:
            print(stat['logged_in'])
            note = request.json['newnote']
            email = request.json['email']

            notes_collection.insert_one({
                'email': email,
                'note': note
            })
            notes = list(notes_collection.find({'email': email}))
            return json_util.dumps({
                'notes': notes,
                'loggedIn': stat['logged_in']}), 200
        else:
            return 404

    elif request.method == 'GET':
        if stat['logged_in']==1:
            print(stat['logged_in'])
            email = request.args.get('email')
            notes = list(notes_collection.find({'email': email}))
            return json_util.dumps({
                'notes': notes,
                'loggedIn': stat['logged_in']}), 200
        else:
            return 404
        

    elif request.method == 'DELETE':
        if stat['logged_in']==1:
            print(stat['logged_in'])
            note_id = request.json.get('noteId')
            email = request.json.get('email')
            extended_json_data = note_id

            object_id_value = ObjectId(extended_json_data['$oid'])
            result=notes_collection.delete_one({'_id':  object_id_value})
            notes = list(notes_collection.find({'email': email}))
            return json_util.dumps({
                'notes': notes,
                'loggedIn': stat['logged_in']}), 200
        else:
            return 404

if __name__ == '__main__':
    app.run(port=8080, debug=True)
