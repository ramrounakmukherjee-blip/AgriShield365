import os
import shutil
import fitz  # PyMuPDF
from PIL import Image, ImageStat
import io

asset_dir = r"C:\Users\Ronny\OneDrive\Documents\AgriShield-365\assests-agrishield365"
out_dir = r"C:\Users\Ronny\OneDrive\Documents\AgriShield-365\dashboard\public\assets"

def is_colorful(image):
    # Convert image to HSV
    hsv_image = image.convert('HSV')
    # Get the S (saturation) channel
    stat = ImageStat.Stat(hsv_image.split()[1])
    # The average saturation is a good indicator if it's a sketch (low) or colored (high)
    return stat.mean[0]

# Copy logo
logo_src = os.path.join(asset_dir, "logo-agrishield365.jpg")
if os.path.exists(logo_src):
    shutil.copy(logo_src, os.path.join(out_dir, "logo-agrishield365.jpg"))

# Process PDFs
pdfs = [f for f in os.listdir(asset_dir) if f.endswith('.pdf')]
# Sort PDFs to ensure Asset 1 -> Asset 7 order
pdfs.sort()

for i, pdf_filename in enumerate(pdfs):
    pdf_path = os.path.join(asset_dir, pdf_filename)
    doc = fitz.open(pdf_path)
    
    best_image = None
    best_color_score = -1
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        # Render page to an image (zoom for better quality)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        
        # Convert to PIL Image
        img_data = pix.tobytes("png")
        image = Image.open(io.BytesIO(img_data))
        
        color_score = is_colorful(image)
        
        if color_score > best_color_score:
            best_color_score = color_score
            best_image = image
            
    if best_image:
        # Save as scene_1.png, scene_2.png, etc. based on index
        out_filename = f"scene_{i+1}.png"
        out_path = os.path.join(out_dir, out_filename)
        best_image.save(out_path, format="PNG")
        print(f"Saved {out_filename} from {pdf_filename} with score {best_color_score:.2f}")

print("Extraction complete.")
