#!/bin/bash

parallel -u ::: './run_backend.sh' './run_frontend.sh' 'xdg-open http://localhost:4200'
