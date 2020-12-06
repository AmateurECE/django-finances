#!/bin/sh
###############################################################################
# NAME:             packageScripts.sh
#
# AUTHOR:           Ethan D. Twardy <edtwardy@mtu.edu>
#
# DESCRIPTION:      Some tools to ease the packaging and building process.
#
# CREATED:          11/28/2020
#
# LAST EDITED:      12/05/2020
###

read -r -d '' USAGE <<EOF
Usage: packageScripts.sh <command>

Commands:
  package                Run the full packaging procedure and upload the wheels
                         archive to the PyPI server
  buildSpa               Build the SPA and copy the build artifacts to the
                         Django app (executed by 'package' command)
  testServer             Spin up a test server using the django test server and
                         the Nginx docker image
EOF

usage() {
    printf '%s\n' "$USAGE"
}

package() {
    python3 setup.py sdist

    printf '%s\n  %s\n    %s\n' "<!doctype html>" "<html>" "<body>" >index.html
    for file in `find dist django_finances.egg-info -type f`; do
        printf '      <a href="%s">%s</a>\n' $file $file >>index.html
    done
    printf '  %s\n%s\n' "</body>" "</html>" >>index.html

    directory=/var/www/edtwardy.hopto.org/pypi/django-finances/
    rsync -e 'ssh -p 5000' -rv --delete dist django_finances.egg-info \
          index.html edtwardy@edtwardy.hopto.org:$directory
}

buildSpa() {
    cd finances-spa && npm run build
    # TODO: Copy build artifacts to development server
}

killTestServers() {
    kill $1
    kill $2
    docker stop finances
}

testServer() {
    rootDirectory=$(realpath .)/static
    confFile=$(realpath .)/development-site.conf
    docker run -d --rm --name finances -p "8080:80" \
	   --network nginx-net \
	   -v "$rootDirectory:/var/www:ro" \
	   -v "$confFile:/etc/nginx/conf.d/default.conf:ro" \
	   -v "`realpath .`/log:/var/log/nginx" \
	   nginx:latest
    python3 manage.py runserver &
    react=$!
    $(cd finances-spa && npm run start) &
    django=$!
    trap "killTestServers $django $react" EXIT
    wait
}

case $1 in
    package)
        package
        ;;
    buildSpa)
        buildSpa
        ;;
    testServer)
        testServer
        ;;
    *)
        usage
        ;;
esac

###############################################################################
