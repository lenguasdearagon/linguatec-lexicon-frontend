"""
Unit tests.
"""

import unittest

from unittest import mock

from linguatec_lexicon_frontend.templatetags import linguatec
from linguatec_lexicon_frontend.utils import is_regular_verb


class RenderEntryTestCase(unittest.TestCase):
    @mock.patch('linguatec_lexicon_frontend.utils.retrieve_gramcats')
    def test_render(self, retrieve_gramcats):
        retrieve_gramcats.return_value = []
        entry = {}
        entry['id'] = 1
        entry['translation'] = "boira (lorem ipsum)"
        entry['marked_translation'] = "<trans lex=ar-es>boira</trans> (lorem ipsum)"
        html = linguatec.render_entry(entry)
        self.assertIn("<span class='rg-usecase-comment'>(lorem ipsum)</span>", html)
        self.assertIn("<span id='word_1'><a href='/search/?q=boira&l=ar-es'>boira</a> </span>", html)

    @mock.patch('linguatec_lexicon_frontend.utils.retrieve_gramcats')
    def test_render_begin(self, retrieve_gramcats):
        retrieve_gramcats.return_value = []
        entry = {}
        entry['id'] = 1
        entry['translation'] = "(foo) boira grasa"
        entry['marked_translation'] = "(foo) <trans lex=ar-es>boira</trans> <trans lex=ar-es>grasa</trans>"
        html = linguatec.render_entry(entry)
        self.assertIn("<span class='rg-usecase-comment'>(foo)</span>", html)
        self.assertIn(
            "<span id='word_1'> <a href='/search/?q=boira&l=ar-es'>boira</a> "
            "<a href='/search/?q=grasa&l=ar-es'>grasa</a></span>",
            html
        )

    def test_render_unbalanced_parenthesis(self):
        entry = {}
        entry['id'] = 1
        entry['translation'] = "(foo)) invalid"
        entry['marked_translation'] = None
        html = linguatec.render_entry(entry)
        self.assertEqual("<span id='word_1'>(foo)) invalid</span>", html)


class IsRegularVerbTestCase(unittest.TestCase):
    def test_suffix_ar(self):
        word = {
            "gramcats": ["v."],
            "term": "chugar",
        }
        self.assertTrue(is_regular_verb(word))

    def test_suffix_pronominoadv(self):
        word = {
            "gramcats": ["v. prnl."],
            "term": "fer-se-ne",
        }
        self.assertTrue(is_regular_verb(word))

    def test_not_verb(self):
        word = {
            "gramcats": ["s."],
            "term": "mercader",
        }
        self.assertFalse(is_regular_verb(word))
