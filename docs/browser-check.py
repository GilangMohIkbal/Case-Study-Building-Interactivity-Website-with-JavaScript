from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import re, base64, json, os, shutil
root=Path(__file__).resolve().parent.parent; evidence=root/'docs'/'evidence'; evidence.mkdir(exist_ok=True)
html=(root/'index.html').read_text(); css=(root/'css/styles.css').read_text(); html=re.sub(r'<link rel="stylesheet" href="css/styles.css"\s*/?>',lambda m:'<style>'+css+'</style>',html)
# Inline unchanged script bodies at end of document, to reproduce defer order. Embed SVGs for offline rendering.
js=[]
def script(m):
 js.append((root/m.group(1)).read_text()); return ''
html=re.sub(r'<script src="([^"]+)" defer></script>',script,html)
html=html.replace('</body>','\n'.join('<script>'+s+'</script>' for s in js)+'</body>')
for asset in (root/'assets').glob('*.svg'):
 html=html.replace('assets/'+asset.name,'data:image/svg+xml;base64,'+base64.b64encode(asset.read_bytes()).decode())
results=[]
with sync_playwright() as p:
 executable = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
 b=p.chromium.launch(executable_path=executable,args=['--no-sandbox']); page=b.new_page(viewport={'width':1440,'height':900}); page.set_default_timeout(2500)
 errors=[]; requests=[]; page.on('pageerror',lambda e:errors.append(str(e))); page.on('request',lambda r:requests.append((r.resource_type,r.url)))
 def reset():
  global page
  page.close()
  page=b.new_page(viewport={'width':1440,'height':900})
  page.set_default_timeout(2500)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append((r.resource_type,r.url)))
  page.set_content(html,wait_until='load')
 def l(s): return page.locator(s)
 def click(s): l(s).click()
 def txt(s,t): expect(l(s)).to_have_text(t)
 def qty(v): l('#quantity').fill(str(v))
 def size(v): click(f'#size-options button[data-size="{v}"]')
 def add(v=1,s='M'): size(s); qty(v); click('#add-to-cart')
 def count(n): txt('#cart-count',str(n))
 def shot(n): page.screenshot(path=str(evidence/(n+'.png')),animations='disabled')
 def run(id, desc, fn):
  try: fn(); results.append((id,'PASS',desc)); print(id,'PASS',flush=True)
  except Exception as e: results.append((id,'FAIL',str(e).splitlines()[0])); print(id,'FAIL',str(e)[:250],flush=True)
 def initial():
  reset(); txt('#product-price','Rp150.000'); txt('#stock-label','10 tersedia'); txt('#subtotal','Rp150.000'); txt('#selected-size','M'); expect(l('#quantity')).to_have_value('1'); expect(l('#gallery-thumbnails button')).to_have_count(3); assert l('#hero-image').evaluate('(e)=>e.complete && e.naturalWidth>0'); shot('01-desktop')
 run('T01','Harga, stok, ukuran awal, qty dan tiga thumbnail sesuai; SVG termuat.',initial)
 def sizes():
  size('S'); txt('#selected-size','S'); size('L'); txt('#selected-size','L'); txt('#selection-summary','Ukuran L · 1 item'); expect(l('#size-options .is-active')).to_have_count(1); expect(l('[data-size="L"]')).to_have_attribute('aria-pressed','true')
 run('T02','S/L aktif bergantian; ringkasan L dan satu active state.',sizes)
 run('T03','Qty 3 menampilkan Rp450.000.',lambda:(qty(3),txt('#subtotal','Rp450.000')))
 def invalid(v):
  qty(v); expect(l('#quantity-error')).to_be_visible(); expect(l('#add-to-cart')).to_be_disabled(); txt('#subtotal','—'); count(0)
 for i,v in enumerate(['0','-1','1.5','11',''],4): run(f'T{i:02}',f'Input {v or "kosong"} ditolak, error tampil, tombol disabled, subtotal —, cart 0.',lambda v=v:invalid(v))
 run('T09','Qty 2 valid kembali, error hilang, Rp300.000.',lambda:(qty(2),expect(l('#quantity-error')).to_be_hidden(),txt('#subtotal','Rp300.000')))
 def bounds():
  qty(1); expect(l('#qty-minus')).to_be_disabled(); qty(10); expect(l('#qty-plus')).to_be_disabled(); qty(9); click('#qty-plus'); expect(l('#quantity')).to_have_value('10')
 run('T10','Minus disabled pada 1, plus disabled pada 10; 9 + 1 = 10.',bounds)
 def addtwo():
  add(2); count(2); expect(l('#product-feedback')).to_contain_text('2 kemeja'); txt('#cart-total','Rp300.000'); shot('02-add-cart')
 run('T11','M ×2: count 2, total Rp300.000, feedback sukses.',addtwo)
 def merge():
  add(1); add(2,'L'); count(5); expect(l('.cart-items .cart-item')).to_have_count(2); txt('#cart-total','Rp750.000')
 run('T12','M ×3 dan L ×2: dua baris, 5 unit, Rp750.000.',merge)
 run('T13','Tambah 6 saat cart 5 ditolak; count tetap 5.',lambda:(qty(6),expect(l('#add-to-cart')).to_be_disabled(),count(5)))
 def edit():
  click('#cart-open'); click('.cart-item[data-size="M"] [data-action="increase"]'); count(6); txt('#cart-total','Rp900.000'); click('.cart-item[data-size="M"] [data-action="decrease"]'); count(5); txt('#cart-total','Rp750.000'); shot('03-cart-drawer')
 run('T14','Drawer +/− memperbarui count 6 lalu 5 dan total Rp900.000 lalu Rp750.000.',edit)
 def remove():
  click('.cart-item[data-size="M"] [data-action="remove"]'); click('.cart-item[data-size="L"] [data-action="remove"]'); count(0); txt('#cart-total','Rp0'); expect(l('#cart-empty')).to_be_visible(); expect(l('#checkout-open')).to_be_disabled(); click('#cart-close')
 run('T15','Hapus semua: count 0, empty state, Rp0, checkout disabled.',remove)
 def gallery():
  click('[data-index="1"]'); txt('#gallery-position','02 / 03'); expect(l('#hero-image')).to_have_attribute('alt',re.compile('belakang')); click('#gallery-next'); txt('#gallery-position','03 / 03'); expect(l('[data-index="2"]')).to_have_attribute('aria-pressed','true'); click('#gallery-prev'); txt('#gallery-position','02 / 03')
 run('T16','Thumbnail, next/prev, alt, posisi, aria-pressed sinkron.',gallery)
 run('T17','Index terakhir next ke 01, pertama prev ke 03.',lambda:(click('[data-index="2"]'),click('#gallery-next'),txt('#gallery-position','01 / 03'),click('#gallery-prev'),txt('#gallery-position','03 / 03')))
 def zoom():
  click('#gallery-zoom'); expect(l('#zoom-dialog')).to_be_visible(); click('#zoom-next'); txt('#zoom-position','01 / 03'); page.keyboard.press('ArrowLeft'); txt('#zoom-position','03 / 03'); txt('#gallery-position','03 / 03'); click('#zoom-close'); expect(l('#zoom-dialog')).to_be_hidden()
 run('T18','Zoom, navigasi tombol/keyboard, sinkronisasi dan close berfungsi.',zoom)
 def cancel():
  add(2); click('#cart-open'); click('#checkout-open'); txt('#checkout-total','Rp300.000'); click('#checkout-cancel'); count(2); expect(l('#checkout-dialog')).to_be_hidden()
 run('T19','Batal checkout: cart 2 tetap, modal tertutup.',cancel)
 def fail():
  click('#cart-open'); click('#checkout-open'); l('[name="checkout-scenario"][value="error"]').check(); click('#checkout-confirm'); expect(l('#checkout-loading')).to_be_visible(); shot('04-loading'); expect(l('#checkout-feedback')).to_contain_text('Simulasi gagal',timeout=4000); count(2); expect(l('#checkout-loading')).to_be_hidden(); expect(l('#checkout-confirm')).to_be_enabled(); shot('05-error')
 run('T20','Promise reject: loading lalu pesan gagal; cart 2, retry aktif.',fail)
 def success():
  l('[name="checkout-scenario"][value="success"]').check(); click('#checkout-confirm'); expect(l('#checkout-feedback')).to_contain_text('Pesanan demo berhasil',timeout=4000); count(0); expect(l('#checkout-loading')).to_be_hidden(); expect(l('#checkout-confirm')).to_be_disabled(); shot('06-success'); click('#checkout-cancel')
 run('T21','Retry resolve: pesan sukses, cart 0, loading hilang, confirm disabled.',success)
 def dbl():
  add(1); click('#cart-open'); click('#checkout-open'); page.evaluate('document.getElementById("checkout-confirm").click(); document.getElementById("checkout-confirm").click()'); expect(l('#checkout-confirm')).to_be_disabled(); expect(l('#checkout-close')).to_be_disabled(); expect(l('#checkout-loading')).to_be_visible()
 run('T22','Dua click sinkron: confirm/close disabled, satu loading aktif.',dbl)
 def escape():
  page.keyboard.press('Escape'); expect(l('#checkout-dialog')).to_be_visible(); expect(l('#checkout-feedback')).to_contain_text('Pesanan demo berhasil',timeout=4000); count(0); click('#checkout-cancel')
 run('T23','Escape saat pending tidak menutup dialog; proses selesai sukses.',escape)
 def toast():
  add(1); expect(l('#toast')).to_be_visible(); page.wait_for_timeout(1800); add(1,'L'); page.wait_for_timeout(1500); expect(l('#toast')).to_be_visible(); click('#toast-close'); expect(l('#toast')).to_be_hidden(); add(1); expect(l('#toast')).to_be_visible(); expect(l('#toast')).to_be_hidden(timeout=4000)
 run('T24','Toast baru bertahan melewati timer lama; close manual dan auto-hide berfungsi.',toast)
 def mobile():
  for width in [1440,390]:
   page.set_viewport_size({'width':width,'height':900}); assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'); click('#cart-open'); expect(l('#cart-dialog')).to_be_visible(); assert l('#cart-dialog').evaluate('(e)=>e.getBoundingClientRect().width <= innerWidth+1'); click('#cart-close')
  shot('07-mobile'); page.set_viewport_size({'width':1440,'height':900})
 run('T25','1440/390 px: tidak ada horizontal overflow, drawer dapat dibuka.',mobile)
 def feedback_quality():
  reset(); add(2); expect(l('#product-feedback')).to_contain_text('ditambahkan'); click('#qty-plus'); txt('#product-feedback',''); add(2); click('#qty-minus'); txt('#product-feedback',''); expect(l('#product-feedback')).not_to_have_class(re.compile('is-error'))
 run('Q01','Feedback lama dibersihkan saat plus/minus.',feedback_quality)
 def stock_quality():
  reset(); add(4); add(6,'L'); count(10); txt('#stock-label','0 tersedia'); expect(l('#add-to-cart')).to_be_disabled(); click('#cart-open'); expect(l('.cart-item[data-size="M"] [data-action="increase"]')).to_be_disabled(); click('.cart-item[data-size="M"] [data-action="decrease"]'); txt('#stock-label','1 tersedia'); count(9); click('#cart-close')
 run('Q02','Stok gabungan 10 mengunci penambahan; pengurangan mengembalikan satu unit.',stock_quality)
 def clear_quality():
  click('#cart-open'); click('#checkout-open'); click('#checkout-confirm'); expect(l('#checkout-feedback')).to_contain_text('Pesanan demo berhasil',timeout=4000); count(0); txt('#stock-label','10 tersedia'); txt('#cart-total','Rp0'); expect(l('#checkout-open')).to_be_disabled(); click('#checkout-cancel')
 run('Q03','Checkout sukses mengosongkan cart dan menyinkronkan stok serta total.',clear_quality)
 def focus_quality():
  reset(); add(2); click('#cart-open'); click('.cart-item[data-size="M"] [data-action="increase"]'); expect(l('.cart-item[data-size="M"] [data-action="increase"]')).to_be_focused(); click('.cart-item[data-size="M"] [data-action="remove"]'); expect(l('#cart-close')).to_be_focused(); click('#cart-close')
 run('Q04','Fokus dipulihkan ke kontrol pengganti, atau tombol tutup setelah item dihapus.',focus_quality)
 def reduced_motion():
  reset(); page.emulate_media(reduced_motion='reduce'); l('#add-to-cart').hover(); assert l('#add-to-cart').evaluate("e=>getComputedStyle(e).transform==='none' && getComputedStyle(e).transitionDuration==='0s'"); add(1); click('#cart-open'); assert l('#cart-dialog').evaluate("e=>getComputedStyle(e).animationName==='none'"); click('#cart-close'); page.emulate_media(reduced_motion='no-preference')
 run('Q05','Reduced motion menonaktifkan transform, transition tombol dan animasi drawer.',reduced_motion)
 def no_errors():
  assert not errors, errors
  assert not any(t in ['fetch','xhr'] for t,u in requests), requests
 run('T26','Tidak ada pageerror atau fetch/XHR pada alur uji.',no_errors)
 version=b.version; b.close()
(root/'docs'/'browser-results.json').write_text(json.dumps({'browser':version,'results':results,'errors':errors,'requests':[(t,u[:100]) for t,u in requests]},ensure_ascii=False,indent=2))
print(version,results)

if any(status != "PASS" for _, status, _ in results):
 raise SystemExit(1)
