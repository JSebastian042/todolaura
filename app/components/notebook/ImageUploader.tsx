'use client';

import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Send, X, Camera } from 'lucide-react';

interface ImageUploaderProps {
  onSave: (imageDataUrl: string, caption?: string) => void;
  onCancel: () => void;
  accentColor?: string;
}

export default function ImageUploader({ onSave, onCancel, accentColor = 'pink' }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Comprimir imagen en el navegador usando un canvas invisible
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setSelectedImage(compressedDataUrl);
        } else {
          setSelectedImage(event.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if (selectedImage) {
      onSave(selectedImage, caption.trim() || undefined);
    }
  };

  return (
    <div className="w-full bg-[#1e0a16] border border-pink-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-lg flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedImage ? (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-pink-400/50 rounded-2xl w-full transition cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-pink-300 mb-2">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-white">Toca para elegir o tomar una foto</p>
          <p className="text-[11px] text-white/50 mt-1">Se optimiza automáticamente para cargar rápido</p>
          {isProcessing && <p className="text-xs text-pink-400 animate-pulse mt-2">Optimizando imagen...</p>}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="mt-4 text-xs text-white/60 hover:text-white underline cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative w-full max-h-64 rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Previsualización"
              className="max-h-64 max-w-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Añade un pie de foto o mensajito de amor... (opcional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 focus:border-pink-400 text-xs sm:text-sm text-white focus:outline-none"
          />

          <div className="flex items-center justify-between w-full pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSend}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white font-semibold text-xs transition shadow-lg cursor-pointer active:scale-95 ${
                accentColor === 'indigo'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-110 shadow-indigo-950/50'
                  : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 shadow-pink-950/50'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Subir Foto</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
