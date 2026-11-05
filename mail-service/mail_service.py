import os
from flask import Flask, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)

app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.environ['MAIL_USERNAME'],
    MAIL_PASSWORD=os.environ['MAIL_PASSWORD']
)

mail = Mail(app)

@app.route('/send-mail', methods=['POST'])
def send_mail():
    data = request.json

    msg = Message(
        subject=data['subject'],
        sender=app.config['MAIL_USERNAME'],
        recipients=[data['to']],
        body=data['body']
    )

    mail.send(msg)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(port=5001)
