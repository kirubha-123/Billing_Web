"use client";

import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from "@zxing/library";
import { X } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let isUnmounted = false;
    let animationFrameId: number;
    let currentCodeReader: BrowserMultiFormatReader | null = null;
    let activeStream: MediaStream | null = null;

    const startScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment", 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (isUnmounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        activeStream = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          // Add error handling for play()
          try {
            await videoRef.current.play();
          } catch (e) {
            console.error("Video play error:", e);
          }
        }

        // 1. Try Native Hardware-Accelerated BarcodeDetector (Chrome/Edge)
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code']
          });

          const detectNative = async () => {
            if (isUnmounted || !videoRef.current || hasScanned) return;
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0 && !isUnmounted && !hasScanned) {
                setHasScanned(true);
                onScan(barcodes[0].rawValue);
                return;
              }
            } catch (e) { /* ignore */ }
            animationFrameId = requestAnimationFrame(detectNative);
          };
          detectNative();
        } 
        // 2. Fallback to ZXing Javascript Engine
        else {
          const hints = new Map();
          hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.EAN_13, BarcodeFormat.UPC_A, BarcodeFormat.CODE_128, BarcodeFormat.QR_CODE
          ]);
          hints.set(DecodeHintType.TRY_HARDER, true);
          currentCodeReader = new BrowserMultiFormatReader(hints);

          // decodeFromStream is more efficient and handles the loop automatically
          currentCodeReader.decodeFromStream(stream, videoRef.current!, (result, err) => {
            if (result && !isUnmounted && !hasScanned) {
              setHasScanned(true);
              onScan(result.getText());
            }
          });
        }
      } catch (err: any) {
        console.error("Scanner startup error:", err);
        if (!isUnmounted) setError("Camera access denied or unavailable.");
      }
    };

    startScanner();

    return () => {
      isUnmounted = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (currentCodeReader) {
        currentCodeReader.reset();
      }
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScan]); // Removed hasScanned from dependencies to prevent restarts

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scan Barcode / QR</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900">
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          
          <div className="w-full bg-black rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center shadow-inner">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
            />
            {/* Overlay line for targeting */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          </div>

          <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm font-medium">
            Align the red line over the barcode to add it to cart
          </p>
        </div>
      </div>
    </div>
  );
}
