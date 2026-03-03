from flask import request, jsonify, g
from functools import wraps
import jwt
import requests

# CONFIGURAZIONE KEYCLOAK (Modifica con i tuoi dati!)
KEYCLOAK_URL = "https://fantastic-lamp-97vv7gx6xggvc76wv-8080.app.github.dev/" # URL del tuo Keycloak
REALM = "registro"
CLIENT_ID = "registro_elettronico"
JWKS_URL = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs"

def get_keycloak_public_key(token):
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    
    response = requests.get(JWKS_URL)
    jwks = response.json()
    
    for key_data in jwks["keys"]:
        if key_data["kid"] == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(key_data)
    raise Exception("Chiave pubblica non trovata")

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token mancante"}), 401
        
        token = auth_header.split(" ")[1]
        try:
            public_key = get_keycloak_public_key(token)
            payload = jwt.decode(
                token, 
                public_key, 
                algorithms=["RS256"], 
                audience=CLIENT_ID, # Questo verifica che il token sia per il tuo client
                options={"verify_exp": True}
            )
            g.user = payload # Salviamo i dati dell'utente (username, ruoli) in g.user
        except Exception as e:
            return jsonify({"error": f"Token non valido: {str(e)}"}), 401
            
        return f(*args, **kwargs)
    return decorated

def require_role(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # Keycloak di solito mette i ruoli del realm in realm_access -> roles
            user_roles = g.user.get("realm_access", {}).get("roles", [])
            if role not in user_roles:
                return jsonify({"error": f"Permesso negato: richiesto ruolo {role}"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator