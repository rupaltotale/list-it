# To-do-list-webapp
Django REST API with React frontend

## Changing Database?

- Run `./reset.sh`

If you get weird errors:
- Delete database: `rm db.sqlite3`
- Delete migration:  `cd leads && rm -rf migrations`
- Resync database: `python3 manage.py syncdb`
- Rerun migrations and start server: `./reset.sh`

(TODO: Make script for above)

## Helpful Resources
- [Tutorial: Django REST with React](#https://www.valentinog.com/blog/drf/)
- [The Ultimate Tutorial for Django REST Framework](https://sunscrapers.com/blog/ultimate-tutorial-django-rest-framework-part-1/)
- [Django & React: JWT Authentication](https://medium.com/@dakota.lillie/django-react-jwt-authentication-5015ee00ef9a)
- [Django courses on LinkedIn Learning](https://www.linkedin.com/learning/instructors/rudolf-olah?u=2121556)
- [JSON Web Token Authentication support for Django REST Framework](https://jpadilla.github.io/django-rest-framework-jwt/)