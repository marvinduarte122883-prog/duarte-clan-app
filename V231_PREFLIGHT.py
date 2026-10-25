#!/usr/bin/env python3
"""Read-only V231 local/preview validation. No authenticated requests or mutations."""
from pathlib import Path
from html.parser import HTMLParser
import argparse, json, collections, urllib.request, urllib.parse, sys, hashlib
p=argparse.ArgumentParser(); p.add_argument('--site', help='Full HTTPS preview origin e.g. https://branch.project.pages.dev'); args=p.parse_args()
root=Path(__file__).resolve().parent
required=['index.html','login.html','admin.html','duarte-version.json','duarte-sw-v62.js','cloudflare-worker-livekit-token.js','_headers']
results={name:{'pass':(root/name).is_file()} for name in required}
class Collector(HTMLParser):
 def __init__(self):super().__init__();self.ids=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k=='id' and v:self.ids.append(v)
html=(root/'index.html').read_text(encoding='utf-8')
a=Collector();a.feed(html);dups=[x for x,n in collections.Counter(a.ids).items() if n>1]
results['unique_ids']={'pass':not dups,'duplicates':dups}
try:
 manifest=json.loads((root/'duarte-version.json').read_text())
 results['version_manifest']={'pass':manifest.get('version')=='v231-preview-validation','value':manifest.get('version')}
except Exception as e:results['version_manifest']={'pass':False,'error':str(e)}
worker=(root/'cloudflare-worker-livekit-token.js').read_text()
results['livekit_guard_present']={'pass':'duarte_group_call_participants' in worker,'note':'Source presence only; not proof of authorization correctness'}
results['no_embedded_service_role_secret']={'pass':not bool(__import__('re').search(r'(?i)(?:service_role|supabase_service_role_key)\s*[:=]\s*[\"\']eyJ',worker)),'note':'Heuristic only; manual credential audit required'}
remote={}
if args.site:
 origin=urllib.parse.urlsplit(args.site)
 if origin.scheme!='https' or not origin.hostname or origin.username or origin.password or origin.path not in ('','/') or origin.query or origin.fragment:
  p.error('--site must be an HTTPS origin without credentials, path, query or fragment')
 base=args.site.rstrip('/')
 for name in ['index.html','login.html','duarte-version.json','duarte-sw-v62.js']:
  try:
   req=urllib.request.Request(base+'/'+name,headers={'User-Agent':'Duarte-V231-Preflight','Cache-Control':'no-cache'})
   with urllib.request.urlopen(req,timeout=12) as response:
    raw=response.read(2_000_001)
    item={'http_status':response.status,'type':response.headers.get('Content-Type',''),'bytes_read':len(raw),'pass':response.status==200 and len(raw)<=2_000_000}
    if name=='duarte-version.json':
     try:
      remote_manifest=json.loads(raw);item['version']=remote_manifest.get('version');item['pass']=item['pass'] and item['version']=='v231-preview-validation'
     except Exception as e:item['pass']=False;item['error']=str(e)
    if name=='duarte-sw-v62.js':item['pass']=item['pass'] and b'self' in raw
    if name in ('index.html','login.html'):item['pass']=item['pass'] and b'<html' in raw.lower()
    remote[name]=item
  except Exception as e: remote[name]={'pass':False,'error':str(e)}
report={'release':'V231 preview validation','local':results,'remote':remote,'local_pass':all(v['pass'] for v in results.values()),'remote_pass':bool(args.site) and all(v['pass'] for v in remote.values()),'manual_tests':'NOT PERFORMED','production_release':'NO-GO until manual authorization and Android tests pass'}
print(json.dumps(report,indent=2))
sys.exit(0 if report['local_pass'] and (not args.site or report['remote_pass']) else 1)
