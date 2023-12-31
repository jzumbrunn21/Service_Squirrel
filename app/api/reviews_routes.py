from flask import Blueprint, jsonify, request, redirect
from app.models import db, Review, Service
from .aws_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3
# Forms need importing
from app.forms import ReviewForm
reviews_routes = Blueprint("reviews", __name__)
from flask_login import current_user
import io
from werkzeug.utils import secure_filename
# Could the below be used for error messages?

# def validation_errors_to_error_messages(validation_errors):
#     """
#     Simple function that turns the WTForms validation errors into a simple list
#     """
#     errorMessages = []
#     for field in validation_errors:
#         for error in validation_errors[field]:
#             errorMessages.append(f'{field} : {error}')
#     return errorMessages

# Partial CRUD: Create, Read, Delete

# Returns all the reviews
@reviews_routes.route('/')
def all_reviews():
    response = [review.to_dict() for review in Review.query.all()]
    # return {"services": response}
    # response = Service.query.all()
    return {"reviews": response}

# # Returns one review by id
# @reviews_routes.route('/<int:id>')
# def one_review(id):
#     response = Service.query.get(id)
#     # response = Service.query.get_or_404(id)
#     # return {"service": response}  Is it like this?
#     return jsonify(response) # Or json.dumps()?

# Creates one review
@reviews_routes.route('/new', methods=["POST"])
def create_review():
    form = ReviewForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    print('***form***', form.data)
    if form.validate_on_submit():
        image = form.data['review_image']

        print('*** Image Result ***', type(image))

        image_filename = secure_filename(image.filename)
        unique_filename = get_unique_filename(image_filename)
        image.filename = unique_filename

        # Upload the file content to S3
        upload = upload_file_to_s3(image)

        print('*** S3 Upload Result ***', upload)

        if "url" not in upload:
            return "URL NOT IN UPLOAD"
        
        url = upload['url']

        print('**************************', url)

        review = Review(
            user_id=current_user.id,
            service_id=form.data['service_id'],
            review=form.data['review'],
            review_image=url,
            star_rating=form.data['star_rating']
        )
        db.session.add(review)
        db.session.commit()
        return review.to_dict(), 201
    else:
        return {"Errors": form.errors}

@reviews_routes.route('/update/<int:id>', methods=["PUT"])
def update_review(id):
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Parse the FormData manually
        service_id = int(request.form['service_id'])
        review = request.form['review']
        star_rating = int(request.form['star_rating'])
        review_image = request.files['review_image'] if 'review_image' in request.files else None

        review_to_update = Review.query.get(id)
        review_to_update.review = review
        review_to_update.star_rating = star_rating

        if review_image:
            # Handle the review_image
            image_filename = secure_filename(review_image.filename)
            unique_filename = get_unique_filename(image_filename)
            review_image.filename = unique_filename

            upload = upload_file_to_s3(review_image)

            if "url" not in upload:
                return "URL not in upload"

            url = upload['url']
            review_to_update.review_image = url

        db.session.commit()
        return review_to_update.to_dict(), 201
    else:
        return {"Errors": form.errors}


@reviews_routes.route('/user', methods=['GET'])
def user_reviews():
    response = [review.to_dict() for review in Review.query.filter(Review.user_id == current_user.id)]
    print("response", response)
    return {"reviews": response}

# Delete one review
@reviews_routes.route('/delete/<int:id>', methods=["DELETE"])
def delete_review(id):
    deleted_review = Review.query.get(id)
    # !!! Do we need to delete anything else?
    if deleted_review:
        db.session.delete(deleted_review)
        db.session.commit()
        return "successful delete"
    else:
        return "error"
    # return redirect('/services')
    # Redirection is done on frontend, this route just deletes from database
