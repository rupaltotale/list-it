#!/bin/bash
rm db.sqlite3
rm -rf leads/migrations leads/__pycache__
rm -rf django_react/migrations django_react/__pycache__
rm -rf frontend/migrations frontend/__pycache__
./reset.sh