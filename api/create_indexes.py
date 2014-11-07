import json
import os
import os.path
import re

# Just a handy function for testing things in the interpreter. Pass it a function
# and this function will pass each api json object to it
#def walk(fn):
#    for dir in (d for d in os.listdir('.') if len(d) == 3):
#        for f in (f for f in os.listdir("./{}".format(dir)) if f.endswith("json")):
#            fn(json.load(file("./{}/{}".format(dir, f))))

def rem(lst, name):
    try:
        lst.remove(name)
    except ValueError: pass

def index(args, dirname, fnames):
    index, attrs = args

    rem(fnames, "filters")
    rem(fnames, "institutions.json")

    for f in fnames:
        f = os.path.join(dirname, f)
        if f.endswith('.json') and os.path.isfile(f):
            try:
                j = json.load(file(f))
                for attr in attrs:
                    index.setdefault(attr, {}).setdefault(j[attr], {})[j["facility_code"]] = None
                # anything that's not ojt also gets added to "school"
                if j["type"].lower() != "ojt":
                    index.setdefault("type", {}).setdefault("school", {})[j["facility_code"]] = None
            except:
                print "Exception reading file {}".format(f)
                raise

def norm(string):
    if string is None:  string = "null"
    if string is True:  string = "true"
    if string is False: string = "false"

    try:
        return re.sub("\W", "", string).lower()
    except TypeError:
        print string
        raise

attrindexes = {}
os.path.walk('.', index, (attrindexes, ("type", "state", "country", "poe", "yr", "student_veteran", "eight_keys", "accreditation_type")))

for attr in attrindexes:
    dirname = "filters/{}".format(attr)
    if not os.path.isdir(dirname):
        os.mkdir(dirname)
    for typ, codes in attrindexes[attr].iteritems():
        fname = "filters/{}/{}.json".format(attr, norm(typ))
        json.dump(codes, file(fname, 'w'))
