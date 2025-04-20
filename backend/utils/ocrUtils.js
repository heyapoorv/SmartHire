const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to call Python script for PaddleOCR
const performOCRWithPaddle = (imagePath) => {
  return new Promise((resolve, reject) => {
    const command = `python3 paddleocr_script.py "${imagePath}"`;  // Run the Python script

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing Python script: ${stderr || error.message}`);
      } else {
        resolve(stdout.trim());  // Return the OCR result
      }
    });
  });
};

module.exports = { performOCRWithPaddle };
