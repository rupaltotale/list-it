# To-do-list-webapp
Django REST API with React frontend

## Changing Database?

- Run `./reset.sh`

A more fullproof procedure if you get weird errors:
- Delete database: `rm db.sqlite3`
- Delete migrations:  
  - `cd leads && rm -rf migrations __pycache__`
  - `cd leads && rm -rf django_react __pycache__`
  - `cd leads && rm -rf frontend __pycache__`
- Rerun migrations and start server: `./reset.sh`
- (Optional) Create super user: `python3 manage.py createsuperuser --email <rupaltotale@gmail.com> --username <username>`
(TODO: Make script for above)

## Helpful Resources
- [Tutorial: Django REST with React](#https://www.valentinog.com/blog/drf/)
- [The Ultimate Tutorial for Django REST Framework](https://sunscrapers.com/blog/ultimate-tutorial-django-rest-framework-part-1/)
- [Django & React: JWT Authentication](https://medium.com/@dakota.lillie/django-react-jwt-authentication-5015ee00ef9a)
- [Django courses on LinkedIn Learning](https://www.linkedin.com/learning/instructors/rudolf-olah?u=2121556)
- [JSON Web Token Authentication support for Django REST Framework](https://jpadilla.github.io/django-rest-framework-jwt/)