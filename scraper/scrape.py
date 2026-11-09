"""Scrape place details/history/images from Wikipedia + Wikimedia Commons (free-licensed).
Output: data/places/<slug>.json, data/images/<slug>/NN.jpg, data/places.json (index)
Run: python scrape.py            (all)   |  python scrape.py "Gurdwara Janam Asthan"  (one)
"""
import json, os, re, sys, time
import requests

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
S = requests.Session()
S.headers["User-Agent"] = "OdysseyTravelBot/1.0 (educational travel site; contact via GitHub wisamahmed851/odyssey_travel)"
API = "https://en.wikipedia.org/w/api.php"
COMMONS = API  # commons.wikimedia.org is unreachable here; en.wikipedia API serves shared-repo file info
MAX_IMG = 6
BAD = re.compile(r"(logo|flag|icon|map|symbol|khanda|commons-logo|wikidata|seal|coat|locator|edit-|ambox|question)", re.I)


def get(url, **p):
    p["format"] = "json"
    for i in range(8):
        time.sleep(1.5)
        try:
            r = S.get(url, params=p, timeout=30)
        except requests.ConnectionError:
            time.sleep(3 * (i + 1)); continue
        if r.status_code == 429:
            time.sleep(15 * (i + 1)); continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError("rate limited")


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def search_wiki(name, city):
    qs = [f"{name} {city}", name, f'{name.replace("Gurdwara ", "")} gurdwara {city}']
    for q in qs:
        hits = get(API, action="query", list="search", srsearch=q, srlimit=5)["query"]["search"]
        for h in hits:
            t = h["title"]
            # require some token overlap with the name, avoid unrelated pages
            toks = [w for w in re.findall(r"[a-z]+", name.lower()) if w not in ("gurdwara", "sahib", "sri", "of", "da", "di", "the")]
            if any(w in t.lower() for w in toks) or "gurdwara" in t.lower() and city.lower() in (t + h.get("snippet", "")).lower():
                return t
    return None


def page_data(title):
    d = get(API, action="query", titles=title, redirects=1, prop="extracts|coordinates|pageprops|info|images|pageimages",
            explaintext=1, exsectionformat="wiki", inprop="url", imlimit=60, piprop="original", colimit=1)
    pg = next(iter(d["query"]["pages"].values()))
    return pg


def sections(text):
    parts = re.split(r"\n\n\n== (.+?) ==\n", "\n\n\n" + text)
    intro = parts[0].strip()
    secs = [{"heading": parts[i].strip(), "text": parts[i + 1].strip()} for i in range(1, len(parts) - 1, 2)]
    secs = [s for s in secs if s["text"] and s["heading"].lower() not in ("references", "external links", "see also", "notes", "further reading", "gallery", "bibliography")]
    return intro, secs


def image_infos(files):
    out = []
    for i in range(0, len(files), 40):
        d = get(COMMONS, action="query", titles="|".join(files[i:i + 40]), prop="imageinfo",
                iiprop="url|extmetadata|size|mime", iiurlwidth=1400)
        for pg in d.get("query", {}).get("pages", {}).values():
            ii = (pg.get("imageinfo") or [None])[0]
            if not ii or ii.get("mime") not in ("image/jpeg", "image/png"):
                continue
            if ii["width"] < 600:
                continue
            m = ii.get("extmetadata", {})
            strip = lambda k: re.sub(r"<[^>]+>", "", m.get(k, {}).get("value", "")).strip()
            out.append({"title": pg["title"], "url": ii.get("thumburl") or ii["url"], "page": ii["descriptionurl"],
                        "width": ii["width"], "height": ii["height"], "license": strip("LicenseShortName"),
                        "author": strip("Artist"), "caption": strip("ImageDescription")[:300]})
    return out


def commons_search(q):
    d = get(API, action="query", list="search", srsearch=q, srnamespace=6, srlimit=15)  # local+shared files
    return [h["title"] for h in d["query"]["search"]]


def download(url, path):
    for i in range(8):
        time.sleep(2)
        try:
            r = S.get(url, timeout=60)
        except requests.ConnectionError:
            time.sleep(10 * (i + 1)); continue
        if r.status_code == 429:
            time.sleep(15 * (i + 1)); continue
        r.raise_for_status()
        open(path, "wb").write(r.content)
        return True
    return False


def scrape(line):
    name, city, prov, area = line.split("|")
    slug = slugify(name)
    rec = {"name": name, "slug": slug, "city": city, "province": prov, "area": area, "country": "Pakistan",
           "wikipedia_title": None, "wikipedia_url": None, "summary": "", "history": [], "coordinates": None,
           "images": [], "sources": []}
    title = search_wiki(name, city)
    files = []
    if title:
        pg = page_data(title)
        rec["wikipedia_title"] = pg.get("title")
        rec["wikipedia_url"] = pg.get("fullurl")
        rec["sources"].append(pg.get("fullurl"))
        intro, secs = sections(pg.get("extract", ""))
        rec["summary"], rec["history"] = intro, secs
        if pg.get("coordinates"):
            c = pg["coordinates"][0]; rec["coordinates"] = {"lat": c["lat"], "lng": c["lon"]}
        files = [i["title"] for i in pg.get("images", []) if not BAD.search(i["title"]) and i["title"].lower().endswith((".jpg", ".jpeg", ".png"))]
    # top up from Commons search
    if len(files) < MAX_IMG:
        for q in (name, f"{name} {city}"):
            for t in commons_search(q):
                if t not in files and not BAD.search(t) and t.lower().endswith((".jpg", ".jpeg", ".png")):
                    files.append(t)
    infos = image_infos(files[:30])
    d = os.path.join(ROOT, "images", slug); os.makedirs(d, exist_ok=True)
    for n, inf in enumerate(infos[:MAX_IMG], 1):
        ext = ".png" if inf["url"].lower().endswith(".png") else ".jpg"
        rel = f"images/{slug}/{n:02d}{ext}"
        if download(inf["url"], os.path.join(ROOT, rel)):
            inf["file"] = rel; rec["images"].append(inf)
        time.sleep(0.5)
    os.makedirs(os.path.join(ROOT, "places"), exist_ok=True)
    json.dump(rec, open(os.path.join(ROOT, "places", slug + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    return rec


if __name__ == "__main__":
    lines = [l.strip() for l in open(os.path.join(os.path.dirname(__file__), "places.txt"), encoding="utf-8") if l.strip()]
    if len(sys.argv) > 1:
        lines = [l for l in lines if l.split("|")[0] in sys.argv[1:]]
    index = []
    os.makedirs(ROOT, exist_ok=True)
    for l in lines:
        sl = slugify(l.split("|")[0])
        if os.path.exists(os.path.join(ROOT, "places", sl + ".json")) and len(sys.argv) == 1:
            print("skip", sl); index.append({"slug": sl}); continue
        try:
            r = scrape(l)
        except Exception as e:
            print("FAIL", l.split("|")[0], e); continue
        print(f"{r['name'][:45]:45} wiki={r['wikipedia_title']!s:40} sum={len(r['summary']):5} secs={len(r['history'])} imgs={len(r['images'])}")
        index.append({k: r[k] for k in ("name", "slug", "city", "province", "wikipedia_title")})
    if len(sys.argv) == 1:
        json.dump(index, open(os.path.join(ROOT, "places.json"), "w", encoding="utf-8"), indent=2)
