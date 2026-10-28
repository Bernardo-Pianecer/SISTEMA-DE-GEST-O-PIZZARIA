import mysql.connector
from pathlib import Path

conexao = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="123456",
    database="Palladares"
)

cursor = conexao.cursor()

caminho_sql = Path(__file__).parent / "database.sql"

with open(caminho_sql, "r", encoding="utf-8") as arquivo:
    sql = arquivo.read()

for comando in sql.split(";"):
    comando = comando.strip()

    if comando:
        cursor.execute(comando)
        resultado = cursor.fetchall()

        for linha in resultado:
            print(linha)

conexao.commit()

cursor.close()
conexao.close()

print("Arquivo SQL executado com sucesso!")