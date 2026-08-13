// ==============================================================
// 1. CONFIGURACIÓN Y DATOS
// ==============================================================
const TMDB_API_KEY = "3fb36c15f2daa69df6bf8b07b1237183";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const HERO_IMG_URL = "https://image.tmdb.org/t/p/original";

let usuarioSuscrito = false;
let queue = [];
let currentQueueIndex = -1;
let isRadioPlaying = false;
let currentRadio = null;
let eventSource = null;
let historySongs = [];
let repeatMode = false;
let shuffleMode = false;

// Elementos del DOM del reproductor
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('btn-play');
const playIcon = document.getElementById('play-icon');
const progressSlider = document.getElementById('progress-slider');
const currentTimeSpan = document.getElementById('current-time');
const totalTimeSpan = document.getElementById('total-time');
const coverArt = document.getElementById('currentCoverArt');
const songTitle = document.getElementById('currentSong');
const artistName = document.getElementById('currentArtist');
const liveIndicator = document.getElementById('live-indicator');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('btn-mute');
const volIcon = document.getElementById('vol-icon');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnQueue = document.getElementById('btn-queue');
const btnShuffle = document.getElementById('btn-shuffle');
const btnRepeat = document.getElementById('btn-repeat');

// ==============================================================
// 2. DATOS ESTÁTICOS (PELIS.TXT)
// ==============================================================
const peliculas = [
    { titulo: "Drive (2011)", enlace: "https://ok.ru/video/8829831350907", premium: true },
    { titulo: "Mentiroso Mentiroso", enlace: "https://ok.ru/video/7737292818997", premium: false },
    { titulo: "Terminator 2", enlace: "https://ok.ru/video/9651656198793", premium: true },
    { titulo: "El ciudadano (1941)", enlace: "https://ok.ru/video/5074727144170", premium: false },
    { titulo: "Casablanca (1942)", enlace: "https://ok.ru/video/3655395052121", premium: false },
    { titulo: "El Padrino (1972)", enlace: "https://ok.ru/video/7253473561307", premium: true },
    { titulo: "2001: Odisea del espacio (1968)", enlace: "https://ok.ru/video/1720768268881", premium: false },
    { titulo: "Duro de matar 2", enlace: "https://ok.ru/video/10747151846097", premium: false },
    { titulo: "Comando", enlace: "https://ok.ru/video/10619643628083", premium: false },
    { titulo: "Matrix recargado", enlace: "https://ok.ru/video/5010916379373", premium: false }
];

const seriesData = [
    {
        tmdbId: 4110,
        titulo: "Los Simuladores",
        poster: "https://image.tmdb.org/t/p/w500/8nFg4L8P0M9XQ7Q3lN2o1jYl1q.jpg",
        episodios: [
            { numero: 1, titulo: "Tarjeta de Navidad", enlace: "https://ok.ru/video/7286191491722" },
            { numero: 2, titulo: "Diagnóstico rectoscópico", enlace: "https://ok.ru/video/7286191884938" },
            { numero: 3, titulo: "Seguro de desempleo", enlace: "https://ok.ru/video/7286192802442" },
            { numero: 4, titulo: "El testigo español", enlace: "https://ok.ru/video/7286192605834" },
            { numero: 5, titulo: "El joven simulador", enlace: "https://ok.ru/video/7286192671370" },
            { numero: 6, titulo: "El pequeño problema del gran hombre", enlace: "https://ok.ru/video/7286193064586" },
            { numero: 7, titulo: "Fuera de cálculo", enlace: "https://ok.ru/video/7289262049930" },
            { numero: 8, titulo: "El pacto Copérnico", enlace: "https://ok.ru/video/7286192933514" },
            { numero: 9, titulo: "El último héroe", enlace: "https://ok.ru/video/7286192540298" },
            { numero: 10, titulo: "Los impresentables", enlace: "https://ok.ru/video/7286192867978" },
            { numero: 11, titulo: "El colaborador foráneo", enlace: "https://ok.ru/video/7286192474762" },
            { numero: 12, titulo: "Marcela & Pau", enlace: "https://ok.ru/video/7286193130122" },
            { numero: 13, titulo: "Un trabajo involuntario", enlace: "https://ok.ru/video/7286192999050" }
        ],
        episodiosT2: [
            { numero: 14, titulo: "Los cuatro Notables", enlace: "https://ok.ru/video/7289262312074" },
            { numero: 15, titulo: "Z-9000", enlace: "https://ok.ru/video/7289262639754" },
            { numero: 16, titulo: "La gargantilla de las cuatro estaciones", enlace: "https://ok.ru/video/7289262377610" },
            { numero: 17, titulo: "El clan Motul", enlace: "https://ok.ru/video/7289262181002" },
            { numero: 18, titulo: "El vengador infantil", enlace: "https://ok.ru/video/7289262443146" },
            { numero: 19, titulo: "El matrimonio mixto", enlace: "https://ok.ru/video/7289262246538" },
            { numero: 20, titulo: "La Brigada B", enlace: "https://ok.ru/video/7289262049930" },
            { numero: 21, titulo: "Fin de semana de descanso", enlace: "https://ok.ru/video/7289262508682" },
            { numero: 22, titulo: "El debilitador social", enlace: "https://ok.ru/video/7289262115466" },
            { numero: 23, titulo: "El anillo de Salomón", enlace: "https://ok.ru/video/7289262705290" },
            { numero: 24, titulo: "Episodio final", enlace: "https://ok.ru/video/7289262574218" }
        ]
    },
    {
        tmdbId: 105267,
        titulo: "Okupas",
        poster: "https://image.tmdb.org/t/p/w500/6z2Wp4oXw9gGf5jJ0y8o6N1vLZ.jpg",
        episodios: [
            { numero: 1, titulo: "Los cinco mandamientos", enlace: "https://ok.ru/video/15530211936906" },
            { numero: 2, titulo: "Bienvenidos al tren", enlace: "https://ok.ru/video/15530272623242" },
            { numero: 3, titulo: "El ojo blindado", enlace: "https://ok.ru/video/15530272426634" },
            { numero: 4, titulo: "El beso de Judas", enlace: "https://ok.ru/video/15530272492170" },
            { numero: 5, titulo: "El mascapito", enlace: "https://ok.ru/video/15530272688778" },
            { numero: 6, titulo: "Los mantenidos", enlace: "https://ok.ru/video/15530273147530" },
            { numero: 7, titulo: "Paranoia", enlace: "https://ok.ru/video/15530272754314" },
            { numero: 8, titulo: "El pollo de Troya", enlace: "https://ok.ru/video/15530273016458" },
            { numero: 9, titulo: "El guardian", enlace: "https://ok.ru/video/15530272950922" },
            { numero: 10, titulo: "Miguel", enlace: "https://ok.ru/video/15530272557706" },
            { numero: 11, titulo: "Adios y buena suerte", enlace: "https://ok.ru/video/15530272885386" }
        ]
    }
];

