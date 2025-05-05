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

@app.route('/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT * FROM tasks')
    tasks = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    status = data.get('status', 'pending')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO tasks (title, description, status) VALUES (%s, %s, %s) RETURNING id', (title, description, status))
    task_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Task created successfully", "id": task_id}), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    status = data.get('status')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE tasks SET title = %s, description = %s, status = %s WHERE id = %s', (title, description, status, task_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Task updated successfully"})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Task deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
