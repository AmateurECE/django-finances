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
# LAST EDITED:      12/30/2020
###

read -r -d '' USAGE <<EOF
Usage: packageScripts.sh <command>

Commands:
  package                Run the full packaging procedure and upload the wheels
                         archive to the PyPI server
  buildSpa               Build the SPA and copy the build artifacts to the
                         Django app (executed by 'package' command)
  testServer             Spin up a test server using the django test server and
                         the Nginx docker image. With --fixture, uses the test
                         fixture fixtures/empty.json.bz2.
  initializeSandbox      Initialize a Django Project that can provide a sandbox
                         for testing the application
  reapplyMigrations      Un-apply, regenerate, and re-apply migrations for the
                         django-finances application. Requires a sandbox in the
                         repository. Wipes all data currently in the database,
                         so be sure it's backed up in another form (e.g. JSON)
  runTests               Run the tests for the React/Django applications
  createTestFixture      Create a Test Fixture from the current database for
                         testing.
EOF

usage() {
    printf '%s\n' "$USAGE"
}

package() {
    # TODO: Check package to make sure no unnecessary files exist
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

testServer() {
    rootDirectory=$(realpath .)/static
    confFile=$(realpath .)/development-site.conf
    docker run -d --rm --name finances -p "8080:80" \
	   --network nginx-net \
	   -v "$rootDirectory:/var/www:ro" \
	   -v "$confFile:/etc/nginx/conf.d/default.conf:ro" \
	   -v "`realpath .`/log:/var/log/nginx" \
	   nginx:latest

    trap "docker stop finances" EXIT
    echo 'Y' > sandbox/config/logging
    if [[ ! -z "$1" && "$1" = "--fixture" ]]; then
        python3 manage.py testserver fixtures/empty.json.bz2
    else
        python3 manage.py runserver
    fi
}

initializeSandbox() {
    # TODO: initializeSandbox
    >&2 printf '%s\n' "Unimplemented method: initializeSandbox"
    # Create the sandbox application
    # Add the installed apps
    # Add auth setting logic to sandbox/settings.py
}

reapplyMigrations() {
    python3 manage.py migrate zero
    rm -rf finances/migrations
    python3 manage.py makemigrations finances
    python3 manage.py migrate
}

runTests() {
    # TODO: Run Django application tests

    # Start the django test server with auth and logging disabled
    echo 'N' > sandbox/config/logging
    python3 manage.py testserver fixtures/empty.json.bz2 &
    django=$!

    # Run npm tests
    cd finances-spa && npm run test
    kill $django
}

createTestFixture() {
    python3 manage.py dumpdata --natural-foreign --natural-primary \
             --format=json | bzip2 -c > fixtures/$1.json.bz2
}

if [[ ! -d 'finances-spa' || ! -d 'sandbox' ]]; then
    >&2 printf '%s\n' "This script must be run from the project root directory"
fi

command=$1
shift
case $command in
    package)
        package
        ;;
    buildSpa)
        buildSpa
        ;;
    testServer)
        testServer $@
        ;;
    initializeSandbox)
        initializeSandbox
        ;;
    reapplyMigrations)
        reapplyMigrations
        ;;
    runTests)
        runTests
        ;;
    createTestFixture)
        createTestFixture $@
        ;;
    *)
        usage
        ;;
esac

###############################################################################
