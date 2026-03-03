import pymysql

class Database:
    def __init__(self):
        # Inserisci i tuoi dati di Aiven qui
        self.host = "mysql-221cedb1-iisgalvanimi-9701.j.aivencloud.com"
        self.user = "avnadmin"
        self.password = "AVNS_v5ZY1LueloCJza2Bkdd"
        self.db = "registro_elettronico"
        self.port = 17424 # La tua porta Aiven

    def get_connection(self):
        return pymysql.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.db,
            port=self.port,
            cursorclass=pymysql.cursors.DictCursor
        )

    def query(self, sql, params=None):
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, params or ())
                result = cursor.fetchall()
            return result
        finally:
            conn.close()

    def execute(self, sql, params=None):
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(sql, params or ())
                conn.commit()
                return cursor.lastrowid
        finally:
            conn.close()

# Istanza globale della classe wrapper
db = Database()