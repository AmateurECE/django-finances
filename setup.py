import setuptools

with open('README.md', 'r') as fh:
    long_description = fh.read()

setuptools.setup(
    name='django-finances',
    version='1.0',
    author='Ethan D. Twardy',
    author_email='ethan.twardy@gmail.com',
    description='Django application for tracking personal finances',
    long_description=long_description,
    long_description_content_type='text/markdown',
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3.5+",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.5',
    install_requires=['django', 'djangorestframework'],
    provides=['django_finances'],
    include_package_data=True,
)
