#/bin/bash

parallel -u ::: './run_backend.sh' './run_frontend.sh'
