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
        html = linguatec.render_entry(entry)
        self.assertIn("<span class='rg-usecase-comment'>(lorem ipsum)</span>", html)
        self.assertIn("<span id='word_1'>boira </span>", html)

    @mock.patch('linguatec_lexicon_frontend.utils.retrieve_gramcats')
    def test_render_begin(self, retrieve_gramcats):
        retrieve_gramcats.return_value = []
        entry = {}
        entry['id'] = 1
        entry['translation'] = "(foo) boira grasa"
        html = linguatec.render_entry(entry)
        self.assertIn("<span class='rg-usecase-comment'>(foo)</span>", html)
        self.assertIn("<span id='word_1'> boira grasa</span>", html)

    def test_render_unbalanced_parenthesis(self):
        entry = {}
        entry['id'] = 1
        entry['translation'] = "(foo)) invalid"
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
