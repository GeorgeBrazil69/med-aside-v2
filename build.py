"""Build a self-contained HTML copy and a ZIP using Python's standard library."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + (root / 'styles.css').read_text() + '\n</style>')
for name in ['config.js', 'app.js']:
    html = html.replace(f'<script src="{name}" defer></script>', '')
scripts = '\n'.join('<script>\n' + (root / name).read_text() + '\n</script>' for name in ['config.js', 'app.js'])
html = html.replace('</body>', scripts + '\n</body>')
(root / 'cash-demo-standalone.html').write_text(html)
with ZipFile(root / 'cash-demo.zip', 'w', ZIP_DEFLATED) as archive:
    for name in ['index.html', 'styles.css', 'config.js', 'app.js', 'cash-demo-standalone.html', 'README.md', 'EDITING-GUIDE.md', 'build.py']:
        archive.write(root / name, name)
print('Built cash-demo-standalone.html and cash-demo.zip')