const teatroData = [
    { titulo: "Cirque du Soleil - Kurios", enlace: "https://www.youtube.com/watch?v=o8Yc-v_2k-8", tipo: "youtube", imagen: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500" },
    { titulo: "Drácula, el musical", enlace: "https://ok.ru/video/7253473561307", tipo: "okru", imagen: "https://images.unsplash.com/photo-1507676184212-d0330a15233c?w=500" },
    { titulo: "Lo Mejor Del Antro 2020", enlace: "https://ok.ru/video/4066351057488", tipo: "okru", imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500" },
    { titulo: "Padre Guilherme (DJ Set)", enlace: "https://www.youtube.com/watch?v=Cp61jtJ9Pgk", tipo: "youtube", imagen: "https://images.unsplash.com/photo-1571266028243-e4733b0f0fb8?w=500" },
    { titulo: "Michael Jackson - Dangerous Tour", enlace: "https://ok.ru/video/4703389181", tipo: "okru", imagen: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500" },
    { titulo: "TEATRO 'La muerte de un viajante'", enlace: "https://www.youtube.com/watch?v=gmriK9_h0lc", tipo: "youtube", imagen: "https://images.unsplash.com/photo-1503095396549-8071a2ebd31a?w=500" },
    { titulo: "TEATRO 'La casa de Bernarda Alba'", enlace: "https://www.youtube.com/watch?v=pO-K_c0CTCY", tipo: "youtube", imagen: "https://images.unsplash.com/photo-1507676184212-d0330a15233c?w=500" },
    { titulo: "Edipo el rey (Sófocles)", enlace: "https://www.youtube.com/watch?v=VQbbkGWQdCY", tipo: "youtube", imagen: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500" },
    { titulo: "Cirque du Soleil - ALEGRÍA, BAZZAR, ECHO", enlace: "https://www.youtube.com/watch?v=o8Yc-v_2k-8", tipo: "youtube", imagen: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500" },
    { titulo: "Circo Rodas", enlace: "https://www.youtube.com/watch?v=gWs-PNSAj1c", tipo: "youtube", imagen: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500" }
];

const radiosData = [
    {
        id: "beat",
        nombre: "Beat Digital Radio",
        frecuencia: "Urbano / Hits",
        logo: "https://beatdigital.com.ar/img/cover.png",
        streamUrl: "https://stream.zeno.fm/9s7nnwmknkhvv",
        zenoUrl: "https://api.zeno.fm/mounts/metadata/subscribe/9s7nnwmknkhvv",
        biografia: "Beat Digital Radio es la emisora líder en música urbana y hits actuales...",
        equipo: ["DJ Micky", "Luciana Flow", "El Gordo Salsa", "Natalia Beats"],
        programacion: [
            { dia: "Lunes a Viernes", horario: "08:00 - 12:00", programa: "Morning Beats" },
            { dia: "Lunes a Viernes", horario: "14:00 - 18:00", programa: "Urban Hour" },
            { dia: "Sábados", horario: "20:00 - 00:00", programa: "Fiesta Digital" }
        ],
        podcasts: [
            { titulo: "Entrevista a Duki", enlace: "https://example.com/podcast1.mp3" },
            { titulo: "Especial Reggaetón", enlace: "https://example.com/podcast2.mp3" },
            { titulo: "Top 10 Semanal", enlace: "https://example.com/podcast3.mp3" }
        ]
    },
    {
        id: "uadav",
        nombre: "UADAV Radio",
        frecuencia: "Noticias y Cultura",
        logo: "https://via.placeholder.com/150/e50914/fff?text=UADAV",
        streamUrl: "https://stream.zeno.fm/f3wvbb1802quv",
        zenoUrl: "https://api.zeno.fm/mounts/metadata/subscribe/f3wvbb1802quv",
        biografia: "UADAV Radio es la voz institucional de la Unión de Artistas y Difusores Audiovisuales...",
        equipo: ["Marcos Guido Di Nella", "Laura Paredes", "Carlos Saavedra", "Elena Martínez"],
        programacion: [
            { dia: "Lunes a Viernes", horario: "07:00 - 09:00", programa: "Info AM" },
            { dia: "Lunes a Viernes", horario: "13:00 - 15:00", programa: "Diálogo Abierto" },
            { dia: "Domingos", horario: "19:00 - 21:00", programa: "Cultura sin Fronteras" }
        ],
        podcasts: [
            { titulo: "Entrevista a Mario Vargas Llosa", enlace: "https://example.com/podcast-uadav1.mp3" },
            { titulo: "Análisis de la Ley de Medios", enlace: "https://example.com/podcast-uadav2.mp3" },
            { titulo: "Mesa redonda: Futuro del Cine Argentino", enlace: "https://example.com/podcast-uadav3.mp3" }
        ]
    }
];

const artistasItunes = [
    { nombre: "Coldplay", bio: "Coldplay es una banda británica de rock alternativo formada en Londres en 1996..." },
    { nombre: "Gustavo Cerati", bio: "Gustavo Cerati fue un músico, cantante y compositor argentino, líder de Soda Stereo..." },
    { nombre: "Dua Lipa", bio: "Dua Lipa es una cantante y compositora británica de origen albanés..." },
    { nombre: "Charly Garcia", bio: "Charly García es un músico, cantante y compositor argentino, ícono del rock en español..." },
    { nombre: "The Weeknd", bio: "The Weeknd (Abel Tesfaye) es un cantante, compositor y productor canadiense..." }
];

// ==============================================================
// 3. INICIALIZACIÓN
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarCatalogo();
    renderizarRadios();
    renderizarArtistas();
    inicializarReproductor();
    configurarBuscador();
    cargarHeroPorDefecto();

    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    });
});

// ==============================================================
// 4. CARGA DE CATÁLOGO
// ==============================================================
async function inicializarCatalogo() {
    // Cine
    const contCine = document.getElementById('carousel-cine');
    for (let peli of peliculas) {
        const data = await buscarEnTMDB(peli.titulo, 'movie');
        if (data) {
            const card = crearCard(data, 'movie', peli.enlace, peli.premium);
            contCine.appendChild(card);
            if (peli.titulo.includes('Padrino')) configurarHero(data, 'movie', peli.enlace);
        }
    }

    // Series
    const contSeries = document.getElementById('carousel-series');
    for (let serie of seriesData) {
        let data = await obtenerSerieTMDB(serie.tmdbId);
        if (!data) {
            // Usar datos locales
            data = { name: serie.titulo, poster_path: null };
        }
        const card = crearCard(data, 'tv', null, false, serie);
        contSeries.appendChild(card);
    }

    // Teatro
    const contTeatro = document.getElementById('carousel-teatro');
    for (let obra of teatroData) {
        const card = document.createElement('div');
        card.className = 'card card-teatro';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
            <img src="${obra.imagen}" alt="${obra.titulo}">
            <div class="info"><h3>${obra.titulo}</h3></div>
        `;
        card.addEventListener('click', () => abrirVideo({ tipo: obra.tipo, id: extraerId(obra.enlace), titulo: obra.titulo }));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.click(); });
        contTeatro.appendChild(card);
    }
}

// ==============================================================
// 5. FUNCIONES TMDB
// ==============================================================
async function buscarEnTMDB(query, type) {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.results[0] || null;
    } catch (e) {
        console.error('Error TMDB:', e);
        return null;
    }
}

async function obtenerSerieTMDB(id) {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=es-ES`);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error('Error TMDB serie:', e);
        return null;
    }
}

function crearCard(data, tipo, enlace, premium = false, serieObj = null) {
    const div = document.createElement('div');
    div.className = `card card-${tipo === 'tv' ? 'video' : 'video'}`;
    div.setAttribute('tabindex', '0');
    const titulo = data.title || data.name || 'Sin título';
    let poster = data.poster_path ? IMG_URL + data.poster_path : null;
    if (!poster && serieObj && serieObj.poster) poster = serieObj.poster;
    if (!poster) poster = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22450%22%3E%3Crect width=%22300%22 height=%22450%22 fill=%22%23111%22/%3E%3Ctext x=%22150%22 y=%22225%22 font-family=%22Inter%22 font-size=%2220%22 fill=%22%23666%22 text-anchor=%22middle%22%3ENo%20Image%3C/text%3E%3C/svg%3E';
    
    div.innerHTML = `
        <img src="${poster}" alt="${titulo}">
        <div class="info">
            <h3>${titulo}</h3>
            ${premium ? `<span class="premium-badge"><i class="fa-solid fa-crown"></i> PREMIUM</span>` : ''}
        </div>
    `;
    
    if (tipo === 'movie') {
        div.addEventListener('click', () => reproducirPelicula(data, enlace, premium));
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter') div.click(); });
    } else if (tipo === 'tv' && serieObj) {
        div.addEventListener('click', () => abrirEpisodios(serieObj));
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter') div.click(); });
    }
    return div;
}

// ==============================================================
// 6. REPRODUCCIÓN PELÍCULAS
// ==============================================================
function reproducirPelicula(data, enlace, premium) {
    if (premium && !usuarioSuscrito) {
        document.getElementById('suscripcion-modal').style.display = 'block';
        window._pendingVideo = { tipo: 'okru', id: extraerId(enlace), titulo: data.title || data.name };
        return;
    }
    abrirVideo({ tipo: 'okru', id: extraerId(enlace), titulo: data.title || data.name });
}

// ==============================================================
// 7. EPISODIOS
// ==============================================================
function abrirEpisodios(serie) {
    const modal = document.getElementById('episodios-modal');
    document.getElementById('episodios-titulo').textContent = `${serie.titulo} - Episodios`;
    const lista = document.getElementById('lista-episodios');
    lista.innerHTML = '';
    const todosEp = [...serie.episodios, ...(serie.episodiosT2 || [])];
    todosEp.forEach(ep => {
        const div = document.createElement('div');
        div.className = 'episodio-item';
        div.setAttribute('tabindex', '0');
        div.innerHTML = `
            <span class="ep-numero">${ep.numero}</span>
            <span class="ep-titulo">${ep.titulo}</span>
            <button class="btn-reproducir-ep">Reproducir</button>
        `;
        const btn = div.querySelector('.btn-reproducir-ep');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirVideo({ tipo: 'okru', id: extraerId(ep.enlace), titulo: `${serie.titulo} - ${ep.titulo}` });
        });
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
        lista.appendChild(div);
    });
    modal.style.display = 'block';
}

