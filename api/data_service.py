from api.app import models, db, bcrypt
from flask_jwt_extended import create_access_token


def addUser(request):
    try:
        passwordHash = bcrypt.generate_password_hash(request.get('password'), 8)
        user = models.User(request.get('email'), passwordHash)
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)
        if user.id:
            print(user.id)
            return True
        else:
            return False
    except Exception as e:
        print('Error occured during registration: ' + e)
        return False


def loginUser(request):
    result = {
        'success': False,
        'token': ''
    }
    try:
        user = models.User.query.filter_by(email=request.get('username')).first()
        if user:
            authenticated = bcrypt.check_password_hash(user.password, request.get('password'))
            if authenticated:
                print(user)
                result['success'] = True
                result['token'] = create_access_token(identity=user.email)
        return result
    except Exception as e:
        print('Error during user login: ' + e)
        return result
