from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.getenv('POSTGRES_DB', 'project_management'),
        user=os.getenv('POSTGRES_USER', 'admin'),
        password=os.getenv('POSTGRES_PASSWORD', 'password'),
        host=os.getenv('POSTGRES_HOST', 'postgres-service')
    )
    return conn

@app.route('/projects', methods=['GET'])
def get_projects():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM projects')
    projects = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(projects)

@app.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO projects (name, description) VALUES (%s, %s) RETURNING id', (name, description))
    project_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Project created successfully", "id": project_id}), 201

@app.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE projects SET name = %s, description = %s WHERE id = %s', (name, description, project_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Project updated successfully"})

@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM projects WHERE id = %s', (project_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Project deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
