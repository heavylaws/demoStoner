#!/bin/bash
cd backend
flask db migrate -m "Initial migration."
