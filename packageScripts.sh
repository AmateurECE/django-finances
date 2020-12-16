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
# LAST EDITED:      12/15/2020
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

    # Enable auth for the test server
    echo 'Y' > sandbox/config/auth
    python3 manage.py runserver &
    django=$!
    $(cd finances-spa && npm run start) &
    react=$!
    trap "killTestServers $django $react" EXIT
    wait
}

initializeSandbox() {
    # TODO: initializeSandbox
    >&2 printf '%s\n' "Unimplemented method: initializeSandbox"
    # Create the sandbox application
    # Add the installed apps
    # Add auth setting logic to sandbox/settings.py
}

reapplyMigrations() {
    # TODO: reapplyMigrations
    >&2 printf '%s\n' "Unimplemented method: reapplyMigrations"
}

runTests() {
    # TODO: Run Django application tests

    # Start the django test server with auth and logging disabled
    echo 'N' > sandbox/config/auth
    echo 'N' > sandbox/config/logging
    python3 manage.py testserver fixtures/empty.json &
    django=$!

    # Run npm tests
    cd finances-spa && npm run test
    kill $django
}

createTestFixture() {
    python3 manage.py dumpdata --natural-foreign --natural-primary \
             --format=json | bzip2 -c > $1
}

if [[ ! -d 'finances-spa' || ! -d 'sandbox' ]]; then
    >&2 printf '%s\n' "This script must be run from the project root directory"
fi

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
        createTestFixture $2
        ;;
    *)
        usage
        ;;
esac

###############################################################################
