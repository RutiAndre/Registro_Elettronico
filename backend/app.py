from flask import Flask, request, jsonify, g
from flask_cors import CORS
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

if __name__ == "__main__":
    app.run(debug=True)