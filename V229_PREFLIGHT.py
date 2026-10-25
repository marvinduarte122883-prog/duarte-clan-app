#!/usr/bin/env python3
"""Duarte Clan read-only release preflight; standard library only."""
from pathlib import Path
import argparse, json, re, urllib.request, urllib.error, sys
from html.parser import HTMLParser
p=argparse.ArgumentParser(description='Check V229 Duarte Clan preview safely')
p.add_argument('--site',help='Cloudflare preview URL (optional); only GET public static resources')
a=p.parse_args()
root=Path(__file__).resolve().parent
required=['index.html','login.html','admin.html','duarte-version.json','duarte-sw-v62.js','_headers']
checks={f:(root/f).is_file() for f in required}
html=(root/'index.html').read_text(encoding='utf-8',errors='replace')
class IdCollector(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k=='id' and v is not None:self.ids.append(v)
parser=IdCollector();parser.feed(html);ids=parser.ids
checks['unique_HTML_ids']=len(ids)==len(set(ids))
try: v=json.loads((root/'duarte-version.json').read_text()); checks['version_manifest_parse']=bool(v.get('version'))
except Exception: checks['version_manifest_parse']=False
checks['group_call_membership_guard']='duarte_group_call_participants' in (root/'cloudflare-worker-livekit-token.js').read_text()
checks['no_service_role_key_in_worker_source']='SUPABASE_SERVICE_ROLE_KEY' not in (root/'cloudflare-worker-livekit-token.js').read_text()
remote={}
if a.site:
 url=a.site.rstrip('/')
 if not url.startswith('https://'): print('Only HTTPS preview URLs accepted',file=sys.stderr);sys.exit(2)
 for name in ['index.html','login.html','duarte-version.json','duarte-sw-v62.js']:
  try:
   req=urllib.request.Request(url+'/'+name,headers={'User-Agent':'Duarte-ReadOnly-Preflight/1.0','Cache-Control':'no-cache'})
   with urllib.request.urlopen(req,timeout=15) as resp:
    raw=resp.read(524288)
    remote[name]={'status':resp.status,'content_type':resp.headers.get('Content-Type',''),'bytes_sampled':len(raw)}
    if name=='duarte-version.json':
     remote[name]['version']=json.loads(raw.decode()).get('version')
  except Exception as exc: remote[name]={'error':str(exc)}
print(json.dumps({'local_static_checks':checks,'local_static_pass':all(checks.values()),'preview_reads':remote,'manual_authorization_tests':'NOT PERFORMED','production_approval':'BLOCKED: live admin approval, LiveKit call permissions, and Android tests pending'},indent=2))
if not all(checks.values()):sys.exit(1)
