# linguatec lexicon frontend
Frontend website based Django.

## Development
``TODO``

### Run tests
The tests included are build using Python [unittest](https://docs.python.org/3/library/unittest.html) library.
To run it just execute:
```bash
python -m unittest -v linguatec_lexicon_frontend.tests
```

## Deployment

```
django-admin startproject frontend

```

Update settings to include app as installed and set URL of the linguatec lexicon API:
```
# settings.py
INSTALLED_APPS = [
    ...
    'linguatec_lexicon_frontend',
]

STATIC_ROOT = '/home/linguatec/frontend/static/'

# Linguatec lexicon backend API URL
LINGUATEC_LEXICON_API_URL = 'https://api.example.org/'

```

Update `urls.py`
```
# urls.py
urlpatterns = [
    ...
    path('', include('linguatec_lexicon_frontend.urls')),
]
```

### Using Font Awesome PRO (self hosted)

If you have a license of the PRO version you could use it following the next steps:
1. Enable PRO version adding updating settings:
    ```python
    LINGUATEC_FONTAWESOME_PRO = True
    ```

2. Copy FontAwesome files to your project static dir (e.g. `myproject/static/`)
    ```
    $ ls myproject/static/fontawesome/
    css  js  svgs  webfonts
    ```
3. Add this dir to `STATICFILES_DIRS`:
    ```python
    STATICFILES_DIRS = [
        os.path.join(BASE_DIR, "static"),
    ]
    ```
