package com.jwt.spring_security.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.jwt.spring_security.util.QRCodeGenerator;

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

@Service
public class QRCodeService {

    public BufferedImage generateQRCode(String text) throws Exception {
        return QRCodeGenerator.generateQRCodeImage(text);
    }

    public String decodeQRCode(File qrCodeImage) throws Exception {
        BufferedImage bufferedImage = ImageIO.read(qrCodeImage);
        LuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

        Result result;
        try {
            result = new MultiFormatReader().decode(bitmap);
            return result.getText();
        } catch (NotFoundException e) {
            // No QR code found in the image
            return null;
        }
    }
}