function closeEpisodios() {
    document.getElementById('episodios-modal').style.display = 'none';
}

// ==============================================================
// 8. VIDEO (con YouTube-nocookie)
// ==============================================================
function abrirVideo(video) {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('video-container');
    let iframeSrc = '';
    if (video.tipo === 'youtube') {
        iframeSrc = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`;
    } else if (video.tipo === 'okru') {
        iframeSrc = `https://ok.ru/videoembed/${video.id}?autoplay=1`;
    }
    container.innerHTML = `<iframe src="${iframeSrc}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    modal.style.display = 'block';
    if (!audio.paused) { audio.pause(); playIcon.className = 'fa-solid fa-circle-play'; }
}

function closeVideo() {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('video-container').innerHTML = '';
}

// ==============================================================
// 9. RADIOS
// ==============================================================
function renderizarRadios() {
    const cont = document.getElementById('contenedor-radios');
    radiosData.forEach(radio => {
        const div = document.createElement('div');
        div.className = 'card-radio';
        div.setAttribute('tabindex', '0');
        div.innerHTML = `
            <img src="${radio.logo}" alt="${radio.nombre}">
            <div class="radio-info">
                <h3>${radio.nombre}</h3>
                <p>${radio.frecuencia}</p>
            </div>
        `;
        div.addEventListener('click', () => abrirPerfilRadio(radio));
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter') div.click(); });
        cont.appendChild(div);
    });
}

function abrirPerfilRadio(radio) {
    const modal = document.getElementById('radio-modal');
    const detalle = document.getElementById('radio-detalle');
    detalle.innerHTML = `
        <div class="radio-header">
            <img src="${radio.logo}" alt="${radio.nombre}">
            <div class="radio-titulo">
                <h2>${radio.nombre}</h2>
                <p>${radio.frecuencia}</p>
            </div>
        </div>
        <div class="radio-body">
            <div class="bio"><h3>Biografía</h3><p>${radio.biografia}</p></div>
            <div class="equipo"><h3>Equipo</h3><ul>${radio.equipo.map(n => `<li>🎙️ ${n}</li>`).join('')}</ul></div>
            <div class="programacion"><h3>Programación</h3><ul>${radio.programacion.map(p => `<li><span>${p.dia}</span> ${p.horario} - ${p.programa}</li>`).join('')}</ul></div>
            <div class="podcasts"><h3>Podcasts</h3>${radio.podcasts.map(pod => `
                <div class="podcast-item" tabindex="0">
                    <span>🎧 ${pod.titulo}</span>
                    <button class="btn-reproducir-podcast" data-enlace="${pod.enlace}">Escuchar</button>
                </div>
            `).join('')}</div>
        </div>
        <button class="btn-escuchar-radio" id="btn-escuchar-radio">🎵 Escuchar en vivo</button>
    `;
    detalle.querySelector('#btn-escuchar-radio').addEventListener('click', () => {
        reproducirRadio(radio);
        closeRadioModal();
    });
    detalle.querySelectorAll('.btn-reproducir-podcast').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const enlace = btn.dataset.enlace;
            const titulo = btn.parentElement.querySelector('span').textContent.replace('🎧 ', '');
            reproducirAudio({ url: enlace, titulo, artista: radio.nombre, cover: radio.logo });
            closeRadioModal();
        });
    });
    modal.style.display = 'block';
}

function closeRadioModal() {
    document.getElementById('radio-modal').style.display = 'none';
}

// ==============================================================
// 10. REPRODUCTOR GLOBAL
// ==============================================================
function inicializarReproductor() {
    if (!audio || !playBtn || !volumeSlider) return;
    const savedVol = localStorage.getItem('volume') || 80;
    volumeSlider.value = savedVol;
    audio.volume = savedVol / 100;

    playBtn.addEventListener('click', togglePlay);
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
        localStorage.setItem('volume', e.target.value);
        updateVolumeIcon();
    });
    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        updateVolumeIcon();
    });
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audio.duration);
        progressSlider.max = 100;
    });
    audio.addEventListener('ended', nextTrack);
    progressSlider.addEventListener('input', (e) => {
        if (audio.duration) {
            audio.currentTime = (e.target.value / 100) * audio.duration;
        }
    });
    btnNext.addEventListener('click', nextTrack);
    btnPrev.addEventListener('click', prevTrack);
    btnQueue.addEventListener('click', openQueue);
    btnShuffle.addEventListener('click', toggleShuffle);
    btnRepeat.addEventListener('click', toggleRepeat);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideo();
            closeEpisodios();
            closeRadioModal();
            closeSuscripcion();
            closeArtista();
            closeQueue();
        }
    });
}

function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) {
        audio.play();
        playIcon.className = 'fa-solid fa-circle-pause';
    } else {
        audio.pause();
        playIcon.className = 'fa-solid fa-circle-play';
    }
}

function updateVolumeIcon() {
    if (audio.muted || audio.volume === 0) volIcon.className = 'fa-solid fa-volume-xmark';
    else if (audio.volume < 0.5) volIcon.className = 'fa-solid fa-volume-low';
    else volIcon.className = 'fa-solid fa-volume-high';
}

function updateProgress() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressSlider.value = percent;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==============================================================
// 11. COLA DE REPRODUCCIÓN
// ==============================================================
function reproducirAudio(item) {
    if (isRadioPlaying) {
        if (eventSource) { eventSource.close(); eventSource = null; }
        isRadioPlaying = false;
        currentRadio = null;
        liveIndicator.classList.remove('active');
        document.getElementById('history-container').innerHTML = '';
    }
    if (item.radio) {
        reproducirRadio(item.radio);
        return;
    }
    if (queue.length === 0 || (currentQueueIndex >= 0 && queue[currentQueueIndex]?.url !== item.url)) {
        queue = [];
        currentQueueIndex = -1;
    }
    const exists = queue.some(q => q.url === item.url);
    if (!exists) {
        queue.push(item);
        if (queue.length === 1) currentQueueIndex = 0;
    } else {
        const idx = queue.findIndex(q => q.url === item.url);
        if (idx !== -1) currentQueueIndex = idx;
    }
    playFromQueue();
}

function playFromQueue() {
    if (currentQueueIndex < 0 || currentQueueIndex >= queue.length) return;
    const item = queue[currentQueueIndex];
    if (!item) return;
    audio.src = item.url;
    audio.load();
    audio.play().catch(e => console.log('Error al reproducir:', e));
    coverArt.src = item.cover || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23111%22/%3E%3Ctext x=%2230%22 y=%2235%22 font-family=%22Inter%22 font-size=%2216%22 fill=%22%23aaa%22 text-anchor=%22middle%22%3EUADAV%3C/text%3E%3C/svg%3E';
    songTitle.textContent = item.titulo || 'Sin título';
    artistName.textContent = item.artista || 'Desconocido';
    playIcon.className = 'fa-solid fa-circle-pause';
    liveIndicator.classList.remove('active');
    isRadioPlaying = false;
}

function nextTrack() {
    if (queue.length === 0 || isRadioPlaying) return;
    if (currentQueueIndex < queue.length - 1) {
        currentQueueIndex++;
        playFromQueue();
    } else if (repeatMode) {
        currentQueueIndex = 0;
        playFromQueue();
    }
}

function prevTrack() {
    if (queue.length === 0 || isRadioPlaying) return;
    if (currentQueueIndex > 0) {
        currentQueueIndex--;
        playFromQueue();
    }
}

function openQueue() {
    const modal = document.getElementById('queue-modal');
    const list = document.getElementById('queue-list');
    list.innerHTML = '';
    if (queue.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No hay canciones en cola</p>';
    } else {
        queue.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'queue-item';
            div.innerHTML = `
                <span class="q-titulo">${item.titulo || 'Sin título'}</span>
                <span class="q-artista">${item.artista || ''}</span>
                <button class="q-eliminar" data-index="${idx}"><i class="fa-solid fa-xmark"></i></button>
            `;
            div.querySelector('.q-eliminar').addEventListener('click', (e) => {
                e.stopPropagation();
                queue.splice(idx, 1);
                if (currentQueueIndex >= idx) currentQueueIndex--;
                if (currentQueueIndex < 0) currentQueueIndex = 0;
                if (queue.length === 0) {
                    audio.pause();
                    audio.src = '';
                    songTitle.textContent = 'Selecciona audio';
                    artistName.textContent = 'Sistema de Sonido';
                    coverArt.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23111%22/%3E%3Ctext x=%2230%22 y=%2235%22 font-family=%22Inter%22 font-size=%2216%22 fill=%22%23aaa%22 text-anchor=%22middle%22%3EUADAV%3C/text%3E%3C/svg%3E';
                    playIcon.className = 'fa-solid fa-circle-play';
                } else if (currentQueueIndex >= queue.length) {
                    currentQueueIndex = queue.length - 1;
                }
                openQueue();
            });
            if (idx === currentQueueIndex) {
                div.style.background = '#1a1a1a';
                div.style.borderLeft = '3px solid var(--accent-spotify)';
            }
            div.addEventListener('click', () => {
                currentQueueIndex = idx;
                playFromQueue();
                closeQueue();
            });
            list.appendChild(div);
        });
    }
    modal.style.display = 'block';
}

function closeQueue() {
    document.getElementById('queue-modal').style.display = 'none';
}

function toggleShuffle() {
    shuffleMode = !shuffleMode;
    btnShuffle.style.color = shuffleMode ? 'var(--accent-spotify)' : '';
    if (shuffleMode && queue.length > 1) {
        const current = queue[currentQueueIndex];
        queue = queue.sort(() => Math.random() - 0.5);
        if (current) {
            currentQueueIndex = queue.findIndex(q => q.url === current.url);
            if (currentQueueIndex === -1) currentQueueIndex = 0;
        }
    }
}

function toggleRepeat() {
    repeatMode = !repeatMode;
    btnRepeat.style.color = repeatMode ? 'var(--accent-spotify)' : '';
}

// ==============================================================
// 12. RADIO EN VIVO (con metadata y carátula)
// ==============================================================
function reproducirRadio(radio) {
    if (eventSource) { eventSource.close(); eventSource = null; }
    queue = [];
    currentQueueIndex = -1;
    isRadioPlaying = true;
    currentRadio = radio;
    liveIndicator.classList.add('active');
    audio.src = radio.streamUrl;
    audio.load();
    audio.play().catch(e => console.log('Error radio:', e));
    coverArt.src = radio.logo;
    songTitle.textContent = 'Conectando...';
    artistName.textContent = radio.nombre;
    playIcon.className = 'fa-solid fa-circle-pause';
    historySongs = [];
    document.getElementById('history-container').innerHTML = '';

    if (radio.zenoUrl) {
        eventSource = new EventSource(radio.zenoUrl);
        eventSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.streamTitle) {
                    let partes = data.streamTitle.split(' - ');
                    let artist = partes.length > 1 ? partes[0] : radio.nombre;
                    let song = partes.length > 1 ? partes[1] : data.streamTitle;
                    songTitle.textContent = song;
                    artistName.textContent = artist;
                    if (historySongs.length === 0 || historySongs[0].song !== song) {
                        historySongs.unshift({ artist, song });
                        if (historySongs.length > 4) historySongs.pop();
                        actualizarHistorial(radio);
                    }
                    buscarCover(artist, song);
                }
            } catch (err) { console.warn('Error metadata:', err); }
        };
        eventSource.onerror = () => { /* silencioso */ };
    }
}

function buscarCover(artist, song) {
    if (!artist || !song) return;
    const callbackName = 'deezer_cb_' + Date.now();
    window[callbackName] = function(data) {
        if (data && data.data && data.data.length > 0) {
            coverArt.src = data.data[0].album.cover_big;
        }
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
    };
    const script = document.createElement('script');
    script.src = `https://api.deezer.com/search?q=${encodeURIComponent(artist + ' ' + song)}&output=jsonp&callback=${callbackName}`;
    document.body.appendChild(script);
    setTimeout(() => {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script.parentNode) script.parentNode.removeChild(script);
        }
    }, 5000);
}

