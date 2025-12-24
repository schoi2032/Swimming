import urllib.request
import re
import os
import ssl

# Bypass SSL verification for simplicity in some envs, though usually not needed
ssl._create_default_https_context = ssl._create_unverified_context

images = {
    "phelps.jpg": "https://commons.wikimedia.org/wiki/File:Michael_Phelps_Rio_2016.jpg", 
    # Fallback to a known existing file if that one fails, but let's try generic first if specific fails
    "ledecky.jpg": "https://commons.wikimedia.org/wiki/File:Katie_Ledecky_2016e.jpg", 
    "spitz.jpg": "https://commons.wikimedia.org/wiki/File:Mark_Spitz_1972.jpg",
    "dressel.jpg": "https://commons.wikimedia.org/wiki/File:Caeleb_Dressel_during_100_fly_(42052333224).jpg",
    "sjostrom.jpg": "https://commons.wikimedia.org/wiki/File:Sarah_Sj%C3%B6str%C3%B6m_2013.jpg",
    "thorpe.jpg": "https://commons.wikimedia.org/wiki/File:Ian_Thorpe_2012.jpg"
}

if not os.path.exists("images"):
    os.makedirs("images")

def download_image(filename, wiki_url):
    print(f"Processing {filename}...")
    try:
        # 1. Fetch the Wiki page
        with urllib.request.urlopen(wiki_url) as response:
            html = response.read().decode('utf-8')
        
        # 2. Find the original file URL
        # Look for href="...upload.wikimedia.org..." that ends in .jpg
        # Pattern: <a href="(https://upload.wikimedia.org/wikipedia/commons/[^"]+)" class="internal"
        # Or just find the first upload.wikimedia link that looks like the image
        
        # This regex looks for the 'Original file' link usually present on File pages
        match = re.search(r'href="(https://upload\.wikimedia\.org/wikipedia/commons/[^"]+\.jpg)"', html)
        
        if match:
            img_url = match.group(1)
            print(f"Found source: {img_url}")
            
            # 3. Download
            req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as img_response:
                with open(f"images/{filename}", "wb") as f:
                    f.write(img_response.read())
            print(f"Downloaded {filename}")
        else:
            print(f"Could not extract image URL from {wiki_url}")
            raise Exception("Regex failed")

    except Exception as e:
        print(f"Failed to download real image for {filename}: {e}")
        # Fallback to placeholder
        print("Using placeholder...")
        try:
            place_url = f"https://placehold.co/600x800/2a2a2a/FFF?text={filename.split('.')[0].title()}"
            with urllib.request.urlopen(place_url) as response:
                with open(f"images/{filename}", "wb") as f:
                    f.write(response.read())
        except Exception as e2:
            print(f"Placeholder failed: {e2}")

for name, url in images.items():
    download_image(name, url)