from flask import Flask, request, jsonify, g
from flask_cors import CORS
import requests
from auth import require_auth, require_role
from database import db  # Importiamo la nostra classe wrapper

app = Flask(__name__)
CORS(app)

# --- ROTTE DOCENTE ---

@app.route("/voti/inserisci", methods=["POST"])
@require_auth
@require_role("docente")
def inserisci_voto():
    data = request.get_json()
    studente = data.get('studente')
    materia = data.get('materia')
    voto = data.get('voto')
    docente = g.user.get("preferred_username")

    if not all([studente, materia, voto]):
        return jsonify({"error": "Dati mancanti"}), 400

    sql = "INSERT INTO voti (studente_nome, materia, voto, docente_nome) VALUES (%s, %s, %s, %s)"
    db.execute(sql, (studente, materia, voto, docente))
    
    return jsonify({"message": "Voto inserito correttamente"}), 201

@app.route("/voti/tutti", methods=["GET"])
@require_auth
@require_role("docente")
def visualizza_tutti():
    sql = "SELECT * FROM voti"
    risultati = db.query(sql)
    return jsonify({"voti": risultati})

# --- ROTTE STUDENTE ---

@app.route("/voti/miei", methods=["GET"])
@require_auth
@require_role("studente")
def visualizza_miei():
    # Lo studente vede solo i record dove studente_nome == il suo username Keycloak
    username_studente = g.user.get("preferred_username")
    
    sql = "SELECT materia, voto, docente_nome FROM voti WHERE studente_nome = %s"
    risultati = db.query(sql, (username_studente,))
    
    return jsonify({"voti": risultati})

@app.route("/studenti", methods=["GET"])
@require_auth
@require_role("docente")
def get_studenti_easy():
    # 1. Chiediamo un token usando le tue credenziali admin (quelle del docker-compose)
    token_url = f"{"https://fantastic-lamp-97vv7gx6xggvc76wv-8080.app.github.dev"}/realms/master/protocol/openid-connect/token"
    data = {
        'grant_type': 'password',
        'client_id': 'admin-cli',
        'username': 'admin',      # Lo username che usi per entrare in Keycloak
        'password': 'admin'       # La password che usi per entrare in Keycloak
    }
    
    admin_token = requests.post(token_url, data=data).json().get('access_token')

    # 2. Usiamo quel token per leggere gli utenti del tuo Realm
    users_url = f"{"https://fantastic-lamp-97vv7gx6xggvc76wv-8080.app.github.dev"}/admin/realms/{"registro"}/roles/studente/users"
    headers = {'Authorization': f'Bearer {admin_token}'}
    
    users_data = requests.get(users_url, headers=headers).json()
    
    # Se per qualche motivo l'API fallisce, restituiamo una lista vuota
    if not isinstance(users_data, list):
        return jsonify({"studenti": []})

    studenti = [{"username": u['username']} for u in users_data]
    return jsonify({"studenti": studenti})

if __name__ == "__main__":
    app.run(debug=True)