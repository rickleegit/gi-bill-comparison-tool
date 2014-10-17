import json
import os
import os.path

def index(args, dirname, fnames):
    index, attrs = args
    for f in fnames:
        f = os.path.join(dirname, f)
        if f.endswith('.json') and os.path.isfile(f):
            try:
                j = json.load(file(f))
                for attr in attrs:
                    index.setdefault(attr, {}).setdefault(j[attr], []).append(j["facility_code"])
                    #typeindex.setdefault(j[attr], []).append(j["facility_code"])
            except:
                print f

attrindexes = {}
os.path.walk('.', index, (attrindexes, ("type", "state", "country")))

for attr in attrindexes:
    dirname = "filters/{}".format(attr)
    if not os.path.isdir(dirname):
        os.mkdir(dirname)
    for typ, codes in attrindexes[attr].iteritems():
        json.dump(codes, file("filters/{}/{}.json".format(attr, typ), 'w'))
