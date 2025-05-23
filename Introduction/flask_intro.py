from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__) #file reference
app.config['SQLAKCHEMY_DATABASE_URI'] = 'sqlite:///test.db'  #//// for absolute path while /// for relative path
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default = datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

@app.route('/')    #avoid immediately get 404 error
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)

