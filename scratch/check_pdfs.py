import fitz
import os
import json

asset_dir = r"C:\Users\Ronny\OneDrive\Documents\AgriShield-365\assests-agrishield365"
pdfs = [f for f in os.listdir(asset_dir) if f.endswith('.pdf')]

info = {}
for pdf in pdfs:
    doc = fitz.open(os.path.join(asset_dir, pdf))
    info[pdf] = len(doc)

print(json.dumps(info, indent=2))
