from importlib.metadata import requires
from time import process_time_ns
from flask import Flask, jsonify, make_response, send_from_directory, render_template, request, flash, redirect, session
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired
import sqlite3
import os

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = 'Qwerty123!'

picFolder = os.path.join('static', 'pics')
app.config['UPLOAD_FOLDER'] = picFolder


class NameForm(FlaskForm):
    login = StringField('Login', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')


class RegisterForm(FlaskForm):
    login = StringField('Login', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Register')


@app.route("/")
def base():
    return send_from_directory('client/public', 'index.html')


@app.route("/<path:path>")
def home(path):
    return send_from_directory('client/public', path)


@app.route('/logowanie', methods=['GET', 'POST'])
def logowanie():
    loginForm = NameForm()
    return render_template('login.html', title='Logowanie', form=loginForm)


Login = ""
Poziom = ""
Password = ""


@app.route('/', methods=['GET', 'POST'])
def log():
    myConnection = sqlite3.connect('addressBook.sqlite')
    myCursor = myConnection.cursor()
    login = request.form['login']
    password = request.form['password']
    myCursor.execute("SELECT *, oid FROM addresses")
    records = myCursor.fetchall()

    bool = False
    for i in records:
        if i[0] == login and i[1] == password:
            bool = True

    if bool:
        if login == "admin" and password == "admin":
            global Poziom
            Poziom = "admin"
        else:
            Poziom = "normal"
        global Login
        global Password
        Login = str(login)
        Password = str(password)
        return send_from_directory('client/public', "index.html")
    else:
        bool = True
        loginForm = NameForm()
        return render_template('login.html', title='Logowanie', form=loginForm, bool=bool)


@app.route('/register')
def register():
    addressesForm = RegisterForm()
    return render_template('register.html', title='Dane adresowe - formularz', form=addressesForm)


@app.route('/saveRegister', methods=['POST'])
def saveRegister():
    myConnection = sqlite3.connect('addressBook.sqlite')
    myCursor = myConnection.cursor()

    login = request.form['login']
    password = request.form['password']
    myCursor.execute("INSERT INTO addresses VALUES (:login, :password)",
                     {
                         'login': login,
                         'password': password
                     })
    myConnection.commit()
    myConnection.close()
    return render_template('saveRegister.html', title='Dane zapisane')


@app.route('/userssettings')
def usersSettings():
    myConnection = sqlite3.connect('addressBook.sqlite')
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM addresses")
    records = myCursor.fetchall()
    return render_template('admin.html', title='Dane zapisane', records=records)


@app.route('/edit')
def edit():
    id = request.args.get('id')
    session['id'] = id
    myConnection = sqlite3.connect('addressBook.sqlite')
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM addresses WHERE oid = " + id)
    records = myCursor.fetchall()
    for record in records:
        editLoginForm = NameForm(login=record[0], password=record[1])
    return render_template('edit.html', title='Dane zapisane', form=editLoginForm)


@app.route('/saveEdit', methods=['POST'])
def saveEdit():
    id = session['id']
    myConnection = sqlite3.connect('addressBook.sqlite')
    myCursor = myConnection.cursor()
    login = request.form['login']
    password = request.form['password']
    myCursor.execute("UPDATE addresses SET login = '" + login +
                     "', password = '" + password + "' WHERE oid = " + id)
    myConnection.commit()
    myConnection.close()
    global Login
    global Password
    Login = str(login)
    Password = str(password)
    return render_template('saveEdit.html', title='Dane zapisane')


@app.route('/login')
def login():
    data = {"login": Login, "password": Password, "poziom": Poziom}
    return data


@app.route('/user')
def user():
    myConnection = sqlite3.connect('addressBook.sqlite')
    myCursor = myConnection.cursor()
    login = request.args.get('login')
    password = request.args.get('password')
    myCursor.execute("SELECT *, oid FROM addresses")
    records = myCursor.fetchall()
    myConnection.close()
    r = ""
    for i in records:
        if i[0] == login and i[1] == password:
            r = i
            break
    return render_template('user.html', title='Dane zapisane', records=r)


@app.route('/motyw', methods=['POST'])
def motyw():
    req = request.args.get('id')
    res = make_response(jsonify({"id": req}), 200)
    return res


@app.route("/newTheme", methods=['POST'])
def newTheme():
    req = request.get_json()
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()
    sql = """UPDATE newTheme SET block = ?, fontSize = ?, fontFamily = ?, fontColor = ?, mainColor = ? WHERE oid = 1"""
    val = (req["block"], req["fontSize"], req["fontFamily"],
           req["fontColor"], req["mainColor"])
    myCursor.execute(sql, val)
    myConnection.commit()
    myConnection.close()

    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route("/variables", methods=['POST'])
def variables():
    req = request.get_json()
    print(req)
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()
    sql = """UPDATE variables SET themeId = ?, articleId = ?, article = ?, title = ?, category = ?, topMenu = ?, topMenuOption = ?, sliderTime = ?, sliderDescription = ?, Footer = ?  WHERE oid = 1"""
    val = (req["themeId"], req["articleId"], req["article"], req["title"], req["category"],
           req["topMenu"], req["topMenuOption"], req["sliderTime"], req["sliderDescription"], req["Footer"])
    myCursor.execute(sql, val)
    myConnection.commit()
    myConnection.close()
    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route("/topMenuSettings", methods=['POST'])
def topMenuSettings():
    req = request.get_json()
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()
    sql = """UPDATE topMenuSettings SET fontSize = ?, fontFamily = ?, fontColor = ?, mainColor = ? WHERE oid = 1"""
    val = (req["fontSize"],
           req["fontFamily"],
           req["fontColor"],
           req["mainColor"])
    myCursor.execute(sql, val)
    myConnection.commit()
    myConnection.close()
    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route("/FooterSettings", methods=['POST'])
def FooterSettings():
    req = request.get_json()
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()
    sql = """UPDATE FooterSettings SET fontSize = ?, fontFamily = ?, fontColor = ?, mainColor = ? WHERE oid = 1"""
    val = (req["fontSize"],
           req["fontFamily"],
           req["fontColor"],
           req["mainColor"])
    myCursor.execute(sql, val)
    myConnection.commit()
    myConnection.close()
    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route('/addComments', methods=['POST'])
def addComments():
    req = request.get_json()
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()
    myCursor.execute("INSERT INTO comments2 VALUES (:text, :articleId)",
                     {
                         'text': req["comment"],
                         'articleId': req["articleId"]
                     })
    myConnection.commit()
    myConnection.close()
    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route('/addArticles', methods=['POST'])
def articles():
    req = request.get_json()
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()

    myCursor.execute("INSERT INTO articles2 VALUES (:id, :category, :title, :text)",
                     {
                         "id": req["id"],
                         "category": req["category"],
                         "title": req["title"],
                         "text": req["text"]
                     })
    myConnection.commit()
    myConnection.close()
    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route('/deleteArticles', methods=['POST'])
def deleteArticles():
    req = request.get_json()
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()

    myCursor.execute("DELETE FROM articles2 WHERE oid=" + req["id"])
    myConnection.commit()
    myConnection.close()
    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route('/editArticles', methods=['POST'])
def editArticles():
    req = request.get_json()
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()

    sql = "UPDATE articles2 SET category = ?, title = ?, text = ? WHERE oid = " + \
        req["id"]
    val = (req["category"],
           req["title"],
           req["text"])
    myCursor.execute(sql, val)
    myConnection.commit()
    myConnection.close()
    res = make_response(jsonify({"ok": "ok"}))
    return res


@app.route('/all')
def all():
    myConnection = sqlite3.connect('allVariables.sqlite')
    myCursor = myConnection.cursor()

    myCursor.execute("SELECT * FROM newTheme")
    newTheme = myCursor.fetchall()

    myCursor.execute("SELECT * FROM variables")
    variables = myCursor.fetchall()

    myCursor.execute("SELECT * FROM bigArticle")
    bigArticle = myCursor.fetchall()

    myCursor.execute("SELECT * FROM topMenuSettings")
    topMenuSettings = myCursor.fetchall()

    myCursor.execute("SELECT * FROM FooterSettings")
    FooterSettings = myCursor.fetchall()

    myCursor.execute("SELECT * FROM comments2")
    comments = myCursor.fetchall()

    myCursor.execute("SELECT * FROM articles2")
    articles = myCursor.fetchall()

    myConnection.commit()
    myConnection.close()

    res = make_response(jsonify({
        "newTheme": newTheme,
        "variables": variables,
        "bigArticle": bigArticle,
        "topMenuSettings": topMenuSettings,
        "FooterSettings": FooterSettings,
        "comments": comments,
        "articles": articles
    }), 200)

    return res


if __name__ == "__main__":
    app.run(debug=True)
