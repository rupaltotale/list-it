echo "making migrations"
python3 manage.py makemigrations
echo "migrating"
python3 manage.py migrate
echo "running server"
python3 manage.py runserver
