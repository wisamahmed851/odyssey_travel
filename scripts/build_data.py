"""Build src/data/places.json and public/places/** from data/ and scraper/ (run: npm run data)."""
import json, glob, os, re
from PIL import Image
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(R, 'data'); S = os.path.join(R, 'scraper', 'places.txt')
# scraped Wikipedia matches that describe a different subject (a Guru, a city, a movement) or duplicate another place
SKIP = {'gurdwara-rori-sahib', 'gurdwara-guru-ram-das-ji', 'gurdwara-chhevin-patshahi-sri-guru-hargobind-sahib', 'baoli-sahib-sri-guru-amar-das',
        'gurdwara-baoli-sahib-guru-arjan-dev-ji', 'gurdwara-sach-khand-sahib', 'gurdwara-sri-guru-nanak-sat-sang-sabha', 'gurdwara-dipalpur'}
slug = lambda n: re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', n.lower())).strip('-')
NONLATIN = re.compile(r'\s*\([^()]*[^\x00-ɏ][^()]*\)')  # bracketed Gurmukhi / Urdu / IPA


def clean(t):
    t = re.sub(r'=+[^=]+=+', '', t or '')
    t = NONLATIN.sub('', t)
    t = re.sub(r'\s*\([^()]*:\s*\)', '', t)
    t = re.sub(r'\(\s*[,;]?\s*\)', '', t)
    return ' '.join(t.split())


def cut(t, n):
    t = clean(t)
    if len(t) <= n:
        return t
    s = t[:n]
    i = max(s.rfind('. '), s.rfind('! '))
    return s[:i + 1] if i > n * .5 else s.rsplit(' ', 1)[0] + '…'


def kind(n):
    if re.search(r'Samadhi|Baoli|Awa|Khooh|Diwan Khana|Nank Garh|Ber$', n):
        return 'Historical sites'
    if re.search(r'Sat Sang|Halani', n):
        return 'Community places'
    return 'Gurdwaras'


data = {}
for f in glob.glob(D + '/places/*.json'):
    d = json.load(open(f, encoding='utf-8'))
    data[d['slug']] = d
out = []
for line in open(S, encoding='utf-8'):
    if not line.strip():
        continue
    n, city, prov, area = line.strip().split('|')[:4]
    s = slug(n)
    p = dict(slug=s, name=n, city=city, province=prov, area=area.replace(' city', '') if area.endswith(' city') else area, type=kind(n), rich=False, summary='', history=[], coords=None, images=[])
    d = data.get(s)
    if d and s not in SKIP and d.get('summary'):
        p['rich'] = True
        p['summary'] = cut(d['summary'], 460)
        p['history'] = [dict(heading=h['heading'], text=cut(h['text'], 700)) for h in d['history'][:5] if clean(h['text'])]
        p['coords'] = d.get('coordinates')
        p['wiki'] = d.get('wikipedia_url')
        for i in d['images']:
            src = os.path.join(D, i['file'])
            if not os.path.exists(src):
                continue
            name = os.path.basename(src)
            dst = f'{R}/public/places/{s}/{name}'
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            im = Image.open(src).convert('RGB')
            w, h = im.size
            if w > 1600:
                im = im.resize((1600, int(h * 1600 / w)), Image.LANCZOS)
            im.save(dst, 'JPEG', quality=78, optimize=True, progressive=True)
            p['images'].append(dict(src=f'/places/{s}/{name}', w=im.size[0], h=im.size[1], alt=cut(i.get('caption') or n, 110) or n, author=clean(i.get('author')), license=i.get('license', ''), page=i.get('page', '')))
    out.append(p)
json.dump(out, open(R + '/src/data/places.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'places;', sum(p['rich'] for p in out), 'with details;', sum(len(p['images']) for p in out), 'images')