function actualizarHistorial(radio) {
    const container = document.getElementById('history-container');
    if (!container) return;
    container.innerHTML = '';
    historySongs.slice(1).forEach(h => {
        const span = document.createElement('span');
        span.className = 'hist-item';
        span.innerHTML = `<strong>${h.song}</strong> - ${h.artist}`;
        container.appendChild(span);
    });
}

// ==============================================================
// 13. ARTISTAS (iTunes)
// ==============================================================
function renderizarArtistas() {
    const cont = document.getElementById('carousel-artistas');
    artistasItunes.forEach(artista => {
        const div = document.createElement('div');
        div.className = 'card card-artista';
        div.setAttribute('tabindex', '0');
        const imgSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(artista.nombre)}&size=200&background=1db954&color=fff&font-size=0.5`;
        div.innerHTML = `<img src="${imgSrc}" alt="${artista.nombre}"><div class="info"><h3>${artista.nombre}</h3></div>`;
        div.addEventListener('click', () => abrirPerfilArtista(artista));
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter') div.click(); });
        cont.appendChild(div);
    });
}

function abrirPerfilArtista(artista) {
    const modal = document.getElementById('artista-modal');
    const detalle = document.getElementById('artista-detalle');
    detalle.innerHTML = `
        <div class="artista-header">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(artista.nombre)}&size=200&background=1db954&color=fff&font-size=0.5" alt="${artista.nombre}">
            <div class="artista-info"><h2>${artista.nombre}</h2><p>Artista</p></div>
        </div>
        <div class="artista-bio">${artista.bio}</div>
        <div class="artista-discografia"><h3>Discografía</h3><div id="canciones-artista">Cargando...</div></div>
    `;
    modal.style.display = 'block';
    cargarCancionesArtista(artista.nombre);
}

async function cargarCancionesArtista(nombre) {
    const cont = document.getElementById('canciones-artista');
    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(nombre)}&entity=song&limit=10`);
        const data = await res.json();
        if (!data.results || data.results.length === 0) {
            cont.innerHTML = '<p style="color:var(--text-muted);">No se encontraron canciones.</p>';
            return;
        }
        cont.innerHTML = '';
        data.results.forEach(track => {
            const div = document.createElement('div');
            div.className = 'cancion-item';
            div.setAttribute('tabindex', '0');
            div.innerHTML = `
                <span class="cancion-nombre">${track.trackName}</span>
                <button class="btn-reproducir-cancion">Reproducir</button>
            `;
            const btn = div.querySelector('.btn-reproducir-cancion');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = {
                    url: track.previewUrl,
                    titulo: track.trackName,
                    artista: track.artistName,
                    cover: track.artworkUrl100?.replace('100x100bb', '600x600bb') || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23111%22/%3E%3Ctext x=%2230%22 y=%2235%22 font-family=%22Inter%22 font-size=%2216%22 fill=%22%23aaa%22 text-anchor=%22middle%22%3EUADAV%3C/text%3E%3C/svg%3E'
                };
                reproducirAudio(item);
                closeArtista();
            });
            div.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
            cont.appendChild(div);
        });
    } catch (e) {
        cont.innerHTML = '<p style="color:var(--text-muted);">Error al cargar canciones.</p>';
    }
}

