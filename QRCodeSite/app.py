from flask import Flask, render_template, request, send_file, jsonify
import qrcode
import qrcode.image.svg
import io
import base64
import os
from fpdf import FPDF
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_qr():
    link = request.form['link']
    qr = qrcode.make(link)
    buf = io.BytesIO()
    qr.save(buf, 'PNG')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    return jsonify({'img_base64': img_base64})

@app.route('/download', methods=['POST'])
def download_qr():
    link = request.form['link']
    filetype = request.form['filetype']
    
    if filetype in ['png', 'jpeg', 'svg']:
        buf = io.BytesIO()
        qr = qrcode.make(link)
        if filetype == 'png':
            qr.save(buf, 'PNG')
            mimetype = 'image/png'
            extension = 'png'
        elif filetype == 'jpeg':
            qr.save(buf, 'JPEG')
            mimetype = 'image/jpeg'
            extension = 'jpeg'
        else:  # filetype == 'svg'
            factory = qrcode.image.svg.SvgImage
            img = qrcode.make(link, image_factory=factory)
            img.save(buf)
            mimetype = 'image/svg+xml'
            extension = 'svg'
        
        buf.seek(0)
        return send_file(buf, mimetype=mimetype, as_attachment=True, download_name=f'qrcode.{extension}')

    elif filetype == 'pdf':
        qr = qrcode.make(link)
        buf = io.BytesIO()
        qr.save(buf, format='PNG')
        buf.seek(0)

        # Convert the BytesIO buffer to an image reader
        image_reader = ImageReader(buf)

        # Create a PDF using ReportLab
        pdf_buf = io.BytesIO()
        pdf = canvas.Canvas(pdf_buf, pagesize=letter)

        # Add QR code image data directly (no temporary file)
        pdf.drawImage(image_reader, 10, 10, width=100, height=100)

        pdf.save()
        pdf_buf.seek(0)
        return send_file(pdf_buf, mimetype='application/pdf', as_attachment=True, download_name='qrcode.pdf')
if __name__ == '__main__':
    app.run(debug=True)
