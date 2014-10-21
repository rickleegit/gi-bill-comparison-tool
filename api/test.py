import json
import os
import os.path
import re


#def walk(fn):
#    for dir in (d for d in os.listdir('.') if len(d) == 3):
#        for f in (f for f in os.listdir("./{}".format(dir)) if f.endswith("json")):
#            fn(json.load(file("./{}/{}".format(dir, f))))

def index(args, dirname, fnames):
    index, attrs = args
    for f in fnames:
        if f in ["filters", "institutions.json"]: continue

        f = os.path.join(dirname, f)
        if f.endswith('.json') and os.path.isfile(f):
            try:
                j = json.load(file(f))
                for attr in attrs:
                    index.setdefault(attr, {}).setdefault(j[attr], {})[j["facility_code"]] = None
                    #typeindex.setdefault(j[attr], []).append(j["facility_code"])
            except:
                print f

def norm(string):
    return re.sub("\W", "", string).lower()

attrindexes = {}
os.path.walk('.', index, (attrindexes, ("type", "state", "country")))

for attr in attrindexes:
    dirname = "filters/{}".format(attr)
    if not os.path.isdir(dirname):
        os.mkdir(dirname)
    for typ, codes in attrindexes[attr].iteritems():
        if typ is None:
            typ = "null"
        json.dump(codes, file("filters/{}/{}.json".format(attr, norm(typ)), 'w'))