function closeArtista() {
    document.getElementById('artista-modal').style.display = 'none';
}

// ==============================================================
// 14. SUSCRIPCIÓN
// ==============================================================
function suscribirse(plan) {
    usuarioSuscrito = true;
    document.getElementById('suscripcion-modal').style.display = 'none';
    alert(`¡Suscripción ${plan} activada! (Simulación)`);
    if (window._pendingVideo) {
        abrirVideo(window._pendingVideo);
        window._pendingVideo = null;
    }
}

function closeSuscripcion() {
    document.getElementById('suscripcion-modal').style.display = 'none';
    window._pendingVideo = null;
}

// ==============================================================
// 15. BUSCADOR (TMDB + iTunes)
// ==============================================================
function configurarBuscador() {
    const input = document.getElementById('searchInput');
    const secResultados = document.getElementById('resultados-busqueda');
    const contResultados = document.getElementById('carousel-busqueda');
    const contMusica = document.getElementById('resultados-musica');
    let timeoutId;

    input.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        const query = e.target.value.trim();
        if (query.length < 2) {
            secResultados.style.display = 'none';
            return;
        }
        timeoutId = setTimeout(async () => {
            secResultados.style.display = 'block';
            contResultados.innerHTML = '';
            contMusica.innerHTML = '';

            // Buscar en TMDB
            try {
                const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`);
                const data = await res.json();
                const results = data.results.filter(item => item.media_type !== 'person');
                if (results.length > 0) {
                    results.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'card card-video';
                        card.setAttribute('tabindex', '0');
                        const titulo = item.title || item.name || 'Sin título';
                        const poster = item.poster_path ? IMG_URL + item.poster_path : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22450%22%3E%3Crect width=%22300%22 height=%22450%22 fill=%22%23111%22/%3E%3Ctext x=%22150%22 y=%22225%22 font-family=%22Inter%22 font-size=%2220%22 fill=%22%23666%22 text-anchor=%22middle%22%3ENo%20Image%3C/text%3E%3C/svg%3E';
                        card.innerHTML = `<img src="${poster}" alt="${titulo}"><div class="info"><h3>${titulo}</h3></div>`;
                        card.addEventListener('click', () => {
                            if (item.media_type === 'movie' || item.media_type === 'tv') {
                                buscarTrailer(item.id, item.media_type);
                            }
                        });
                        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.click(); });
                        contResultados.appendChild(card);
                    });
                }
            } catch (e) { console.warn('Error en búsqueda TMDB:', e); }

            // Buscar en iTunes
            try {
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=8`);
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    data.results.forEach(track => {
                        const div = document.createElement('div');
                        div.className = 'cancion-item';
                        div.style.cssText = 'cursor:pointer; padding:8px 0;';
                        div.innerHTML = `
                            <span class="cancion-nombre">${track.trackName}</span>
                            <span style="color:var(--text-muted);font-size:13px;">${track.artistName}</span>
                            <button class="btn-reproducir-cancion" style="background:var(--accent-spotify);">▶</button>
                        `;
                        const btn = div.querySelector('button');
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const item = {
                                url: track.previewUrl,
                                titulo: track.trackName,
                                artista: track.artistName,
                                cover: track.artworkUrl100?.replace('100x100bb', '600x600bb') || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23111%22/%3E%3Ctext x=%2230%22 y=%2235%22 font-family=%22Inter%22 font-size=%2216%22 fill=%22%23aaa%22 text-anchor=%22middle%22%3EUADAV%3C/text%3E%3C/svg%3E'
                            };
                            reproducirAudio(item);
                            secResultados.style.display = 'none';
                            input.value = '';
                        });
                        div.addEventListener('click', () => btn.click());
                        contMusica.appendChild(div);
                    });
                }
            } catch (e) { console.warn('Error en búsqueda iTunes:', e); }

            if (contResultados.children.length === 0 && contMusica.children.length === 0) {
                contResultados.innerHTML = '<p style="color:var(--text-muted);padding:20px;">No se encontraron resultados.</p>';
            }
        }, 400);
    });
}

