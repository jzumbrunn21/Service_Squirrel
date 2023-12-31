from flask_wtf import FlaskForm
from wtforms import StringField, DateField
from wtforms.validators import DataRequired, Length, NumberRange, ValidationError
from app.models import Service
from datetime import date


def exp_date_check(form, field):
    today = date.today
    if field.data < today:
        raise ValidationError('Your card cannot be expired.')

class BillingForm(FlaskForm):
    card_full_name = StringField('card_full_name', validators=[DataRequired(), Length(min=6, max=100, message='Full Name must be between 6 and 100 characters')])
    card_number = StringField('card_number', validators=[DataRequired(), Length(min=15, max=19, message='Card Number must be betwen 15 and 19 characters')])
    card_cvv = StringField('card_cvv', validators=[DataRequired(), Length(min=3, max=7, message='CVV must be between 3 and 7 characters')])
    card_zipcode = StringField('card_zipcode', validators=[DataRequired(), Length(min=5, max=15, message='Zipcode must be between 5 and 15 characters') ])
    card_exp_date = StringField('exp_date', validators=[DataRequired()])
