'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Send, RotateCcw } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface AudioRecorderProps {
  onSave: (audioDataUrl: string, duration: number) => void;
  onCancel: () => void;
  accentColor?: string;
}

export default function AudioRecorder({ onSave, onCancel, accentColor = 'pink' }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Iniciar la grabación automáticamente al abrir el grabador
  useEffect(() => {
    startRecording();

    return () => {
      stopStreamsAndTimers();
    };
  }, []);

  const stopStreamsAndTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMsg(null);
    setAudioUrl(null);
    setRecordingTime(0);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg('Tu navegador no permite grabar audios directamente.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Seleccionar un mimeType compatible con la mayoría de navegadores móviles y desktop
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioUrl(base64data);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error al acceder al micrófono:', err);
      setErrorMsg('No se pudo acceder al micrófono. Por favor permite los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopStreamsAndTimers();
    }
  };

  const handleSend = () => {
    if (audioUrl) {
      onSave(audioUrl, recordingTime || 1);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="w-full bg-[#1e0a16] border border-pink-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-lg flex flex-col items-center gap-3">
      {errorMsg ? (
        <div className="text-rose-300 text-xs text-center py-2">
          ⚠️ {errorMsg}
          <div className="mt-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : isRecording ? (
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Animación de pulso de micrófono */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-14 h-14 rounded-full bg-rose-500/30 animate-ping" />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono text-sm sm:text-base font-bold text-white tracking-widest">
              {formatTime(recordingTime)}
            </span>
          </div>

          <p className="text-[11px] text-pink-200/70">Grabando nota de voz con amor...</p>

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => {
                stopRecording();
                onCancel();
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition cursor-pointer"
              title="Cancelar"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={stopRecording}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:brightness-110 shadow-lg cursor-pointer active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Finalizar grabación</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs text-pink-200/80 font-medium">Nota de voz lista para enviar:</p>

          {audioUrl && (
            <AudioPlayer src={audioUrl} duration={recordingTime} accentColor={accentColor} />
          )}

          <div className="flex items-center justify-between w-full max-w-sm pt-2">
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-950/60 text-white/70 hover:text-rose-200 text-xs transition cursor-pointer"
              >
                Descartar
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
                <span>Enviar Nota</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