async function buscarTrailer(id, type) {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}/videos?api_key=${TMDB_API_KEY}&language=es-ES`);
        const data = await res.json();
        const trailer = data.results.find(v => v.site === 'YouTube') || data.results[0];
        if (trailer) {
            abrirVideo({ tipo: 'youtube', id: trailer.key, titulo: 'Tráiler' });
        } else {
            alert('No se encontró tráiler.');
        }
    } catch (e) {
        alert('Error al buscar tráiler.');
    }
}

// ==============================================================
// 16. HERO
// ==============================================================
function cargarHeroPorDefecto() {
    const padrino = peliculas.find(p => p.titulo.includes('Padrino'));
    if (padrino) {
        buscarEnTMDB(padrino.titulo, 'movie').then(data => {
            if (data) configurarHero(data, 'movie', padrino.enlace);
        });
    }
}

function configurarHero(data, tipo, enlace) {
    const hero = document.getElementById('hero-banner');
    hero.style.backgroundImage = `url('${HERO_IMG_URL + data.backdrop_path}')`;
    document.getElementById('hero-title').textContent = data.title || data.name;
    document.getElementById('hero-desc').textContent = data.overview || 'Sinopsis no disponible.';
    document.getElementById('hero-play').onclick = () => {
        const esPremium = peliculas.some(p => p.titulo.includes(data.title) && p.premium);
        if (esPremium && !usuarioSuscrito) {
            document.getElementById('suscripcion-modal').style.display = 'block';
            window._pendingVideo = { tipo: 'okru', id: extraerId(enlace), titulo: data.title };
            return;
        }
        abrirVideo({ tipo: 'okru', id: extraerId(enlace), titulo: data.title });
    };
}

// ==============================================================
// 17. UTILIDADES
// ==============================================================
function extraerId(url) {
    const match = url.match(/(?:video|videoembed)\/(\d+)/);
    if (match) return match[1];
    const ytMatch = url.match(/(?:v=|embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return ytMatch[1];
    return url;
}

window.onclick = (e) => {
    const modals = ['video-modal', 'suscripcion-modal', 'radio-modal', 'episodios-modal', 'artista-modal', 'queue-modal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (e.target === modal) {
            modal.style.display = 'none';
            if (id === 'video-modal') document.getElementById('video-container').innerHTML = '';
            if (id === 'suscripcion-modal') window._pendingVideo = null;
        }
    });
};