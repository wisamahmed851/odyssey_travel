"""Local SEO/GEO/AEO checker for the running site: python scripts/audit.py [base]"""
import sys, re, json, urllib.request, html as H
B = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3100').rstrip('/')
get = lambda u: urllib.request.urlopen(B + u).read().decode('utf-8', 'replace')
sm = get('/sitemap.xml'); urls = [re.sub(r'^https?://[^/]+', '', u) or '/' for u in re.findall(r'<loc>([^<]+)</loc>', sm)]
extra = ['/places/gurdwara-tambo-sahib']
issues = []
def add(p, m): issues.append(f'{p}: {m}')
for u in urls + extra:
    h = get(u); text = re.sub(r'<(script|style)[\s\S]*?</\1>', '', h); body = H.unescape(re.sub(r'<[^>]+>', ' ', text.split('<body')[-1])); words = len(body.split())
    t = (re.search(r'<title>([^<]*)', h) or [0, ''])[1]; d = (re.search(r'<meta name="description" content="([^"]*)', h) or [0, ''])[1]
    if not 25 <= len(t) <= 65: add(u, f'title length {len(t)}: {t}')
    if not 110 <= len(d) <= 165: add(u, f'description length {len(d)}')
    h1 = len(re.findall(r'<h1[ >]', h))
    if h1 != 1: add(u, f'{h1} h1 tags')
    if '<link rel="canonical"' not in h: add(u, 'no canonical')
    for k in ('og:title', 'og:description', 'og:image', 'twitter:card'):
        if k not in h: add(u, 'missing ' + k)
    imgs = re.findall(r'<img[^>]*>', h); noalt = [i for i in imgs if ' alt=""' in i and 'aria-hidden' not in i]
    if len(noalt) > 1: add(u, f'{len(noalt)} images with empty alt')
    for j in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', h):
        try: json.loads(j)
        except Exception as e: add(u, 'bad JSON-LD ' + str(e))
    lds = ' '.join(re.findall(r'"@type":"([^"]+)"', h))
    print(f'{u:60} words={words:5} jsonld=[{lds}] imgs={len(imgs)} lang={"lang=" in h}')
    if words < 250 and 'noindex' not in h: add(u, f'thin content ({words} words) and indexable')
print('\n'.join(issues) or 'NO ISSUES')
print('robots:', get('/robots.txt').replace('\n', ' | ')); print('llms.txt', len(get('/llms.txt')))
