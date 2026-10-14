'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Plus,
  X,
  Image as ImageIcon,
  Film,
  Calendar,
  MessageCircle,
  Send,
  Trash2,
  Maximize2,
  Tag,
  ChevronDown,
  ChevronUp,
  Camera,
  Link as LinkIcon,
  Play
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getActiveUser, UserProfile } from '@/app/types/auth';
import { Recuerdo, AlbumComment } from '@/app/types/content';
import AmbientBackground from '@/app/components/common/AmbientBackground';
import BackButton from '@/app/components/common/BackButton';
import AuthorBadge from '@/app/components/common/AuthorBadge';

const QUICK_REACTIONS = ['💖', '🥺', '🥰', '🌷', '✨', '🤍'];

function isVideoMedia(url?: string, type?: 'image' | 'video'): boolean {
  if (!url) return false;
  if (type === 'video') return true;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('data:video') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.webm') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be')
  );
}

export default function AlbumPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getActiveUser());
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todos');
  const [recuerdos, setRecuerdos] = useState<Recuerdo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState<boolean>(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    title: string;
  } | null>(null);

  // Formulario nuevo recuerdo
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  });
  const [nuevaCategoria, setNuevaCategoria] = useState<string>('Momentos');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaNotaAmor, setNuevaNotaAmor] = useState('');
  const [nuevosEmojis, setNuevosEmojis] = useState('📸✨');

  // Media del formulario
  const [mediaInputMode, setMediaInputMode] = useState<'file' | 'url'>('file');
  const [nuevoMediaUrl, setNuevoMediaUrl] = useState('');
  const [nuevoMediaType, setNuevoMediaType] = useState<'image' | 'video'>('image');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCurrentUser(getActiveUser());
    // Limpieza definitiva de recuerdos de prueba en el almacenamiento del navegador
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('todolaura_album_recuerdos');
        if (local) {
          const parsed = JSON.parse(local);
          const DUMMY_TITLES = [
            'Nuestra primera cita',
            'Paseo bajo la lluvia',
            'Viaje juntos de fin de semana',
            'Tarde de películas y snacks',
            'Un detalle inolvidable',
          ];
          const clean = parsed.filter(
            (r: any) => !['1', '2', '3', '4', '5'].includes(String(r.id)) && !DUMMY_TITLES.includes(r.titulo)
          );
          localStorage.setItem('todolaura_album_recuerdos', JSON.stringify(clean));
        }
      } catch (e) {}
    }
    cargarRecuerdosYComentarios();
  }, []);

  // 1. Cargar recuerdos y comentarios de Supabase
  const cargarRecuerdosYComentarios = async () => {
    setLoading(true);
    try {
      // Consultar recuerdos
      const { data: albumData, error: albumErr } = await supabase
        .from('album')
        .select('*')
        .order('created_at', { ascending: false });

      // Consultar comentarios
      const { data: commentsData } = await supabase
        .from('album_comments')
        .select('*')
        .order('created_at', { ascending: true });

      // Mapear comentarios por album_id
      const commentsMap: Record<string, AlbumComment[]> = {};
      if (commentsData) {
        commentsData.forEach((c) => {
          const comment: AlbumComment = {
            id: c.id,
            albumId: c.album_id,
            author: c.author || 'Laura',
            text: c.text,
            createdAt: c.created_at,
          };
          if (!commentsMap[c.album_id]) {
            commentsMap[c.album_id] = [];
          }
          commentsMap[c.album_id].push(comment);
        });
      }

      if (!albumErr && albumData && albumData.length > 0) {
        const mapeados: Recuerdo[] = albumData.map((item) => ({
          id: item.id,
          titulo: item.titulo,
          fecha: item.fecha,
          categoria: item.categoria || 'Momentos',
          descripcion: item.descripcion,
          notaAmor: item.nota_amor,
          imagenUrl: item.imagen_url,
          mediaType: item.media_type || (isVideoMedia(item.imagen_url) ? 'video' : 'image'),
          emojis: item.emojis || '📸✨',
          author: item.author || 'Sebastián',
          comments: commentsMap[item.id] || [],
        }));
        setRecuerdos(mapeados);
      } else {
        // Fallback a localStorage
        const local = localStorage.getItem('todolaura_album_recuerdos');
        if (local) {
          const parsed: Recuerdo[] = JSON.parse(local);
          const DUMMY_TITLES = [
            'Nuestra primera cita',
            'Paseo bajo la lluvia',
            'Viaje juntos de fin de semana',
            'Tarde de películas y snacks',
            'Un detalle inolvidable',
          ];
          const clean = parsed.filter(
            (r: any) => !['1', '2', '3', '4', '5'].includes(String(r.id)) && !DUMMY_TITLES.includes(r.titulo)
          );
          setRecuerdos(clean);
        } else {
          setRecuerdos([]);
        }
      }
    } catch (err) {
      console.warn('Error cargando recuerdos de Supabase:', err);
      const local = localStorage.getItem('todolaura_album_recuerdos');
      if (local) {
        const parsed: Recuerdo[] = JSON.parse(local);
        const DUMMY_TITLES = [
          'Nuestra primera cita',
          'Paseo bajo la lluvia',
          'Viaje juntos de fin de semana',
          'Tarde de películas y snacks',
          'Un detalle inolvidable',
        ];
        const clean = parsed.filter(
          (r: any) => !['1', '2', '3', '4', '5'].includes(String(r.id)) && !DUMMY_TITLES.includes(r.titulo)
        );
        setRecuerdos(clean);
      } else {
        setRecuerdos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Manejo de subida y compresión de archivos multimedia
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingMedia(true);
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      setNuevoMediaType('video');
      // Si el video supera 30MB, advertir
      if (file.size > 30 * 1024 * 1024) {
        alert('El video supera los 30MB. Te recomendamos subir un clip más corto o usar la opción de enlace.');
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNuevoMediaUrl(event.target?.result as string);
        setIsProcessingMedia(false);
      };
      reader.readAsDataURL(file);
    } else {
      setNuevoMediaType('image');
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
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setNuevoMediaUrl(compressed);
          } else {
            setNuevoMediaUrl(event.target?.result as string);
          }
          setIsProcessingMedia(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Guardar nuevo recuerdo
  const handleGuardarRecuerdo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevaDescripcion.trim()) return;

    const active = getActiveUser();
    const categoriaFinal = isCustomCategoryMode
      ? customCategoryInput.trim() || 'Momentos'
      : nuevaCategoria;

    const mediaFinalType = isVideoMedia(nuevoMediaUrl, nuevoMediaType) ? 'video' : 'image';

    const nuevoRecuerdoPayload = {
      titulo: nuevoTitulo.trim(),
      fecha: nuevaFecha.trim() || 'Fecha especial',
      categoria: categoriaFinal,
      descripcion: nuevaDescripcion.trim(),
      nota_amor: nuevaNotaAmor.trim() || null,
      imagen_url: nuevoMediaUrl.trim() || null,
      media_type: mediaFinalType,
      emojis: nuevosEmojis.trim() || '📸✨',
      author: active.displayName,
    };

    let nuevoId = `album_${Date.now()}`;
    try {
      const { data, error } = await supabase
        .from('album')
        .insert([nuevoRecuerdoPayload])
        .select();

      if (!error && data && data[0]) {
        nuevoId = data[0].id;
      } else if (error) {
        console.warn('Advertencia insertando en Supabase album:', error.message);
      }
    } catch (err) {
      console.warn('Fallback a guardado local:', err);
    }

    const nuevoRecuerdo: Recuerdo = {
      id: nuevoId,
      titulo: nuevoRecuerdoPayload.titulo,
      fecha: nuevoRecuerdoPayload.fecha,
      categoria: nuevoRecuerdoPayload.categoria,
      descripcion: nuevoRecuerdoPayload.descripcion,
      notaAmor: nuevoRecuerdoPayload.nota_amor || undefined,
      imagenUrl: nuevoRecuerdoPayload.imagen_url || undefined,
      mediaType: mediaFinalType,
      emojis: nuevoRecuerdoPayload.emojis,
      author: active.displayName,
      comments: [],
    };

    const prev = JSON.parse(localStorage.getItem('todolaura_album_recuerdos') || '[]');
    try {
      localStorage.setItem('todolaura_album_recuerdos', JSON.stringify([nuevoRecuerdo, ...prev]));
    } catch (e) {
      // Si la foto/video llena la cuota de localStorage
    }

    setRecuerdos((prevList) => [nuevoRecuerdo, ...prevList]);

    // Limpiar formulario
    setNuevoTitulo('');
    setNuevaDescripcion('');
    setNuevaNotaAmor('');
    setNuevoMediaUrl('');
    setCustomCategoryInput('');
    setIsCustomCategoryMode(false);
    setNuevosEmojis('📸✨');
    setModalNuevoAbierto(false);
  };

  // 4. Agregar comentario a un recuerdo
  const handleAddComment = async (albumId: string, textoPersonalizado?: string) => {
    const text = textoPersonalizado || commentInputs[albumId];
    if (!text || !text.trim()) return;

    const active = getActiveUser();
    const tempCommentId = `c_${Date.now()}`;

    const newComment: AlbumComment = {
      id: tempCommentId,
      albumId,
      author: active.displayName,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    // Actualizar UI inmediatamente
    setRecuerdos((prev) =>
      prev.map((r) => {
        if (r.id === albumId) {
          return {
            ...r,
            comments: [...(r.comments || []), newComment],
          };
        }
        return r;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [albumId]: '' }));

    // Guardar en Supabase
    try {
      const { data, error } = await supabase
        .from('album_comments')
        .insert([{
          album_id: albumId,
          author: active.displayName,
          text: newComment.text,
        }])
        .select();

      if (!error && data && data[0]) {
        // Actualizar con el ID real de Supabase
        setRecuerdos((prev) =>
          prev.map((r) => {
            if (r.id === albumId) {
              return {
                ...r,
                comments: (r.comments || []).map((c) =>
                  c.id === tempCommentId ? { ...c, id: data[0].id } : c
                ),
              };
            }
            return r;
          })
        );
      }
    } catch (err) {
      console.warn('Fallback a guardado local de comentario:', err);
    }
  };

  // 5. Eliminar comentario
  const handleDeleteComment = async (albumId: string, commentId: string) => {
    setRecuerdos((prev) =>
      prev.map((r) => {
        if (r.id === albumId) {
          return {
            ...r,
            comments: (r.comments || []).filter((c) => c.id !== commentId),
          };
        }
        return r;
      })
    );

    try {
      await supabase.from('album_comments').delete().eq('id', commentId);
    } catch (err) {
      console.warn('Error eliminando comentario en Supabase:', err);
    }
  };

  // 6. Eliminar publicación completa
  const handleDeleteRecuerdo = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este recuerdo?')) return;

    setRecuerdos((prev) => prev.filter((r) => r.id !== id));
    try {
      await supabase.from('album').delete().eq('id', id);
    } catch (err) {
      console.warn('Error eliminando recuerdo de Supabase:', err);
    }
  };

  // Categorías calculadas dinámicamente a partir de los recuerdos existentes
  const todasLasCategorias = useMemo(() => {
    const fromMemories = Array.from(new Set(recuerdos.map((r) => r.categoria).filter(Boolean)));
    return fromMemories.length > 0 ? ['Todos', ...fromMemories] : [];
  }, [recuerdos]);

  // Filtrar recuerdos según categoría activa
  const recuerdosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todos') return recuerdos;
    return recuerdos.filter((r) => r.categoria === categoriaActiva);
  }, [recuerdos, categoriaActiva]);

  const toggleComments = (id: string) => {
    setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#120309] via-[#240616] to-[#0e0207] text-white p-3 sm:p-6 md:p-8 overflow-x-hidden font-sans flex flex-col justify-between">
      <AmbientBackground withTulips />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Cabecera Principal */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-pink-900/40 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium mb-2 backdrop-blur-md">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
              <span>Nuestra Historia de Amor</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 bg-clip-text text-transparent">
              Álbum de Recuerdos 📸✨
            </h1>
            <p className="text-xs sm:text-sm text-pink-300/70 mt-1">
              Fotos, videos, momentos inolvidables y comentarios de los dos.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <AuthorBadge author={currentUser.displayName} prefix="Soy" />
            <button
              onClick={() => setModalNuevoAbierto(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-pink-950/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Recuerdo</span>
            </button>
          </div>
        </header>

        {/* Barra de Filtros por Categorías (solo cuando hay recuerdos) */}
        {recuerdos.length > 0 && todasLasCategorias.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar pt-1">
            {todasLasCategorias.map((cat) => {
              const count = cat === 'Todos' ? recuerdos.length : recuerdos.filter((r) => r.categoria === cat).length;
              const isActive = categoriaActiva === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-md shadow-pink-950/50 scale-105'
                      : 'bg-[#1e0716]/80 text-pink-200/70 hover:bg-[#2b0a20] hover:text-pink-100 border-pink-500/20'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-black/30'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* FEED DE RECUERDOS (Estilo Polaroid / Instagram Romántico) */}
        {loading ? (
          <div className="py-24 text-center text-pink-300 text-sm animate-pulse">
            Abriendo nuestro álbum de recuerdos... 📖✨
          </div>
        ) : recuerdosFiltrados.length === 0 ? (
          <div className="py-20 text-center bg-[#190613]/60 border border-pink-500/20 rounded-3xl p-8 backdrop-blur-md max-w-lg mx-auto">
            <span className="text-5xl block mb-3 animate-bounce">📸🌷</span>
            <h3 className="text-lg font-bold text-white mb-1">Aún no hay recuerdos en esta categoría</h3>
            <p className="text-xs text-pink-200/70 mb-4">
              Sé el primero en publicar una foto, video o momento inolvidable.
            </p>
            <button
              onClick={() => setModalNuevoAbierto(true)}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow-md"
            >
              Publicar ahora ✨
            </button>
          </div>
        ) : (
          <main className="space-y-8 sm:space-y-10 mb-12">
            {recuerdosFiltrados.map((recuerdo) => {
              const isVideo = isVideoMedia(recuerdo.imagenUrl, recuerdo.mediaType);
              const commentsCount = recuerdo.comments?.length || 0;
              const isAccordionOpen = !!openComments[recuerdo.id];

              return (
                <article
                  key={recuerdo.id}
                  className="bg-gradient-to-b from-[#1b0614]/90 to-[#12030d]/90 border border-pink-500/25 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden hover:border-pink-500/40 transition-all duration-300"
                >
                  {/* Encabezado del Post */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-b border-pink-500/10">
                    <div className="flex items-center gap-3">
                      <AuthorBadge author={recuerdo.author} prefix="Publicado por" />
                      <span className="text-[11px] font-mono text-pink-300/60 bg-pink-950/40 border border-pink-500/20 px-2.5 py-0.5 rounded-full">
                        {recuerdo.categoria}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-pink-200/70 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        {recuerdo.fecha}
                      </span>
                      <button
                        onClick={() => handleDeleteRecuerdo(recuerdo.id)}
                        className="text-pink-300/40 hover:text-rose-400 transition p-1 cursor-pointer"
                        title="Eliminar publicación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Multimedia (Foto o Video) */}
                  {recuerdo.imagenUrl && (
                    <div className="relative w-full bg-black/60 flex items-center justify-center overflow-hidden border-b border-pink-500/15">
                      {isVideo ? (
                        <video
                          src={recuerdo.imagenUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full max-h-[550px] object-contain"
                        />
                      ) : (
                        <div
                          className="relative w-full max-h-[550px] cursor-pointer group flex items-center justify-center"
                          onClick={() =>
                            setFullscreenMedia({
                              url: recuerdo.imagenUrl!,
                              type: 'image',
                              title: recuerdo.titulo,
                            })
                          }
                        >
                          <img
                            src={recuerdo.imagenUrl}
                            alt={recuerdo.titulo}
                            className="w-full max-h-[550px] object-cover sm:object-contain group-hover:scale-[1.01] transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md">
                              <Maximize2 className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cuerpo del Recuerdo */}
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{recuerdo.emojis}</span>
                      <h2 className="text-lg sm:text-2xl font-bold text-pink-100 tracking-tight">
                        {recuerdo.titulo}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-pink-100/90 whitespace-pre-wrap leading-relaxed">
                      {recuerdo.descripcion}
                    </p>

                    {recuerdo.notaAmor && (
                      <div className="p-3 sm:p-3.5 bg-gradient-to-r from-pink-950/50 via-rose-950/40 to-pink-950/50 border border-pink-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-rose-200 italic shadow-inner">
                        <Heart className="w-4 h-4 fill-pink-500 text-pink-500 shrink-0" />
                        <span>"{recuerdo.notaAmor}"</span>
                      </div>
                    )}

                    {/* Botón para desplegar comentarios */}
                    <div className="pt-2 border-t border-pink-500/10 flex items-center justify-between">
                      <button
                        onClick={() => toggleComments(recuerdo.id)}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-pink-300 hover:text-pink-100 transition cursor-pointer py-1"
                      >
                        <MessageCircle className="w-4 h-4 text-pink-400" />
                        <span>
                          {commentsCount === 0
                            ? 'Comentarios'
                            : `Ver comentarios (${commentsCount})`}
                        </span>
                        {isAccordionOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span className="text-[11px] text-pink-300/50 font-mono">
                        {(recuerdo.author || 'Laura').toLowerCase().includes('seb') ? '✨ Sebas' : '🌷 Laura'}
                      </span>
                    </div>

                    {/* ACORDEÓN DE COMENTARIOS */}
                    {isAccordionOpen && (
                      <div className="pt-3 border-t border-pink-500/15 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Lista de comentarios */}
                        {commentsCount === 0 ? (
                          <p className="text-xs text-pink-300/60 italic py-1 text-center">
                            Aún no hay comentarios. ¡Sé el primero en escribirle algo lindo! 💌
                          </p>
                        ) : (
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                            {recuerdo.comments?.map((comment) => (
                              <div
                                key={comment.id}
                                className="group/c p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-pink-500/15 flex items-start justify-between gap-2 text-xs backdrop-blur-md"
                              >
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <AuthorBadge author={comment.author} prefix="" className="text-[10px] py-0 px-2" />
                                    <span className="text-[10px] text-pink-300/50 font-mono">
                                      {new Date(comment.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-pink-100/90 whitespace-pre-wrap leading-relaxed pl-1">
                                    {comment.text}
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleDeleteComment(recuerdo.id, comment.id)}
                                  className="opacity-0 group-hover/c:opacity-100 text-pink-300/40 hover:text-rose-400 p-1 transition cursor-pointer"
                                  title="Borrar comentario"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reacciones Rápidas */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-pink-300/50 mr-1">Reaccionar:</span>
                          {QUICK_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleAddComment(recuerdo.id, emoji)}
                              className="text-base sm:text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                              title={`Enviar ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* Input para agregar comentario */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Escribe un comentario o respuesta..."
                            value={commentInputs[recuerdo.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [recuerdo.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddComment(recuerdo.id);
                              }
                            }}
                            className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-pink-500/25 focus:border-pink-500 text-xs sm:text-sm text-white placeholder:text-pink-300/40 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(recuerdo.id)}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white transition active:scale-95 cursor-pointer shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </main>
        )}
      </div>

      {/* MODAL NUEVO RECUERDO */}
      {modalNuevoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-gradient-to-br from-[#240616] via-[#1a0410] to-[#12020a] border border-pink-500/40 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative text-white my-6 max-h-[92vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setModalNuevoAbierto(false)}
              className="absolute top-4 right-4 text-pink-300 hover:text-white bg-pink-950/60 p-2 rounded-full border border-pink-500/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📸✨</span>
                <span>Nuevo Recuerdo</span>
              </h2>
              <p className="text-xs text-pink-200/70 mt-1">
                Publicando como: <span className="text-white font-bold underline">{currentUser.displayName} {currentUser.badgeEmoji}</span>
              </p>
            </div>

            <form onSubmit={handleGuardarRecuerdo} className="space-y-4 text-xs sm:text-sm">
              {/* Título */}
              <div>
                <label className="block text-xs font-medium text-pink-200/80 mb-1">Título del recuerdo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Nuestra tarde mágica de café"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-pink-500/20 focus:border-pink-500 text-white text-xs sm:text-sm focus:outline-none"
                />
              </div>

              {/* Fecha y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Fecha</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 14 de Febrero, 2024"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-pink-500/20 focus:border-pink-500 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Categoría</label>
                  {!isCustomCategoryMode ? (
                    <div className="flex gap-1.5">
                      <select
                        value={nuevaCategoria}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setIsCustomCategoryMode(true);
                          } else {
                            setNuevaCategoria(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-pink-500/20 focus:border-pink-500 text-white text-xs focus:outline-none"
                      >
                        {todasLasCategorias.filter((c) => c !== 'Todos').length > 0 ? (
                          todasLasCategorias
                            .filter((c) => c !== 'Todos')
                            .map((c) => (
                              <option key={c} value={c} className="bg-[#1a0410]">
                                {c}
                              </option>
                            ))
                        ) : (
                          <>
                            <option value="Momentos" className="bg-[#1a0410]">Momentos</option>
                            <option value="Citas" className="bg-[#1a0410]">Citas</option>
                            <option value="Viajes" className="bg-[#1a0410]">Viajes</option>
                            <option value="Especiales" className="bg-[#1a0410]">Especiales</option>
                          </>
                        )}
                        <option value="__custom__" className="bg-[#1a0410] text-pink-400 font-bold">
                          ➕ Crear nueva categoría...
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nombre de la categoría..."
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-pink-500/40 focus:border-pink-500 text-white text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomCategoryMode(false)}
                        className="px-2.5 py-1 text-xs rounded-xl bg-white/10 hover:bg-white/20 text-white"
                      >
                        Volver
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Multimedia (Selector entre Archivo o Enlace) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-pink-200/80">
                    Foto o Video del momento
                  </label>
                  <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-pink-500/20 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setMediaInputMode('file')}
                      className={`px-2.5 py-0.5 rounded-md transition ${
                        mediaInputMode === 'file' ? 'bg-pink-600 text-white' : 'text-pink-300/60'
                      }`}
                    >
                      📁 Archivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaInputMode('url')}
                      className={`px-2.5 py-0.5 rounded-md transition ${
                        mediaInputMode === 'url' ? 'bg-pink-600 text-white' : 'text-pink-300/60'
                      }`}
                    >
                      🔗 Enlace
                    </button>
                  </div>
                </div>

                {mediaInputMode === 'file' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {!nuevoMediaUrl ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-pink-500/30 hover:border-pink-400 p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition bg-black/30"
                      >
                        <div className="flex items-center gap-2 text-pink-300 mb-1">
                          <Camera className="w-5 h-5" />
                          <Film className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-white">Elegir foto o video del dispositivo</p>
                        <p className="text-[10px] text-pink-300/60 mt-0.5">Fotos optimizadas automáticamente</p>
                        {isProcessingMedia && (
                          <p className="text-xs text-pink-400 animate-pulse mt-2">Procesando archivo...</p>
                        )}
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden bg-black/60 border border-pink-500/30 flex items-center justify-center max-h-48">
                        {nuevoMediaType === 'video' ? (
                          <video src={nuevoMediaUrl} controls className="max-h-48 w-full object-contain" />
                        ) : (
                          <img src={nuevoMediaUrl} alt="Preview" className="max-h-48 w-full object-contain" />
                        )}
                        <button
                          type="button"
                          onClick={() => setNuevoMediaUrl('')}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-black text-white cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/foto.jpg o video..."
                      value={nuevoMediaUrl}
                      onChange={(e) => {
                        setNuevoMediaUrl(e.target.value);
                        setNuevoMediaType(isVideoMedia(e.target.value) ? 'video' : 'image');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-pink-500/20 focus:border-pink-500 text-white text-xs focus:outline-none"
                    />
                    {nuevoMediaUrl && (
                      <div className="mt-2 relative rounded-xl overflow-hidden bg-black/50 border border-pink-500/20 flex items-center justify-center max-h-40">
                        {nuevoMediaType === 'video' ? (
                          <video src={nuevoMediaUrl} controls className="max-h-40 w-full object-contain" />
                        ) : (
                          <img src={nuevoMediaUrl} alt="Preview URL" className="max-h-40 w-full object-contain" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-medium text-pink-200/80 mb-1">Descripción o Historia</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Cuenta qué pasó, cómo te sentiste o lo especial que fue este día..."
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-pink-500/20 focus:border-pink-500 text-white text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Nota de amor y Emojis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Nota de amor (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Te amo con mi vida ♥"
                    value={nuevaNotaAmor}
                    onChange={(e) => setNuevaNotaAmor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-pink-500/20 focus:border-pink-500 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-pink-200/80 mb-1">Emojis representativos</label>
                  <input
                    type="text"
                    placeholder="Ej: 📸✨🌷"
                    value={nuevosEmojis}
                    onChange={(e) => setNuevosEmojis(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-pink-500/20 focus:border-pink-500 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={isProcessingMedia}
                className="w-full py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:brightness-110 font-bold text-white text-xs sm:text-sm rounded-xl shadow-lg shadow-pink-950/60 transition cursor-pointer active:scale-98 disabled:opacity-50"
              >
                Guardar Recuerdo en Nuestro Álbum ✨
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE FOTO EN PANTALLA COMPLETA */}
      {fullscreenMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          onClick={() => setFullscreenMedia(null)}
        >
          <button
            onClick={() => setFullscreenMedia(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenMedia.url}
            alt={fullscreenMedia.title}
            className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl"
          />
          <p className="text-white text-sm mt-3 font-semibold text-center">{fullscreenMedia.title}</p>
        </div>
      )}

      <BackButton />
    </div>
  );
}