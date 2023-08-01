#!/usr/bin/env python3
""" Basic Babel setup"""
from flask import Flask
from flask_babel import Babel


app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """ Config class for Babel"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'
