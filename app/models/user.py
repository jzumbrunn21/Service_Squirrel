from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import DateTime
from sqlalchemy.sql import func
# from .billing import Billing
# from .review import Review


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(255), nullable=False)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now())


    billings = db.relationship(
        "Billing",
        back_populates='user',
        cascade="all, delete-orphan"
    )

    reviews = db.relationship(
        'Review',
        back_populates='user',
        cascade="all, delete-orphan"
    )

    services = db.relationship(
        'Service',
        back_populates='user',
        cascade="all, delete-orphan"
    )



    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'address': self.address,
            'profile_picture': self.profile_picture
        }
