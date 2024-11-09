import argparse
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse, urlunparse

# Function to transform URLs
def transform_url(url, base_url, keep_anchors=False, keep_index_urls=False):
    # Replace any backslashes in the URL with forward slashes
    url = url.replace('\\', '/')
    parsed_url = urlparse(url)

    # Remove anchors if not keeping them
    if not keep_anchors and parsed_url.fragment:
        url = urlunparse(parsed_url._replace(fragment=''))

    # Replace "index.html" with directory URL if not keeping index URLs
    if not keep_index_urls:
        if parsed_url.path.endswith('/index.html'):
            url = urlunparse(parsed_url._replace(path=parsed_url.path[:-10]))

    # Add trailing slash to directories without a filename
    path_parts = parsed_url.path.split('/')
    if not path_parts[-1]:  # already ends with a slash, keep as is
        pass
    elif '.' not in path_parts[-1]:  # no extension, assume it's a directory
        url = urlunparse(parsed_url._replace(path=parsed_url.path + '/'))

    return url

# Argument parser setup
parser = argparse.ArgumentParser(description="Generate an XML sitemap from a webpage's links.")
parser.add_argument(
    "--url",
    type=str,
    default="https://ajgorhoe.github.io/index.html",
    help="The URL of the HTML sitemap page to parse. Default is https://ajgorhoe.github.io/index.html"
)
parser.add_argument(
    "--output",
    type=str,
    default="sitemap1.xml",
    help="The output XML file name. Default is sitemap1.xml"
)
parser.add_argument(
    "--baseurl",
    type=str,
    default=None,
    help="The base URL for converting relative links to absolute links. Defaults to derived from URL."
)
parser.add_argument(
    "--keepanchors",
    action="store_true",
    help="Keep anchors in URLs (default is to remove them)."
)
parser.add_argument(
    "--keepindexurls",
    action="store_true",
    help="Keep 'index.html' in URLs (default is to remove it)."
)
parser.add_argument(
    "--keepexternalurls",
    action="store_true",
    help="Keep external URLs (default is to exclude them)."
)

args = parser.parse_args()
url = args.url
output_file = args.output
base_url = args.baseurl
keep_anchors = args.keepanchors
keep_index_urls = args.keepindexurls
keep_external_urls = args.keepexternalurls

# Derive the base URL if not provided
if not base_url:
    parsed_url = urlparse(url)
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

# Add the initial URL as the first entry in the sitemap
unique_links = [url]  # Start with the main page URL

# Convert to absolute URLs, applying transformations
transformed_links = []
for link in links:
    abs_url = urljoin(base_url, link)
    abs_url = transform_url(abs_url, base_url, keep_anchors, keep_index_urls)

    # Check if external URLs should be kept
    if not keep_external_urls:
        parsed_abs_url = urlparse(abs_url)
        if not parsed_abs_url.netloc.endswith(urlparse(base_url).netloc):
            continue
        if not parsed_abs_url.path.startswith(urlparse(base_url).path):
            continue

    transformed_links.append(abs_url)

# Remove duplicates but maintain original order
seen = set()
for link in transformed_links:
    if link not in seen:
        unique_links.append(link)
        seen.add(link)

# Generate XML sitemap structure
sitemap_template = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{entries}
</urlset>'''

entries = ""
for link in unique_links:
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
