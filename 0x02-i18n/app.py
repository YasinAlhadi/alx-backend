#!/usr/bin/env python3
"""Infer appropriate time zone"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz

app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """ Config class for Babel"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> dict:
    """ returns a user dictionary or
        None if the ID cannot be found or
        if login_as was not passed.
    """
    try:
        return users[int(request.args.get('login_as'))]
    except Exception:
        return None


@app.before_request
def before_request():
    """ Find a user if any, and set it as a
        global on flask.g.user
    """
    g.user = get_user()


@babel.localeselector
def get_locale() -> str:
    """ function to use a user’s preferred local if it is supported.
        If the user’s preferred locale is not supported,
        use the best match locale.
    """
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    if g.user:
        locale = g.user['locale']
        if locale and locale in app.config['LANGUAGES']:
            return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone() -> str:
    """ function to infer appropriate time zone
    """
    try:
        if g.user:
            timezone = g.user['timezone']
            if timezone:
                return pytz.timezone(timezone)
    except pytz.exceptions.UnknownTimeZoneError:
        return app.config['BABEL_DEFAULT_TIMEZONE']


@app.route('/')
def index() -> str:
    """  render Basic index.html """
    g.time = get_timezone()
    return render_template('6-index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
