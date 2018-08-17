import sys
import spacy
from spacy.attrs import LOWER, POS, ENT_TYPE, IS_ALPHA

text = u'IBM built the first artifical intelligence system called WATSON.'
print(text)

nlp = spacy.load('en_core_web_sm')
doc = nlp(text)

for token in doc:
    print(token.text, token.dep_, token.head.text, token.head.pos_,
          [child for child in token.children])

for ent in doc.ents:
    print(ent.text, ent.start_char, ent.end_char, ent.label_)

#np_array = doc.to_array([LOWER, POS, ENT_TYPE, IS_ALPHA])
#print(np_array)
