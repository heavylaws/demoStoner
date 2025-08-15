import unittest
from app import app, db, Patient

class AppTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_create_patient(self):
        response = self.app.post('/patients', json={
            'name': 'Test Patient',
            'dob': '2000-01-01',
            'address': '123 Test St',
            'phone': '555-5555',
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'New patient created.')

if __name__ == '__main__':
    unittest.main()
