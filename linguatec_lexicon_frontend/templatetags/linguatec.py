"""
Templatetags helpers to render lexicon content.
"""
import coreapi
import re
import urllib.parse

from django import template
from django.conf import settings
from django.core.exceptions import ValidationError
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

from linguatec_lexicon_frontend import utils, validators


register = template.Library()


@register.filter
def render_entry(entry):
    """Parse entry content to apply weight to content."""
    value = entry.get('marked_translation') or entry['translation']

    # [readspeaker] wrap & identify entry to be read
    value = "<span id='word_" + str(entry['id']) + "'>" + value + "</span>"

    try:
        validators.validate_balanced_parenthesis(value)
    except ValidationError:
        return value

    # mark content in parenthesis & skip it to be read by readspeaker
    value = value.replace("(", "<span class='rg-usecase-comment rs_skip'>(")
    value = value.replace(")", ")</span>")

    # mark keywords (inline gramcat)
    for gramcat in utils.retrieve_gramcats():
        abbr, title = gramcat['abbreviation'], gramcat['title']
        value = value.replace(
            abbr, "<span class='rg-gramcat' title='{0}'>{1}</span>".format(title, abbr))

    # Replace <trans> mark with links to wrapped words
    value = re.sub(r'<trans lex=([a-z]{2}-[a-z]{2})>(\b\S+\b)</trans>', build_link, value)

    return mark_safe(value)


def build_link(matchobj):
    return "<a class='{class}' href='/search/?q={word}&l={lexicon}'>{word}</a>".format_map({
        'class': "rg-linked-word",
        'lexicon': matchobj.group(1),
        'word': matchobj.group(2),
    })


# TODO unused???
@register.filter
@stringfilter
def verbose_gramcat(value):
    """Attach description to gramatical category abbreviature."""
    api_url = settings.LINGUATEC_LEXICON_API_URL
    client = coreapi.Client()
    schema = client.get(api_url)
    querystring_args = {'abbr': value}
    url = urllib.parse.urljoin(
        schema['gramcats'], 'show/?' + urllib.parse.urlencode(querystring_args))
    gramcat = client.get(url)

    return "{} ({})".format(gramcat['title'], gramcat['abbreviation'])
