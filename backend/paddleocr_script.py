import sys
from paddleocr import PaddleOCR

def perform_ocr(image_path):
    ocr = PaddleOCR(use_angle_cls=True, lang='en')  # Initialize PaddleOCR
    result = ocr.ocr(image_path, cls=True)
    
    # Extract the OCR text
    extracted_text = ""
    for line in result[0]:
        extracted_text += line[1][0] + "\n"
    
    return extracted_text

if __name__ == "__main__":
    image_path = sys.argv[1]  # Get the image file path from the command line argument
    extracted_text = perform_ocr(image_path)
    print(extracted_text)  # Output the OCR result
