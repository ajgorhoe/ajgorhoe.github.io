import argparse
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse

# Set up argument parser
parser = argparse.ArgumentParser(description="Generate an XML sitemap from a webpage's links.")
parser.add_argument(
    "--url",
    type=str,
    default="https://www2.arnes.si/~ljc3m2/index.html",
    help="The URL of the HTML sitemap page to parse. Default is https://www2.arnes.si/~ljc3m2/index.html"
)
parser.add_argument(
    "--output",
    type=str,
    default="sitemap1.xml",
    help="The output XML file name. Default is sitemap.xml"
)
parser.add_argument(
    "--baseurl",
    type=str,
    default=None,
    help="The base URL to convert relative links to absolute links. If not specified, it will be derived from the URL."
)

# Parse arguments
args = parser.parse_args()
url = args.url
output_file = args.output
base_url = args.baseurl

# Derive the base URL if not provided
if not base_url:
    parsed_url = urlparse(url)
    # Construct base URL up to the last directory in the path (including the user part, if any)
    path_base = "/".join(parsed_url.path.split("/")[:-1]) + "/"
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}{path_base}"

# Ensure consistent handling of trailing slash
if not base_url.endswith('/'):
    base_url += '/'

# Fetch HTML content
response = requests.get(url)
html_content = response.content

# Parse HTML and extract links
soup = BeautifulSoup(html_content, 'html.parser')
links = [a['href'] for a in soup.find_all('a', href=True)]

# Convert relative links to absolute URLs
absolute_links = [urljoin(base_url, link) for link in links]

# Generate XML sitemap structure
sitemap_template = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{entries}
</urlset>'''

entries = ""
for link in absolute_links:
    entries += f'''
    <url>
        <loc>{link}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>'''

# Complete sitemap
sitemap_content = sitemap_template.format(entries=entries.strip())

# Save to file
with open(output_file, "w") as file:
    file.write(sitemap_content)

print(f"Sitemap generated as {output_file}")
