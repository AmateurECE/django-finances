#!/bin/sh

python3 setup.py sdist

cat - >index.html <<EOF
<!doctype html>
  <html>
    <body>
EOF

for file in `find dist django_index.egg-info -type f`; do
    printf '      <a href="%s">%s</a>\n' $file $file >> index.html
done

cat - >>index.html <<EOF
  </body>
</html>
EOF

directory=/var/www/edtwardy.hopto.org/pypi/django-finances/
rsync -e 'ssh -p 5000' -rv --delete dist django_index.egg-info index.html \
      edtwardy@edtwardy.hopto.org:$directory
