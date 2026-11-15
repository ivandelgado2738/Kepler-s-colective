// ============================================================================
// ARCHIVO: app.js
// PROYECTO: NASA LunarBooking & eDreams Artemis (Polo Sur Lunar + Mapa 2D Real)
// DESCRIPCIÓN:
//   - Diferenciación total entre los 3 Modos:
//       1. 🌱 Modo Niño / Principiante: Nombres simples sin tecnicismos,
//          cajas explicativas en cada control y Academia Lunar ilustrada.
//       2. 🚀 Modo Promedio / Estándar: Estilo agencia Booking.com / eDreams.
//       3. 🔬 Modo Avanzado / Profesional: Gráficas de Alta Precisión (Δt = 0.5h/1h),
//          Simulación Energética/Baterías y Consola de Ingeniería en vivo que
//          recalcula todos los datos (C++ y JS), notas y gráficas al instante.
// ============================================================================

(() => {
  'use strict';
  if (window.__LUNAR_BOOKING_LOADED__) return;
  window.__LUNAR_BOOKING_LOADED__ = true;

  // Fotografías reales de la NASA y etiquetas adaptadas a cada modo
  const FOTO_REAL_POR_ZONA = {
    shackleton_rim: {
      img: 'img/shackleton_crater.jpg',
      credito: 'Foto Real NASA LRO • Cráter Shackleton',
      tagsNino: ['☀️ Casi siempre de día', '🧊 Hielo al lado', '🏔️ Cima segura'],
      tagsEstandar: ['☀️ ~90% Sol Anual', '🧊 Trampa Fría PSR', '🏔️ +2.150 m'],
      tagsProf: ['☀️ Ilu. >88% (LOLA)', '🧊 PSR 26 K Adyacente', '📐 +2.150 m • Pend. 7.5°'],
    },
    malapert_massif: {
      img: 'img/malapert_mountain.jpg',
      credito: 'Foto Real NASA • Cumbre Montaña Polar',
      tagsNino: ['📱 Llamadas sin cortes', '🏔️ Montaña de 5 km', '🌍 Se ve la Tierra'],
      tagsEstandar: ['📡 Tierra Siempre Visible', '🏔️ Cumbre +4.850 m', '🛰️ Enlace DTE'],
      tagsProf: ['📡 DTE Continuo (LoS)', '🏔️ +4.850 m IAU2000', '🛰️ Estación Relé Primaria'],
    },
    connecting_ridge: {
      img: 'img/cabeus_lcross.jpg',
      credito: 'Foto Real NASA LRO • Cresta Solar Polo Sur',
      tagsNino: ['☀️ Muchísima luz solar', '🛞 Paseo fácil en coche', '🌉 Puente entre cráteres'],
      tagsEstandar: ['☀️ Luz Casi Continua', '🛞 Cresta Rover', '🏔️ +2.400 m'],
      tagsProf: ['☀️ Cresta Artemis 01', '🔋 Óptimo FV Rasante', '📐 +2.400 m'],
    },
    shoemaker_rim: {
      img: 'img/shoemaker_crater.jpg',
      credito: 'Foto Real NASA Clementine • Polo Sur',
      tagsNino: ['🧊 Mucho hielo cerca', '🏕️ Borde tranquilo', '🔬 Ideal para explorar'],
      tagsEstandar: ['🧊 Hidrógeno Polar', '🔬 Prospección ISRU', '🏔️ +1.680 m'],
      tagsProf: ['🧊 Alto Flujo Neutrones H₂', '⛏️ Objetivo ISRU', '📐 +1.680 m'],
    },
    haworth_plateau: {
      img: 'img/haworth_crater.jpg',
      credito: 'Foto Real NASA • Tierras Altas del Sur',
      tagsNino: ['❄️ Mirador al gran frío', '🛞 Suelo muy estable', '🏔️ Meseta alta'],
      tagsEstandar: ['🌡️ Trampa Criogénica', '🛞 Meseta Estable', '🏔️ +1.890 m'],
      tagsProf: ['🌡️ Trampa Volátiles <40 K', '🛞 Meseta Baja Pendiente', '📐 +1.890 m'],
    },
    leibnitz_beta: {
      img: 'img/malapert_earthrise.jpg',
      credito: 'Foto Real NASA LRO • Tierra sobre el Limbo',
      tagsNino: ['🛬 Súper fácil aterrizar', '☀️ Gran llanura soleada', '🏔️ Muy alto y plano'],
      tagsEstandar: ['🛬 Llanura Aterrizaje', '☀️ Granja Solar', '🏔️ +3.920 m'],
      tagsProf: ['🛬 Sitio HLS Artemis 20', '☀️ Despliegue Array FV', '📐 +3.920 m'],
    },
    cabeus_crater: {
      img: 'img/mapa_real_polo_sur_nasa.jpg',
      credito: 'Foto Real NASA LROC • Cuenca Polar',
      tagsNino: ['💧 ¡Aquí encontraron agua!', '🌑 Cráter oscuro y frío', '🚀 Famoso en la NASA'],
      tagsEstandar: ['💧 Agua LCROSS', '🧊 Sombra Permanente', '🔬 Volátiles'],
      tagsProf: ['💧 Impacto LCROSS (5.6% H₂O)', '🌑 Interior PSR -1.200 m', '🛰️ Requiere Relé LunaNet'],
    },
    nobile_viper: {
      img: 'img/viper_nobile.jpg',
      credito: 'Foto Real NASA • Terreno Rover VIPER',
      tagsNino: ['🤖 Tierra de robots', '⛏️ Taladros de hielo', '⛰️ Colinas suaves'],
      tagsEstandar: ['🤖 Sitio Rover VIPER', '⛏️ Perforación Hielo', '🏔️ +1.950 m'],
      tagsProf: ['🤖 Zona Rover VIPER NASA', '⛏️ Regolito Hielo Superficial', '📐 +1.950 m'],
    },
    custom: {
      img: 'img/mapa_real_polo_sur_nasa.jpg',
      credito: 'Foto Real NASA LROC WAC • Polo Sur (84°S–90°S)',
      tagsNino: ['🎯 Elegido por ti en el mapa', '🌕 Punto único en la Luna'],
      tagsEstandar: ['🎯 Zona Única Mapa 2D', '🗺️ Proyección Polar', '🛰️ DEM LOLA'],
      tagsProf: ['🎯 Coordenada IAU2000::30120', '🗺️ Mosaico LROC WAC', '🛰️ Horizonte LOLA'],
    },
  };

  // Catálogo exclusivo del Polo Sur Lunar con nombres y descripciones diferenciados por modo
  const CATALOGO_RESPALDO = [
    {
      id: 'shackleton_rim',
      nombre_nino: '☀️ El Mirador del Sol Casi Eterno (Cráter Shackleton)',
      nombre_estandar: 'Borde del Cráter Shackleton (Sitio Artemis 04)',
      nombre_prof: 'Borde del Cráter Shackleton [Sitio Artemis 04 • 89.78°S, 120.0°E]',
      nombre: 'Borde del Cráter Shackleton (Sitio Artemis 04)',
      region: 'Polo Sur Lunar (89.78°S) • Cresta Iluminada',
      latitud_deg: -89.78,
      longitud_deg: 120.0,
      x_mapa_m: 2940.0,
      y_mapa_m: -5890.0,
      altitud_m: 2150.0,
      descripcion: 'Cresta solar casi continua junto a cráter con hielo.',
      explicacion_estudiante: 'Mirador alto con Sol casi todo el mes y hielo cerca.',
      descripcion_prof: 'Cresta +2.150 m (89.78°S). Horizonte despejado y trampa PSR adyacente.',
    },
    {
      id: 'malapert_massif',
      nombre_nino: '📱 La Gran Montaña de las Videollamadas (Monte Malapert)',
      nombre_estandar: 'Macizo de Malapert (Sitio Artemis 23)',
      nombre_prof: 'Macizo de Malapert [Sitio Artemis 23 • 85.95°S, 0.0°E • Cumbre DTE]',
      nombre: 'Macizo de Malapert (Sitio Artemis 23)',
      region: 'Polo Sur Lunar (85.95°S) • Montaña Visibilidad Tierra',
      latitud_deg: -85.95,
      longitud_deg: 0.0,
      x_mapa_m: 0.0,
      y_mapa_m: 122800.0,
      altitud_m: 4850.0,
      descripcion: 'Cumbre de ~5 km con visión directa continua hacia la Tierra.',
      explicacion_estudiante: 'Montaña muy alta desde donde siempre se ve la Tierra.',
      descripcion_prof: 'Cumbre +4.850 m (0°E). Enlace Direct-to-Earth (DTE) permanente.',
    },
    {
      id: 'connecting_ridge',
      nombre_nino: '🌉 El Puente Soleado entre Cráteres (Cresta Polar)',
      nombre_estandar: 'Cresta Shackleton–de Gerlache (Sitio Artemis 01)',
      nombre_prof: 'Cresta Shackleton–de Gerlache [Sitio Artemis 01 • 89.45°S, 222.0°E]',
      nombre: 'Cresta Shackleton–de Gerlache (Sitio Artemis 01)',
      region: 'Polo Sur Lunar (89.45°S) • Cresta Solar Central',
      latitud_deg: -89.45,
      longitud_deg: 222.0,
      x_mapa_m: -11150.0,
      y_mapa_m: -12380.0,
      altitud_m: 2400.0,
      descripcion: 'Cresta elevada con alta iluminación solar anual.',
      explicacion_estudiante: 'Camino alto entre cráteres con Sol durante semanas.',
      descripcion_prof: 'Cordillera inter-cráter +2.400 m. Máxima irradiancia rasante.',
    },
    {
      id: 'shoemaker_rim',
      nombre_nino: '🧊 El Campamento junto al Hielo Escondido (Cráter Shoemaker)',
      nombre_estandar: 'Borde del Cráter Shoemaker',
      nombre_prof: 'Anillo del Cráter Shoemaker [88.10°S, 45.0°E • Reserva H₂ PSR]',
      nombre: 'Borde del Cráter Shoemaker',
      region: 'Polo Sur Lunar (88.10°S) • Depósitos de Hidrógeno',
      latitud_deg: -88.10,
      longitud_deg: 45.0,
      x_mapa_m: 40700.0,
      y_mapa_m: 40700.0,
      altitud_m: 1680.0,
      descripcion: 'Borde polar elevado junto a depósitos de hielo en sombra.',
      explicacion_estudiante: 'Borde tranquilo junto a cráteres oscuros con agua helada.',
      descripcion_prof: 'Borde +1.680 m adyacente a PSR de Shoemaker (alta señal H₂).',
    },
    {
      id: 'haworth_plateau',
      nombre_nino: '❄️ El Balcón del Frío Extremo (Meseta Haworth)',
      nombre_estandar: 'Meseta del Cráter Haworth',
      nombre_prof: 'Meseta del Cráter Haworth [87.45°S, -12.0°O • Trampa Criogénica]',
      nombre: 'Meseta del Cráter Haworth',
      region: 'Polo Sur Lunar (87.45°S) • Trampa Fría Occidental',
      latitud_deg: -87.45,
      longitud_deg: -12.0,
      x_mapa_m: -16000.0,
      y_mapa_m: 75600.0,
      altitud_m: 1890.0,
      descripcion: 'Meseta estable junto a una trampa criogénica polar.',
      explicacion_estudiante: 'Meseta llana junto a un cráter muy frío (-240 °C).',
      descripcion_prof: 'Altiplanicie +1.890 m apta para rovers hacia trampas <40 K.',
    },
    {
      id: 'leibnitz_beta',
      nombre_nino: '🛬 La Gran Explanada Fácil para Aterrizar (Llanura Leibnitz)',
      nombre_estandar: 'Meseta Leibnitz Beta (Sitio Artemis 20)',
      nombre_prof: 'Meseta Leibnitz Beta [Sitio Artemis 20 • 85.40°S, 32.0°E • +3.920 m]',
      nombre: 'Meseta Leibnitz Beta (Sitio Artemis 20)',
      region: 'Polo Sur Lunar (85.40°S) • Altiplano Polar',
      latitud_deg: -85.40,
      longitud_deg: 32.0,
      x_mapa_m: 73800.0,
      y_mapa_m: 118100.0,
      altitud_m: 3920.0,
      descripcion: 'Altiplano amplio y elevado, ideal para aterrizajes y paneles.',
      explicacion_estudiante: 'Llanura alta y plana muy fácil para aterrizar.',
      descripcion_prof: 'Meseta +3.920 m, baja pendiente (<5°) y buena vista DTE.',
    },
    {
      id: 'cabeus_crater',
      nombre_nino: '💧 El Cráter donde Descubrieron Agua Real (Cráter Cabeus)',
      nombre_estandar: 'Cráter Cabeus (Impacto de Agua LCROSS)',
      nombre_prof: 'Cuenca del Cráter Cabeus [84.90°S, -35.5°O • Impacto LCROSS -1.200 m]',
      nombre: 'Cráter Cabeus (Impacto de Agua LCROSS)',
      region: 'Polo Sur Lunar (84.90°S) • Cuenca de Hielo Confirmado',
      latitud_deg: -84.90,
      longitud_deg: -35.5,
      x_mapa_m: -89800.0,
      y_mapa_m: 125800.0,
      altitud_m: -1200.0,
      descripcion: 'Cráter con agua helada confirmada por la sonda LCROSS.',
      explicacion_estudiante: 'Cráter frío y oscuro donde la NASA confirmó agua real.',
      descripcion_prof: 'Cuenca -1.200 m (5.6% H₂O LCROSS). Requiere enlace relé y baterías.',
    },
    {
      id: 'nobile_viper',
      nombre_nino: '🤖 Las Colinas de los Robots Exploradores (Zona VIPER)',
      nombre_estandar: 'Borde del Cráter Nobile (Zona Rover VIPER)',
      nombre_prof: 'Borde del Cráter Nobile [85.20°S, 55.0°E • Sitio Rover VIPER NASA]',
      nombre: 'Borde del Cráter Nobile (Zona Rover VIPER)',
      region: 'Polo Sur Lunar (85.20°S) • Colinas de Prospección',
      latitud_deg: -85.20,
      longitud_deg: 55.0,
      x_mapa_m: 119400.0,
      y_mapa_m: 83600.0,
      altitud_m: 1950.0,
      descripcion: 'Colinas seleccionadas por la NASA para el rover VIPER.',
      explicacion_estudiante: 'Colinas suaves elegidas para robots buscadores de hielo.',
      descripcion_prof: 'Colinas +1.950 m en borde de Nobile para prospección robótica.',
    },
  ];

  const CRATERES_MAPA_POLO_SUR = [
    { nombre: 'Shackleton', xKm: 0, yKm: 0, rKm: 10.5, psr: true },
    { nombre: 'Shoemaker', xKm: 36, yKm: 36, rKm: 25.5, psr: true },
    { nombre: 'Haworth', xKm: -16, yKm: 65, rKm: 25.0, psr: true },
    { nombre: 'Faustini', xKm: 68, yKm: 42, rKm: 21.0, psr: true },
    { nombre: 'de Gerlache', xKm: -32, yKm: -22, rKm: 16.0, psr: true },
    { nombre: 'Cabeus', xKm: -88, yKm: 122, rKm: 42.0, psr: true },
    { nombre: 'Nobile', xKm: 112, yKm: 78, rKm: 36.0, psr: true },
    { nombre: 'Amundsen', xKm: 125, yKm: -48, rKm: 51.0, psr: false },
  ];

  const imgMapaLroc = new Image();
  let imgMapaLrocCargada = false;
  imgMapaLroc.onload = () => {
    imgMapaLrocCargada = true;
    dibujarMapaPoloSur2D();
  };
  imgMapaLroc.src = 'img/mapa_real_polo_sur_nasa.jpg';

  const imgMapaClementine = new Image();
  let imgMapaClementineCargada = false;
  imgMapaClementine.onload = () => {
    imgMapaClementineCargada = true;
  };
  imgMapaClementine.src = 'img/shoemaker_crater.jpg';

  const state = {
    catalogo: [...CATALOGO_RESPALDO],
    nivelConocimiento: 'estandar',
    modoComparacion: 'LUGARES_FECHAS_MANUALES',
    modoGrafica: 'TEMPORAL', // 'TEMPORAL' | 'PRECISA' | 'ENERGIA' | 'POLAR'
    tipoCoordActual: 'SELENOGRAFICA', // 'SELENOGRAFICA' | 'ESFERICAS'
    hoverMapaPx: null,
    hoverGraficaIdx: null,
    servidorCppActivo: false,
    daltonismoActivo: false,
    zoomLupaPct: 100,
    lupaCursorActiva: false,
    zoomCursorFactor: 2.0,
    cursorLensRaf: null,
    ultimoCursorPos: null,
    textosOriginalesAutismo: new WeakMap(),
    ultimaBusqueda: null,
    ultimaComparacion: null,
  };

  const els = {
    badgeEstadoMotor: document.getElementById('badgeEstadoMotor'),
    btnToggleAdaptaciones: document.getElementById('btnToggleAdaptaciones'),
    panelAdaptaciones: document.getElementById('panelAdaptaciones'),
    btnIrComparador: document.getElementById('btnIrComparador'),
    btnAbrirMapa2DTop: document.getElementById('btnAbrirMapa2DTop'),

    btnNivelEstudiante: document.getElementById('btnNivelEstudiante'),
    btnNivelEstandar: document.getElementById('btnNivelEstandar'),
    btnNivelProfesional: document.getElementById('btnNivelProfesional'),
    cardNivelEstudiante: document.getElementById('cardNivelEstudiante'),
    cardNivelEstandar: document.getElementById('cardNivelEstandar'),
    cardNivelProfesional: document.getElementById('cardNivelProfesional'),
    bannerModoActivoTexto: document.getElementById('bannerModoActivoTexto'),
    bannerModoActivoBadge: document.getElementById('bannerModoActivoBadge'),

    btnIntentAmbas: document.getElementById('btnIntentAmbas'),
    btnIntentSoloFechas: document.getElementById('btnIntentSoloFechas'),
    btnIntentSoloLugar: document.getElementById('btnIntentSoloLugar'),
    chkSinFechaFija: document.getElementById('chkSinFechaFija'),
    cellDestinoLunar: document.getElementById('cellDestinoLunar'),
    cellFechaInicio: document.getElementById('cellFechaInicio'),
    cellFechaFin: document.getElementById('cellFechaFin'),

    btnModoAutismo: document.getElementById('btnModoAutismo'),
    btnModoTdah: document.getElementById('btnModoTdah'),
    btnModoDislexia: document.getElementById('btnModoDislexia'),
    btnModoBajaVision: document.getElementById('btnModoBajaVision'),
    btnModoDaltonismo: document.getElementById('btnModoDaltonismo'),
    btnModoMotora: document.getElementById('btnModoMotora'),
    btnModoFotofobia: document.getElementById('btnModoFotofobia'),
    btnResetA11y: document.getElementById('btnResetA11y'),
    tdahFocusBar: document.getElementById('tdahFocusBar'),

    txtSaludoHero: document.getElementById('txtSaludoHero'),
    txtSubtituloHero: document.getElementById('txtSubtituloHero'),
    txtConsejoTripulacion: document.getElementById('txtConsejoTripulacion'),
    lblPaso1Destino: document.getElementById('lblPaso1Destino'),
    lblPaso2Llegada: document.getElementById('lblPaso2Llegada'),
    lblPaso3Salida: document.getElementById('lblPaso3Salida'),
    lblPaso4Ventana: document.getElementById('lblPaso4Ventana'),

    selPuntoLunar: document.getElementById('selPuntoLunar'),
    inpFechaInicio: document.getElementById('inpFechaInicio'),
    inpFechaFin: document.getElementById('inpFechaFin'),
    inpIntervaloN: document.getElementById('inpIntervaloN'),
    inpMargenN: document.getElementById('inpMargenN'),
    lblPerfilesRapidos: document.getElementById('lblPerfilesRapidos'),
    btnPresetSol: document.getElementById('btnPresetSol'),
    btnPresetTierra: document.getElementById('btnPresetTierra'),
    btnPresetHielo: document.getElementById('btnPresetHielo'),
    btnPresetEquilibrado: document.getElementById('btnPresetEquilibrado'),

    drawerMapaPoloSur2D: document.getElementById('drawerMapaPoloSur2D'),
    lblSumarioMapa2D: document.getElementById('lblSumarioMapa2D'),
    lblTituloPanelMapa2D: document.getElementById('lblTituloPanelMapa2D'),
    lblExplicacionMapa2D: document.getElementById('lblExplicacionMapa2D'),
    canvasMapaPoloSur2D: document.getElementById('canvasMapaPoloSur2D'),
    lblHoverMapa2D: document.getElementById('lblHoverMapa2D'),
    chkMapaFotoReal: document.getElementById('chkMapaFotoReal'),
    chkMapaCrateres: document.getElementById('chkMapaCrateres'),
    chkMapaSitios: document.getElementById('chkMapaSitios'),
    selTipoFotoMapa2D: document.getElementById('selTipoFotoMapa2D'),
    txtZonaMapa2DSeleccionada: document.getElementById('txtZonaMapa2DSeleccionada'),
    subZonaMapa2DCoords: document.getElementById('subZonaMapa2DCoords'),
    inpLatitud: document.getElementById('inpLatitud'),
    inpLongitud: document.getElementById('inpLongitud'),
    inpMapaX: document.getElementById('inpMapaX'),
    inpMapaY: document.getElementById('inpMapaY'),
    inpAltitud: document.getElementById('inpAltitud'),
    inpEsfRadioKm: document.getElementById('inpEsfRadioKm'),
    inpEsfThetaDeg: document.getElementById('inpEsfThetaDeg'),
    inpEsfPhiDeg: document.getElementById('inpEsfPhiDeg'),
    lblVectorCartesiano3D: document.getElementById('lblVectorCartesiano3D'),
    btnBuscarMision: document.getElementById('btnBuscarMision'),

    lblCabeceraFiltros: document.getElementById('lblCabeceraFiltros'),
    lblTituloFiltroIlu: document.getElementById('lblTituloFiltroIlu'),
    lblDescFiltroIlu: document.getElementById('lblDescFiltroIlu'),
    lblSliderIluTexto: document.getElementById('lblSliderIluTexto'),
    rngFiltroIlu: document.getElementById('rngFiltroIlu'),
    lblFiltroIlu: document.getElementById('lblFiltroIlu'),
    rngFiltroElSol: document.getElementById('rngFiltroElSol'),
    lblFiltroElSol: document.getElementById('lblFiltroElSol'),

    lblTituloFiltroCom: document.getElementById('lblTituloFiltroCom'),
    lblDescFiltroCom: document.getElementById('lblDescFiltroCom'),
    lblSliderComTexto: document.getElementById('lblSliderComTexto'),
    rngFiltroCom: document.getElementById('rngFiltroCom'),
    lblFiltroCom: document.getElementById('lblFiltroCom'),
    rngFiltroElTie: document.getElementById('rngFiltroElTie'),
    lblFiltroElTie: document.getElementById('lblFiltroElTie'),
    lblModoEnlaceTexto: document.getElementById('lblModoEnlaceTexto'),
    selModoEnlace: document.getElementById('selModoEnlace'),

    lblTituloFiltroTerreno: document.getElementById('lblTituloFiltroTerreno'),
    lblSliderPendTexto: document.getElementById('lblSliderPendTexto'),
    rngFiltroPend: document.getElementById('rngFiltroPend'),
    lblFiltroPend: document.getElementById('lblFiltroPend'),
    lblPrioridadTexto: document.getElementById('lblPrioridadTexto'),
    selPrioridad: document.getElementById('selPrioridad'),
    btnAplicarFiltros: document.getElementById('btnAplicarFiltros'),

    // Controles de Ingeniería (Barra Lateral + Consola Directa en Modo Avanzado)
    drawerIngenieriaProf: document.getElementById('drawerIngenieriaProf'),
    selPasoHorasProf: document.getElementById('selPasoHorasProf'),
    selBandaComProf: document.getElementById('selBandaComProf'),
    inpAlturaMastilProf: document.getElementById('inpAlturaMastilProf'),
    inpAreaPanelesProf: document.getElementById('inpAreaPanelesProf'),
    inpEficienciaSolarProf: document.getElementById('inpEficienciaSolarProf'),
    inpConsumoHabProf: document.getElementById('inpConsumoHabProf'),
    inpDiamAntenaProf: document.getElementById('inpDiamAntenaProf'),

    profLivePasoHoras: document.getElementById('profLivePasoHoras'),
    profLiveBandaCom: document.getElementById('profLiveBandaCom'),
    profLiveMastil: document.getElementById('profLiveMastil'),
    profLiveAreaPaneles: document.getElementById('profLiveAreaPaneles'),
    profLiveConsumoHab: document.getElementById('profLiveConsumoHab'),
    profLiveDiamAntena: document.getElementById('profLiveDiamAntena'),

    seccionResultadosPrincipal: document.getElementById('seccionResultadosPrincipal'),
    featuredResultCard: document.getElementById('featuredResultCard'),
    bannerResultadoModoBusqueda: document.getElementById('bannerResultadoModoBusqueda'),
    panelTopFechasRecomendadas: document.getElementById('panelTopFechasRecomendadas'),
    gridTopFechasRecomendadas: document.getElementById('gridTopFechasRecomendadas'),

    bridgeLuzPct: document.getElementById('bridgeLuzPct'),
    bridgeIrradKw: document.getElementById('bridgeIrradKw'),
    bridgeComPct: document.getElementById('bridgeComPct'),
    bridgeElevDeg: document.getElementById('bridgeElevDeg'),
    bridgeTempC: document.getElementById('bridgeTempC'),
    bridgeTempK: document.getElementById('bridgeTempK'),
    chkBridgePrecisa: document.getElementById('chkBridgePrecisa'),
    selBridgePaso: document.getElementById('selBridgePaso'),
    btnSaltoProDesdeBridge: document.getElementById('btnSaltoProDesdeBridge'),
    btnVolverNinoDesdeBridge: document.getElementById('btnVolverNinoDesdeBridge'),

    imgFeaturedPunto: document.getElementById('imgFeaturedPunto'),
    lblFeaturedPhotoCredit: document.getElementById('lblFeaturedPhotoCredit'),
    badgeCumplimiento: document.getElementById('badgeCumplimiento'),
    tituloPuntoEvaluado: document.getElementById('tituloPuntoEvaluado'),
    txtResumenHumanoLugar: document.getElementById('txtResumenHumanoLugar'),
    subtituloCoordsPunto: document.getElementById('subtituloCoordsPunto'),
    txtValoracionPunto: document.getElementById('txtValoracionPunto'),
    lblSubScoreTexto: document.getElementById('lblSubScoreTexto'),
    numScorePunto: document.getElementById('numScorePunto'),
    tituloBannerVentana: document.getElementById('tituloBannerVentana'),
    txtResumenVentanaOptima: document.getElementById('txtResumenVentanaOptima'),

    lblKpiIluTitulo: document.getElementById('lblKpiIluTitulo'),
    kpiVentanaIlu: document.getElementById('kpiVentanaIlu'),
    subKpiIlu: document.getElementById('subKpiIlu'),

    lblKpiComTitulo: document.getElementById('lblKpiComTitulo'),
    kpiVentanaCom: document.getElementById('kpiVentanaCom'),
    subKpiCom: document.getElementById('subKpiCom'),

    lblKpiSolTitulo: document.getElementById('lblKpiSolTitulo'),
    kpiVentanaSol: document.getElementById('kpiVentanaSol'),
    subKpiSol: document.getElementById('subKpiSol'),

    lblKpiTempTitulo: document.getElementById('lblKpiTempTitulo'),
    kpiVentanaTie: document.getElementById('kpiVentanaTie'),
    subKpiTemp: document.getElementById('subKpiTemp'),

    profKpiPotencia: document.getElementById('profKpiPotencia'),
    profSubPotencia: document.getElementById('profSubPotencia'),
    profKpiEnergia: document.getElementById('profKpiEnergia'),
    profSubEnergia: document.getElementById('profSubEnergia'),
    profKpiIrradiancia: document.getElementById('profKpiIrradiancia'),
    profSubIrradiancia: document.getElementById('profSubIrradiancia'),
    profKpiEnlace: document.getElementById('profKpiEnlace'),
    profSubEnlace: document.getElementById('profSubEnlace'),
    profKpiBateriaNoche: document.getElementById('profKpiBateriaNoche'),
    profSubBateriaNoche: document.getElementById('profSubBateriaNoche'),
    profKpiRadiacion: document.getElementById('profKpiRadiacion'),
    profSubRadiacion: document.getElementById('profSubRadiacion'),
    profKpiTermico: document.getElementById('profKpiTermico'),
    profSubTermico: document.getElementById('profSubTermico'),
    profKpiDeltaV: document.getElementById('profKpiDeltaV'),
    profSubDeltaV: document.getElementById('profSubDeltaV'),
    btnExportarCsvProf: document.getElementById('btnExportarCsvProf'),
    btnExportarJsonProf: document.getElementById('btnExportarJsonProf'),

    drawerGraficaTemporal: document.getElementById('drawerGraficaTemporal'),
    lblSumarioGrafica: document.getElementById('lblSumarioGrafica'),
    btnModoGraficaTemp: document.getElementById('btnModoGraficaTemp'),
    btnModoGraficaPrecisa: document.getElementById('btnModoGraficaPrecisa'),
    btnModoGraficaEnergia: document.getElementById('btnModoGraficaEnergia'),
    btnModoGraficaPolar: document.getElementById('btnModoGraficaPolar'),
    chkSerieSol: document.getElementById('chkSerieSol'),
    chkSerieCom: document.getElementById('chkSerieCom'),
    chkSerieTemp: document.getElementById('chkSerieTemp'),
    chkSerieElev: document.getElementById('chkSerieElev'),
    lblRangoGrafica: document.getElementById('lblRangoGrafica'),
    canvasGrafica: document.getElementById('graficaTemporalCanvas'),
    chartHoverReadout: document.getElementById('chartHoverReadout'),
    lblTituloListaOfertas: document.getElementById('lblTituloListaOfertas'),
    lblSubListaOfertas: document.getElementById('lblSubListaOfertas'),
    listaOfertasBooking: document.getElementById('listaOfertasBooking'),

    drawerComparador: document.getElementById('drawerComparador'),
    selCompPuntoA: document.getElementById('selCompPuntoA'),
    selCompPuntoB: document.getElementById('selCompPuntoB'),
    inpCompIniA: document.getElementById('inpCompIniA'),
    inpCompFinA: document.getElementById('inpCompFinA'),
    inpCompIniB: document.getElementById('inpCompIniB'),
    inpCompFinB: document.getElementById('inpCompFinB'),
    chkMismoLugarFechas: document.getElementById('chkMismoLugarFechas'),
    btnEjecutarComparacion: document.getElementById('btnEjecutarComparacion'),
    bannerGanadorComp: document.getElementById('bannerGanadorComp'),
    thCompNombreA: document.getElementById('thCompNombreA'),
    thCompNombreB: document.getElementById('thCompNombreB'),
    tbodyComparador: document.getElementById('tbodyComparador'),

    appZoomRoot: document.getElementById('appZoomRoot'),
    rngLupaContinua: document.getElementById('rngLupaContinua'),
    lblLupaContinua: document.getElementById('lblLupaContinua'),
    btnLupaMenos: document.getElementById('btnLupaMenos'),
    btnLupaMas: document.getElementById('btnLupaMas'),
    btnLupaReset: document.getElementById('btnLupaReset'),
    lupaFloatingBar: document.getElementById('lupaFloatingBar'),
    rngLupaFlotante: document.getElementById('rngLupaFlotante'),
    lblLupaFlotante: document.getElementById('lblLupaFlotante'),
    btnLupaFlotanteReset: document.getElementById('btnLupaFlotanteReset'),
    btnModoLupaCursor: document.getElementById('btnModoLupaCursor'),
    rngZoomCursor: document.getElementById('rngZoomCursor'),
    lblZoomCursor: document.getElementById('lblZoomCursor'),
    cursorMagnifierLens: document.getElementById('cursorMagnifierLens'),
    cursorMagnifierContent: document.getElementById('cursorMagnifierContent'),
  };

  function aplicarZoomLupa(pct) {
    const val = Math.min(200, Math.max(100, Math.round(pct)));
    state.zoomLupaPct = val;
    if (els.appZoomRoot) {
      els.appZoomRoot.style.zoom = `${val}%`;
    }
    if (els.rngLupaContinua) els.rngLupaContinua.value = String(val);
    if (els.lblLupaContinua) els.lblLupaContinua.textContent = `${val}%`;
    if (els.rngLupaFlotante) els.rngLupaFlotante.value = String(val);
    if (els.lblLupaFlotante) els.lblLupaFlotante.textContent = `Lupa: ${val}%`;
    if (els.lupaFloatingBar) {
      els.lupaFloatingBar.classList.toggle('visible', val > 100);
    }
  }

  function quitarEmojisTexto(txt) {
    return txt
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+|\s+$/g, (m) => (m.includes('\n') ? m : ''));
  }

  function aplicarLimpiezaAutismo(activo) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let nodo;
    while ((nodo = walker.nextNode())) {
      const parent = nodo.parentElement;
      if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue;
      if (activo) {
        if (!state.textosOriginalesAutismo.has(nodo)) {
          state.textosOriginalesAutismo.set(nodo, nodo.nodeValue);
        }
        const orig = state.textosOriginalesAutismo.get(nodo);
        const limpio = quitarEmojisTexto(orig);
        if (nodo.nodeValue !== limpio) {
          nodo.nodeValue = limpio;
        }
      } else if (state.textosOriginalesAutismo.has(nodo)) {
        nodo.nodeValue = state.textosOriginalesAutismo.get(nodo);
      }
    }
  }

  const TDAH_KEYWORDS_REGEX = /\b(Polo Sur|Shackleton|Malapert|Haworth|De Gerlache|Faustini|Shoemaker|Nobile|Iluminaci[oó]n|Comunicaci[oó]n|Pendiente|Temperatura|Energ[ií]a|DTE|Rel[eé]|Reservar|Comparar|Puntuaci[oó]n|Nota|[ÓO]ptimo|Sol|Tierra|Hielo|Cr[aá]ter(?:es)?|NASA|Artemis|LRO|Apollo|Latitud|Longitud|Bater[ií]a|Paneles|Sombra|Filtro|Lupa)\b/gi;

  function limpiarPalabrasClaveTdah() {
    document.querySelectorAll('span.tdah-kw').forEach((span) => {
      const parent = span.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(span.textContent || ''), span);
      parent.normalize();
    });
  }

  function aplicarPalabrasClaveTdah(activo) {
    limpiarPalabrasClaveTdah();
    if (!activo || !els.appZoomRoot) return;
    const walker = document.createTreeWalker(els.appZoomRoot, NodeFilter.SHOW_TEXT, null);
    const nodos = [];
    let nodo;
    while ((nodo = walker.nextNode())) {
      const p = nodo.parentElement;
      if (!p) continue;
      const tag = p.tagName;
      if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'STRONG', 'B'].includes(tag)) continue;
      if (p.closest('.tdah-kw, .status-dot')) continue;
      if (TDAH_KEYWORDS_REGEX.test(nodo.nodeValue || '')) {
        nodos.push(nodo);
      }
      TDAH_KEYWORDS_REGEX.lastIndex = 0;
    }
    nodos.forEach((n) => {
      const texto = n.nodeValue || '';
      TDAH_KEYWORDS_REGEX.lastIndex = 0;
      let lastIdx = 0;
      const frag = document.createDocumentFragment();
      let m;
      while ((m = TDAH_KEYWORDS_REGEX.exec(texto)) !== null) {
        if (m.index > lastIdx) {
          frag.appendChild(document.createTextNode(texto.slice(lastIdx, m.index)));
        }
        const span = document.createElement('span');
        span.className = 'tdah-kw';
        span.textContent = m[0];
        frag.appendChild(span);
        lastIdx = m.index + m[0].length;
      }
      if (lastIdx < texto.length) {
        frag.appendChild(document.createTextNode(texto.slice(lastIdx)));
      }
      if (n.parentNode) {
        n.parentNode.replaceChild(frag, n);
      }
    });
  }

  let lupaShadowRoot = null;
  let lupaShadowBodyMirror = null;
  let lupaShadowContent = null;
  let lupaShadowStyleEl = null;

  function asegurarShadowLupaCursor() {
    if (!els.cursorMagnifierLens) return false;
    if (!lupaShadowRoot) {
      lupaShadowRoot = els.cursorMagnifierLens.attachShadow({ mode: 'open' });
      lupaShadowStyleEl = document.createElement('style');
      const cssBase = Array.from(document.querySelectorAll('head style'))
        .map((s) => s.textContent || '')
        .join('\n')
        .replace(/\bbody\b/g, '.lupa-body-mirror');
      lupaShadowStyleEl.textContent = cssBase + `
        :host { all: initial; }
        .lupa-body-mirror {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          background-color: var(--bg-page);
          color: var(--text-main);
        }
        #cursorMagnifierContent {
          position: absolute;
          top: 0;
          left: 0;
          transform-origin: 0 0;
          pointer-events: none;
          will-change: transform;
        }
        #cursorMagnifierLens, #lupaFloatingBar, #tdahFocusBar { display: none !important; }
      `;
      lupaShadowBodyMirror = document.createElement('div');
      lupaShadowBodyMirror.className = `lupa-body-mirror ${document.body.className}`;
      lupaShadowContent = document.createElement('div');
      lupaShadowContent.id = 'cursorMagnifierContent';
      lupaShadowBodyMirror.appendChild(lupaShadowContent);
      lupaShadowRoot.appendChild(lupaShadowStyleEl);
      lupaShadowRoot.appendChild(lupaShadowBodyMirror);
    }
    return true;
  }

  function reconstruirClonLupaCursor() {
    if (!state.lupaCursorActiva || !els.appZoomRoot || !asegurarShadowLupaCursor()) return;
    lupaShadowBodyMirror.className = `lupa-body-mirror ${document.body.className}`;

    const zoomGen = (state.zoomLupaPct || 100) / 100;
    const rootRect = els.appZoomRoot.getBoundingClientRect();

    const clon = els.appZoomRoot.cloneNode(true);
    clon.style.zoom = '100%';
    clon.style.width = `${els.appZoomRoot.offsetWidth}px`;

    // Sincronizar posición exacta de elementos fijos dentro de appZoomRoot (como el panel izquierdo de adaptaciones)
    const origWrapper = els.appZoomRoot.querySelector('.a11y-drawer-wrapper');
    const clonWrapper = clon.querySelector('.a11y-drawer-wrapper');
    if (origWrapper && clonWrapper) {
      const wRect = origWrapper.getBoundingClientRect();
      clonWrapper.style.position = 'absolute';
      clonWrapper.style.left = `${(wRect.left - rootRect.left) / zoomGen}px`;
      clonWrapper.style.top = `${(wRect.top - rootRect.top) / zoomGen}px`;
      clonWrapper.style.right = 'auto';
      clonWrapper.style.bottom = 'auto';
      clonWrapper.style.margin = '0';
    }

    const origPanel = els.panelAdaptaciones;
    const clonPanel = clon.querySelector('#panelAdaptaciones');
    if (origPanel && clonPanel && origPanel.open) {
      clonPanel.scrollTop = origPanel.scrollTop;
    }

    const origInputs = els.appZoomRoot.querySelectorAll('input, select, textarea');
    const clonInputs = clon.querySelectorAll('input, select, textarea');
    origInputs.forEach((orig, idx) => {
      const dst = clonInputs[idx];
      if (!dst) return;
      if (orig.tagName === 'SELECT') dst.selectedIndex = orig.selectedIndex;
      else if (orig.type === 'checkbox' || orig.type === 'radio') dst.checked = orig.checked;
      else dst.value = orig.value;
    });

    const origCanvases = els.appZoomRoot.querySelectorAll('canvas');
    const clonCanvases = clon.querySelectorAll('canvas');
    origCanvases.forEach((origC, idx) => {
      const dstC = clonCanvases[idx];
      if (!dstC || origC.width === 0 || origC.height === 0) return;
      try {
        dstC.width = origC.width;
        dstC.height = origC.height;
        const ctx = dstC.getContext('2d');
        if (ctx) ctx.drawImage(origC, 0, 0);
      } catch (_) {}
    });

    lupaShadowContent.innerHTML = '';
    lupaShadowContent.appendChild(clon);
    if (origPanel && clonPanel && origPanel.open) {
      clonPanel.scrollTop = origPanel.scrollTop;
    }
  }

  let cursorSyncRaf = null;
  function programarSyncLupaCursor() {
    if (!state.lupaCursorActiva) return;
    if (cursorSyncRaf) cancelAnimationFrame(cursorSyncRaf);
    cursorSyncRaf = requestAnimationFrame(() => {
      cursorSyncRaf = null;
      reconstruirClonLupaCursor();
      if (state.ultimoCursorPos) {
        actualizarPosicionLupaCursor(state.ultimoCursorPos.x, state.ultimoCursorPos.y);
      }
    });
  }

  function actualizarPosicionLupaCursor(clientX, clientY) {
    if (!state.lupaCursorActiva || !els.cursorMagnifierLens || !lupaShadowContent || !els.appZoomRoot) return;
    const radio = 105;
    const factor = state.zoomCursorFactor || 2.0;
    const zoomGen = (state.zoomLupaPct || 100) / 100;
    const rect = els.appZoomRoot.getBoundingClientRect();
    const relX = (clientX - rect.left) / zoomGen;
    const relY = (clientY - rect.top) / zoomGen;

    els.cursorMagnifierLens.hidden = false;
    els.cursorMagnifierLens.style.left = `${Math.round(clientX - radio)}px`;
    els.cursorMagnifierLens.style.top = `${Math.round(clientY - radio)}px`;
    lupaShadowContent.style.transform = `translate3d(${radio - relX * factor}px, ${radio - relY * factor}px, 0) scale(${factor})`;
  }

  function toggleLupaCursor(activo) {
    state.lupaCursorActiva = Boolean(activo);
    if (els.btnModoLupaCursor) {
      els.btnModoLupaCursor.classList.toggle('active', state.lupaCursorActiva);
      const dot = els.btnModoLupaCursor.querySelector('.status-dot');
      if (dot) dot.textContent = state.lupaCursorActiva ? 'Activado' : 'Desactivado';
    }
    if (els.cursorMagnifierLens) {
      els.cursorMagnifierLens.hidden = !state.lupaCursorActiva;
    }
    if (state.lupaCursorActiva) {
      reconstruirClonLupaCursor();
      if (state.ultimoCursorPos) {
        actualizarPosicionLupaCursor(state.ultimoCursorPos.x, state.ultimoCursorPos.y);
      }
    }
  }

  function obtenerNombrePuntoSegunModo(idPunto, nombreFallback) {
    const ref = CATALOGO_RESPALDO.find((x) => x.id === idPunto);
    if (!ref) {
      if (state.nivelConocimiento === 'estudiante') {
        return '🎯 Mi Punto Elegido en la Foto de la Luna';
      }
      return nombreFallback || 'Zona Única Seleccionada en Mapa 2D (Polo Sur)';
    }
    if (state.nivelConocimiento === 'estudiante') return ref.nombre_nino;
    if (state.nivelConocimiento === 'profesional') return ref.nombre_prof;
    return ref.nombre_estandar;
  }

  function obtenerDescripcionPuntoSegunModo(idPunto, descFallback) {
    const ref = CATALOGO_RESPALDO.find((x) => x.id === idPunto);
    if (!ref) {
      if (state.nivelConocimiento === 'estudiante') {
        return 'Has elegido este rincón directamente pinchando sobre la foto real del Polo Sur de la Luna.';
      }
      return descFallback || 'Zona específica del Polo Sur Lunar seleccionada sobre la fotografía real de la Luna.';
    }
    if (state.nivelConocimiento === 'estudiante') return ref.explicacion_estudiante;
    if (state.nivelConocimiento === 'profesional') return ref.descripcion_prof;
    return ref.descripcion;
  }

  // ==========================================================================
  // CONVERSIÓN DE COORDENADAS DEL POLO SUR LUNAR (IAU2000::30120)
  // ==========================================================================
  function latLonToStereographic(latDeg, lonDeg) {
    const R = 1737400.0;
    const latClamped = Math.min(-80.0, Math.max(-90.0, latDeg));
    const colatRad = Math.max(0.0, ((90.0 + latClamped) * Math.PI) / 180.0);
    const rho = 2.0 * R * Math.tan(colatRad * 0.5);
    const lonRad = (lonDeg * Math.PI) / 180.0;
    return [rho * Math.sin(lonRad), rho * Math.cos(lonRad)];
  }

  function stereographicToLatLon(xm, ym) {
    const R = 1737400.0;
    const rho = Math.hypot(xm, ym);
    if (rho < 1e-6) return [-90.0, 0.0];
    const colatRad = 2.0 * Math.atan(rho / (2.0 * R));
    const latDeg = Math.min(-80.0, -(90.0 - (colatRad * 180.0) / Math.PI));
    const lonDeg = (Math.atan2(xm, ym) * 180.0) / Math.PI;
    return [latDeg, lonDeg];
  }

  function selenograficasAEsfericas(latDeg, lonDeg, altM) {
    const R = 1737400.0;
    const rKm = (R + (altM || 0)) / 1000.0;
    const thetaDeg = 90.0 - latDeg;
    let phiDeg = lonDeg % 360.0;
    if (phiDeg < 0) phiDeg += 360.0;
    return { rKm, thetaDeg, phiDeg };
  }

  function esfericasASelenograficas(rKm, thetaDeg, phiDeg) {
    const R = 1737400.0;
    const thetaClamped = Math.max(170.0, Math.min(180.0, thetaDeg));
    const latDeg = 90.0 - thetaClamped;
    let phiNorm = phiDeg % 360.0;
    if (phiNorm < 0) phiNorm += 360.0;
    const lonDeg = phiNorm > 180.0 ? phiNorm - 360.0 : phiNorm;
    const altM = rKm * 1000.0 - R;
    return { latDeg, lonDeg, altM };
  }

  function esfericasACartesianas3D(rKm, thetaDeg, phiDeg) {
    const th = (thetaDeg * Math.PI) / 180.0;
    const ph = (phiDeg * Math.PI) / 180.0;
    return {
      x: rKm * Math.sin(th) * Math.cos(ph),
      y: rKm * Math.sin(th) * Math.sin(ph),
      z: rKm * Math.cos(th),
    };
  }

  function actualizarVectorYEsfericasUI(latDeg, lonDeg, altM) {
    const esf = selenograficasAEsfericas(latDeg, lonDeg, altM);
    if (els.inpEsfRadioKm) els.inpEsfRadioKm.value = esf.rKm.toFixed(3);
    if (els.inpEsfThetaDeg) els.inpEsfThetaDeg.value = esf.thetaDeg.toFixed(2);
    if (els.inpEsfPhiDeg) els.inpEsfPhiDeg.value = esf.phiDeg.toFixed(1);
    if (els.lblVectorCartesiano3D) {
      const vec = esfericasACartesianas3D(esf.rKm, esf.thetaDeg, esf.phiDeg);
      const psiSur = Math.max(0, 180.0 - esf.thetaDeg);
      els.lblVectorCartesiano3D.textContent =
        `Vector 3D MCMF: (${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)}) km | Ángulo Polo Sur ψ = ${psiSur.toFixed(2)}°`;
    }
  }

  function estimarAltitudPoloSur(xm, ym) {
    const xKm = xm / 1000.0;
    const yKm = ym / 1000.0;
    if (Math.hypot(xKm - 0, yKm - 122.8) < 22) return 4500;
    if (Math.hypot(xKm - 73.8, yKm - 118.1) < 25) return 3650;
    for (const c of CRATERES_MAPA_POLO_SUR) {
      const dist = Math.hypot(xKm - c.xKm, yKm - c.yKm);
      if (dist < c.rKm * 0.72) return -1350;
      if (dist <= c.rKm * 1.22) return 2150;
    }
    return 1450;
  }

  // ==========================================================================
  // MAPA 2D INTERACTIVO DEL POLO SUR CON FOTOGRAFÍA REAL DE LA PROPIA LUNA
  // ==========================================================================
  const MAX_RADIO_MAPA_KM = 175.0;

  function dibujarMapaPoloSur2D() {
    const canvas = els.canvasMapaPoloSur2D;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radioPx = (w / 2) - 16;
    const kmToPx = (km) => (km / MAX_RADIO_MAPA_KM) * radioPx;

    ctx.fillStyle = '#04112B';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radioPx, 0, Math.PI * 2);
    ctx.clip();

    const usarFotoReal = els.chkMapaFotoReal ? els.chkMapaFotoReal.checked : true;
    const tipoFoto = els.selTipoFotoMapa2D ? els.selTipoFotoMapa2D.value : 'LROC';
    const imgObj = tipoFoto === 'CLEMENTINE' && imgMapaClementineCargada ? imgMapaClementine : imgMapaLroc;
    const imgLista = tipoFoto === 'CLEMENTINE' ? imgMapaClementineCargada : imgMapaLrocCargada;

    if (usarFotoReal && imgLista) {
      ctx.drawImage(imgObj, cx - radioPx, cy - radioPx, radioPx * 2, radioPx * 2);
      const tintGrad = ctx.createRadialGradient(cx, cy, radioPx * 0.15, cx, cy, radioPx);
      tintGrad.addColorStop(0, 'rgba(6, 31, 74, 0.08)');
      tintGrad.addColorStop(0.75, 'rgba(6, 31, 74, 0.22)');
      tintGrad.addColorStop(1, 'rgba(4, 17, 43, 0.55)');
      ctx.fillStyle = tintGrad;
      ctx.fillRect(cx - radioPx, cy - radioPx, radioPx * 2, radioPx * 2);
    } else {
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radioPx);
      grad.addColorStop(0, '#1B365D');
      grad.addColorStop(0.55, '#0B2548');
      grad.addColorStop(1, '#061A38');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - radioPx, cy - radioPx, radioPx * 2, radioPx * 2);
    }

    const mostrarCrateres = els.chkMapaCrateres ? els.chkMapaCrateres.checked : true;
    if (mostrarCrateres) {
      ctx.strokeStyle = 'rgba(220, 228, 239, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radioPx);
      ctx.lineTo(cx, cy + radioPx);
      ctx.moveTo(cx - radioPx, cy);
      ctx.lineTo(cx + radioPx, cy);
      ctx.stroke();

      [89, 88, 86, 84.5].forEach((latAbs) => {
        const [xm, ym] = latLonToStereographic(-latAbs, 0);
        const rAnilloPx = kmToPx(Math.hypot(xm, ym) / 1000.0);
        if (rAnilloPx <= radioPx) {
          ctx.strokeStyle = 'rgba(220, 228, 239, 0.38)';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(cx, cy, rAnilloPx, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          if (state.nivelConocimiento !== 'estudiante') {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 9.5px Consolas, monospace';
            ctx.fillText(`${latAbs}°S`, cx + 4, cy + rAnilloPx - 3);
          }
        }
      });

      CRATERES_MAPA_POLO_SUR.forEach((c) => {
        const px = cx + kmToPx(c.xKm);
        const py = cy - kmToPx(c.yKm);
        const rPx = Math.max(5, kmToPx(c.rKm));

        ctx.fillStyle = c.psr ? 'rgba(4, 17, 43, 0.38)' : 'rgba(6, 31, 74, 0.22)';
        ctx.beginPath();
        ctx.arc(px, py, rPx, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(220, 228, 239, 0.78)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(px, py, rPx, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px Segoe UI, sans-serif';
        ctx.fillText(c.nombre, px - rPx * 0.55, py + rPx + 10);
      });
    }

    const mostrarSitios = els.chkMapaSitios ? els.chkMapaSitios.checked : true;
    if (mostrarSitios) {
      state.catalogo.forEach((p) => {
        const px = cx + kmToPx(p.x_mapa_m / 1000.0);
        const py = cy - kmToPx(p.y_mapa_m / 1000.0);
        ctx.fillStyle = '#105BD8';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    if (state.hoverMapaPx) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.3;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(state.hoverMapaPx.x, state.hoverMapaPx.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const xSelKm = (parseFloat(els.inpMapaX.value || '2940') || 0) / 1000.0;
    const ySelKm = (parseFloat(els.inpMapaY.value || '-5890') || 0) / 1000.0;
    const selPx = cx + kmToPx(xSelKm);
    const selPy = cy - kmToPx(ySelKm);

    ctx.save();
    ctx.strokeStyle = '#FC3D21';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(selPx, selPy, 10.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(selPx - 15, selPy);
    ctx.lineTo(selPx + 15, selPy);
    ctx.moveTo(selPx, selPy - 15);
    ctx.lineTo(selPx, selPy + 15);
    ctx.stroke();

    ctx.fillStyle = '#FC3D21';
    ctx.beginPath();
    ctx.arc(selPx, selPy, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    ctx.strokeStyle = '#4773AA';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, radioPx, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px Segoe UI, sans-serif';
    ctx.fillText('0° Hacia la Tierra ↑', cx - 48, 12);
    ctx.fillText('180° Cara Oculta ↓', cx - 44, h - 4);
  }

  function actualizarHoverMapa2D(ev) {
    const canvas = els.canvasMapaPoloSur2D;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const xPx = (ev.clientX - rect.left) * scaleX;
    const yPx = (ev.clientY - rect.top) * scaleY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radioPx = (canvas.width / 2) - 16;
    const dxPx = xPx - cx;
    const dyPx = cy - yPx;
    const distPx = Math.hypot(dxPx, dyPx);

    if (distPx <= radioPx) {
      state.hoverMapaPx = { x: xPx, y: yPx };
      const xKm = (dxPx / radioPx) * MAX_RADIO_MAPA_KM;
      const yKm = (dyPx / radioPx) * MAX_RADIO_MAPA_KM;
      const [lat, lon] = stereographicToLatLon(xKm * 1000.0, yKm * 1000.0);

      let refNombre = 'Montañas y Llanuras del Polo Sur';
      for (const c of CRATERES_MAPA_POLO_SUR) {
        if (Math.hypot(xKm - c.xKm, yKm - c.yKm) <= c.rKm * 1.15) {
          refNombre = `Cráter ${c.nombre}`;
          break;
        }
      }
      if (els.lblHoverMapa2D) {
        els.lblHoverMapa2D.textContent =
          state.nivelConocimiento === 'estudiante'
            ? `Estás apuntando a: ${refNombre} (Haz clic para viajar aquí)`
            : `Cursor: ${lat.toFixed(2)}°S, ${lon.toFixed(1)}° (${refNombre})`;
      }
      dibujarMapaPoloSur2D();
    }
  }

  function seleccionarPuntoDesdeClickMapa2D(ev) {
    const canvas = els.canvasMapaPoloSur2D;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (ev.clientX - rect.left) * scaleX;
    const clickY = (ev.clientY - rect.top) * scaleY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radioPx = (canvas.width / 2) - 16;

    let dxPx = clickX - cx;
    let dyPx = cy - clickY;
    const distPx = Math.hypot(dxPx, dyPx);
    if (distPx > radioPx) {
      dxPx = (dxPx / distPx) * radioPx;
      dyPx = (dyPx / distPx) * radioPx;
    }

    const xKmClick = (dxPx / radioPx) * MAX_RADIO_MAPA_KM;
    const yKmClick = (dyPx / radioPx) * MAX_RADIO_MAPA_KM;

    let sitioCercano = null;
    let menorDistPx = 11.0;
    state.catalogo.forEach((p) => {
      const px = cx + ((p.x_mapa_m / 1000.0) / MAX_RADIO_MAPA_KM) * radioPx;
      const py = cy - ((p.y_mapa_m / 1000.0) / MAX_RADIO_MAPA_KM) * radioPx;
      const d = Math.hypot(clickX - px, clickY - py);
      if (d < menorDistPx) {
        menorDistPx = d;
        sitioCercano = p;
      }
    });

    if (sitioCercano) {
      els.selPuntoLunar.value = sitioCercano.id;
      sincronizarInputsPuntoSeleccionado();
    } else {
      const xm = Math.round(xKmClick * 1000.0);
      const ym = Math.round(yKmClick * 1000.0);
      const [lat, lon] = stereographicToLatLon(xm, ym);
      const alt = estimarAltitudPoloSur(xm, ym);

      state.tipoCoordActual = 'SELENOGRAFICA';
      els.selPuntoLunar.value = 'custom';
      els.inpMapaX.value = xm;
      els.inpMapaY.value = ym;
      els.inpLatitud.value = lat.toFixed(2);
      els.inpLongitud.value = lon.toFixed(2);
      els.inpAltitud.value = alt;
      actualizarVectorYEsfericasUI(lat, lon, alt);
      sincronizarModoIntentUI();

      if (els.txtZonaMapa2DSeleccionada) {
        els.txtZonaMapa2DSeleccionada.textContent =
          state.nivelConocimiento === 'estudiante'
            ? `🎯 Tu Punto Elegido en la Foto de la Luna (${alt > 0 ? 'Montaña Soleada' : 'Cráter Oscuro'})`
            : `🎯 Zona Única Seleccionada en la Luna (${lat.toFixed(2)}°S, ${lon.toFixed(1)}°)`;
      }
      if (els.subZonaMapa2DCoords) {
        els.subZonaMapa2DCoords.textContent =
          state.nivelConocimiento === 'estudiante'
            ? `Altura del suelo: ${alt} metros • ¡Calculando cuándo hace mejor tiempo aquí!`
            : `X: ${xm} m | Y: ${ym} m | Altitud estimada LOLA: ${alt} m`;
      }
    }

    dibujarMapaPoloSur2D();
    ejecutarBusqueda();
  }

  // ==========================================================================
  // MOTOR FÍSICO Y VENTANA ÓPTIMA EN JS (ESPEJO EXACTO DEL C++)
  // ==========================================================================
  function isoToDaysJ2000(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 9815.0;
    return (d.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000.0;
  }

  function daysJ2000ToIso(days) {
    const ms = Date.UTC(2000, 0, 1, 12, 0, 0) + days * 86400000.0;
    const d = new Date(ms);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  }

  function kelvinACelsiusTexto(k, modoEstudiante) {
    const c = k - 273.15;
    if (modoEstudiante) {
      const comp = c < -150 ? 'frío extremo en sombra' : c < -50 ? 'más frío que la Antártida' : 'templado por el Sol';
      return `${c.toFixed(0)} °C (${comp})`;
    }
    if (state.nivelConocimiento === 'profesional') {
      return `${k.toFixed(1)} K (${c.toFixed(1)} °C)`;
    }
    return `${c.toFixed(0)} °C (${k.toFixed(0)} K)`;
  }

  function calcularMascaraHorizontePolarJs(punto, azimutDeg, alturaMastilM) {
    const azRad = (azimutDeg * Math.PI) / 180.0;
    const semillaLon = (punto.longitud_deg * Math.PI) / 180.0 + punto.x_mapa_m * 0.00003;

    const ondCrestas =
      1.15 * Math.sin(azRad + semillaLon) +
      0.85 * Math.cos(2.0 * azRad - semillaLon * 0.7) +
      0.55 * Math.sin(3.0 * azRad + punto.y_mapa_m * 0.00004) +
      0.35 * Math.cos(5.0 * azRad + semillaLon * 1.3) +
      0.22 * Math.sin(9.0 * azRad - semillaLon * 2.1);

    const altBaseM = punto.altitud_m - alturaMastilM;
    let sesgoTerrenoDeg = 0.0;
    if (altBaseM < 0.0) {
      sesgoTerrenoDeg = 2.8 + (Math.abs(altBaseM) / 1000.0) * 1.4;
    } else {
      sesgoTerrenoDeg = 0.85 - Math.min(2.1, 0.92 * Math.sqrt(altBaseM / 1000.0));
    }

    const despejeMastilDeg = 0.24 * Math.sqrt(Math.max(0.0, alturaMastilM));
    return sesgoTerrenoDeg + ondCrestas - despejeMastilDeg;
  }

  function evaluarLocalEnJs(puntoBase, fechas, filtros) {
    const mastilM = filtros.altura_mastil_m || 0.0;
    const punto = { ...puntoBase, altitud_m: (puntoBase.altitud_m || 0) + mastilM };

    const dIni = isoToDaysJ2000(fechas.fecha_inicio);
    let dFin = isoToDaysJ2000(fechas.fecha_fin);
    if (dFin <= dIni) dFin = dIni + 14.0;

    const pasoH = Math.max(0.25, fechas.paso_horas || 6.0);
    const pasoDias = pasoH / 24.0;
    const totalPasos = Math.min(3000, Math.max(2, Math.round((dFin - dIni) / pasoDias) + 1));

    const serie = [];
    let sumIlu = 0;
    let sumCom = 0;
    let sumElTie = 0;
    let sumTemp = 0;
    let sumPot = 0;
    let maxElSol = -90;
    let minElSol = 90;

    const rKm = Math.hypot(punto.x_mapa_m, punto.y_mapa_m) / 1000.0;
    const pendDeg = rKm < 25.0 ? 7.5 : 4.2 + (Math.abs(punto.latitud_deg * 3.7 + punto.longitud_deg * 0.13) % 11.5);

    const capBatNominalKwh = 120.0;
    let energiaBatKwh = capBatNominalKwh * 0.85;
    let minSocPct = 100.0;

    for (let k = 0; k < totalPasos; k++) {
      const dAct = dIni + k * pasoDias;
      const lonSub = ((dAct / 29.530589) % 1.0) * 2.0 * Math.PI;
      const latSubDeg = 1.5424 * Math.sin((dAct * 2.0 * Math.PI) / 346.62);

      const latRad = (punto.latitud_deg * Math.PI) / 180.0;
      const lonRad = (punto.longitud_deg * Math.PI) / 180.0;
      const decRad = (latSubDeg * Math.PI) / 180.0;
      const haRad = lonRad - lonSub;

      const sinEl = Math.max(
        -1.0,
        Math.min(1.0, Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad))
      );
      const elGeom = (Math.asin(sinEl) * 180.0) / Math.PI;

      const yAz = -Math.sin(haRad) * Math.cos(decRad);
      const xAz = Math.sin(decRad) * Math.cos(latRad) - Math.cos(decRad) * Math.sin(latRad) * Math.cos(haRad);
      let azSolDeg = (Math.atan2(yAz, xAz) * 180.0) / Math.PI;
      if (azSolDeg < 0) azSolDeg += 360.0;

      const horizTopoDeg = calcularMascaraHorizontePolarJs(punto, azSolDeg, mastilM);
      const elSol = elGeom - horizTopoDeg;

      const SEMI_DISCO = 0.55;
      let iluPct = 0.0;
      if (elSol >= SEMI_DISCO) {
        const bonusAlt = Math.min(12.0, Math.max(0.0, (elSol - SEMI_DISCO) * 4.5));
        iluPct = Math.min(100.0, 88.0 + bonusAlt);
      } else if (elSol <= -SEMI_DISCO) {
        iluPct = Math.max(0.0, 12.0 + (elSol + SEMI_DISCO) * 8.0);
      } else {
        const t = (elSol + SEMI_DISCO) / (2.0 * SEMI_DISCO);
        iluPct = 12.0 + t * 76.0;
      }

      const angIncDeg = Math.max(1.5, elGeom - horizTopoDeg * 0.5 + 3.5);
      const factorInc = Math.sin((angIncDeg * Math.PI) / 180.0);
      const irradianciaWm2 = 1361.0 * (iluPct / 100.0) * Math.max(0.14, Math.min(1.0, factorInc * 3.2));

      const libLat = -6.68 * Math.sin((dAct * 2.0 * Math.PI) / 27.2122) - 0.45 * Math.cos(dAct * 2.0 * Math.PI);
      const libLon = 7.9 * Math.sin((dAct * 2.0 * Math.PI) / 27.55455);
      const lonTieRad = ((punto.longitud_deg - libLon) * Math.PI) / 180.0;
      const subTieRad = (libLat * Math.PI) / 180.0;
      const sinElTie = Math.max(
        -1.0,
        Math.min(1.0, Math.sin(latRad) * Math.sin(subTieRad) + Math.cos(latRad) * Math.cos(subTieRad) * Math.cos(lonTieRad))
      );
      const altBaseM = punto.altitud_m - mastilM;
      const bonusAltTie = altBaseM > 0
        ? 1.45 * Math.sqrt(altBaseM / 1000.0)
        : -0.45 * (Math.abs(altBaseM) / 1000.0);
      const bonusMastilTie = 0.22 * Math.sqrt(Math.max(0.0, mastilM));
      const elTie = (Math.asin(sinElTie) * 180.0) / Math.PI + bonusAltTie + bonusMastilTie;

      const bonusAntenaPct = ((filtros.diam_antena_m || 1.2) - 1.2) * 8.5;
      let penBandaDeg = 0.0;
      if (filtros.banda_com === 'S') penBandaDeg = -0.8;
      else if (filtros.banda_com === 'KA') penBandaDeg = 0.9;
      else if (filtros.banda_com === 'LASER') penBandaDeg = 1.6;

      const elEfDte = elTie - penBandaDeg;
      let comDte = 0.0;
      if (elEfDte >= 4.5) comDte = 100.0;
      else if (elEfDte <= -2.5) comDte = 0.0;
      else comDte = ((elEfDte + 2.5) / 7.0) * 100.0;
      comDte = Math.max(0.0, Math.min(100.0, comDte + bonusAntenaPct));

      const faseRele = 0.5 + 0.5 * Math.sin((dAct * 2.0 * Math.PI) / 0.5 + lonRad);
      const baseRele = filtros.banda_com === 'LASER' ? 82.0 : 74.0;
      const comRele = Math.max(0.0, Math.min(100.0, baseRele + 24.0 * faseRele + bonusAntenaPct * 0.5));
      const comUso = filtros.modo_enlace === 'DTE'
        ? comDte
        : filtros.modo_enlace === 'RELE'
          ? comRele
          : Math.max(comDte, comRele);

      const baseK = punto.altitud_m < 0 ? 38.0 : 58.0;
      const tempK = baseK + 1.62 * iluPct + Math.max(0.0, elSol) * 3.2;

      const potKw = (irradianciaWm2 * (filtros.area_paneles_m2 || 40) * ((filtros.eficiencia_solar_pct || 32) / 100.0)) / 1000.0;
      const balanceKw = potKw - (filtros.consumo_hab_kw || 3.5);
      energiaBatKwh = Math.max(0.0, Math.min(capBatNominalKwh, energiaBatKwh + balanceKw * pasoH));
      const socPct = (energiaBatKwh / capBatNominalKwh) * 100.0;
      if (socPct < minSocPct) minSocPct = socPct;

      serie.push({
        indice: k,
        fecha: daysJ2000ToIso(dAct),
        elevacion_solar_deg: elSol,
        horizonte_topografico_deg: horizTopoDeg,
        azimut_solar_deg: azSolDeg,
        iluminacion_pct: iluPct,
        irradiancia_wm2: irradianciaWm2,
        elevacion_tierra_deg: elTie,
        comunicacion_dte_pct: comDte,
        comunicacion_rele_pct: comRele,
        comunicacion_efectiva: comUso,
        temperatura_k: tempK,
        potencia_generada_kw: potKw,
        bateria_soc_pct: socPct,
      });

      sumIlu += iluPct;
      sumCom += comUso;
      sumElTie += elTie;
      sumTemp += tempK;
      sumPot += potKw;
      if (elSol > maxElSol) maxElSol = elSol;
      if (elSol < minElSol) minElSol = elSol;
    }

    const m = serie.length;
    const factorRes = 6.0 / Math.max(0.25, pasoH);
    const nEsc = Math.max(1, Math.round(fechas.n_intervalo_deseado * factorRes));
    const mEsc = Math.max(0, Math.round(fechas.margen_intervalo * factorRes));

    let minLen = Math.max(1, nEsc - mEsc);
    let maxLen = Math.min(m, nEsc + mEsc);
    if (minLen > m) {
      minLen = m;
      maxLen = m;
    }

    const prefVal = new Float64Array(m + 1);
    const prefIlu = new Float64Array(m + 1);
    const prefCom = new Float64Array(m + 1);
    const prefSol = new Float64Array(m + 1);
    const prefTie = new Float64Array(m + 1);
    const prefPot = new Float64Array(m + 1);

    for (let k = 0; k < m; k++) {
      const ratioPotPct = Math.min(100.0, (serie[k].potencia_generada_kw / Math.max(0.5, filtros.consumo_hab_kw || 3.5)) * 100.0);
      let metrica = 0.45 * serie[k].iluminacion_pct + 0.4 * serie[k].comunicacion_efectiva + 0.15 * ratioPotPct;
      if (filtros.prioridad_optimizacion === 'MAX_ILUMINACION') {
        metrica = 0.75 * serie[k].iluminacion_pct + 0.1 * serie[k].comunicacion_efectiva + 0.15 * ratioPotPct;
      } else if (filtros.prioridad_optimizacion === 'MAX_COMUNICACION') {
        metrica = 0.15 * serie[k].iluminacion_pct + 0.75 * serie[k].comunicacion_efectiva + 0.1 * ratioPotPct;
      }
      prefVal[k + 1] = prefVal[k] + metrica;
      prefIlu[k + 1] = prefIlu[k] + serie[k].iluminacion_pct;
      prefCom[k + 1] = prefCom[k] + serie[k].comunicacion_efectiva;
      prefSol[k + 1] = prefSol[k] + serie[k].elevacion_solar_deg;
      prefTie[k + 1] = prefTie[k] + serie[k].elevacion_tierra_deg;
      prefPot[k + 1] = prefPot[k] + serie[k].potencia_generada_kw;
    }

    let mejorMedia = -1e18;
    let mejorVentana = null;
    for (let i = 0; i <= m - minLen; i++) {
      for (let tam = minLen; tam <= maxLen; tam++) {
        const j = i + tam;
        if (j > m) break;
        const mediaVal = (prefVal[j] - prefVal[i]) / tam;
        if (mediaVal > mejorMedia) {
          mejorMedia = mediaVal;
          const mIlu = (prefIlu[j] - prefIlu[i]) / tam;
          const mCom = (prefCom[j] - prefCom[i]) / tam;
          const mSol = (prefSol[j] - prefSol[i]) / tam;
          const mTie = (prefTie[j] - prefTie[i]) / tam;
          const mPot = (prefPot[j] - prefPot[i]) / tam;
          mejorVentana = {
            encontrada: true,
            fecha_inicio_optima: serie[i].fecha,
            fecha_fin_optima: serie[j - 1].fecha,
            indice_inicio: i,
            indice_fin: j - 1,
            num_muestras: tam,
            duracion_horas: tam * pasoH,
            media_maxima_valor: mediaVal,
            media_iluminacion_pct: mIlu,
            media_comunicacion_pct: mCom,
            media_elevacion_solar_deg: mSol,
            media_elevacion_tierra_deg: mTie,
            media_potencia_kw: mPot,
            cumple_filtros:
              mIlu >= filtros.iluminacion_min_pct &&
              mCom >= filtros.comunicacion_min_pct &&
              mSol >= filtros.elevacion_solar_min_deg &&
              mTie >= filtros.elevacion_tierra_min_deg,
          };
        }
      }
    }

    const cumpleGlobal =
      mejorVentana.media_iluminacion_pct >= filtros.iluminacion_min_pct &&
      mejorVentana.media_comunicacion_pct >= filtros.comunicacion_min_pct &&
      maxElSol >= filtros.elevacion_solar_min_deg &&
      sumElTie / m >= filtros.elevacion_tierra_min_deg &&
      pendDeg <= filtros.pendiente_max_deg;

    // Extraer hasta 5 ventanas disjuntas destacadas (útil cuando "Sin fecha fija" escanea 6 meses)
    const topVentanas = [];
    const pasoSeg = Math.max(maxLen, Math.floor(m / 5));
    for (let inicioSeg = 0; inicioSeg + minLen <= m && topVentanas.length < 5; inicioSeg += pasoSeg) {
      const finSeg = Math.min(m, inicioSeg + pasoSeg);
      let bMed = -1e18;
      let bWin = null;
      for (let i = inicioSeg; i <= finSeg - minLen; i++) {
        for (let tam = minLen; tam <= maxLen; tam++) {
          const j = i + tam;
          if (j > finSeg) break;
          const mV = (prefVal[j] - prefVal[i]) / tam;
          if (mV > bMed) {
            bMed = mV;
            bWin = {
              fecha_inicio_optima: serie[i].fecha,
              fecha_fin_optima: serie[j - 1].fecha,
              duracion_horas: tam * pasoH,
              media_maxima_valor: mV,
              media_iluminacion_pct: (prefIlu[j] - prefIlu[i]) / tam,
              media_comunicacion_pct: (prefCom[j] - prefCom[i]) / tam,
            };
          }
        }
      }
      if (bWin) topVentanas.push(bWin);
    }
    topVentanas.sort((a, b) => b.media_maxima_valor - a.media_maxima_valor);

    const scoreIlu = mejorVentana.media_iluminacion_pct / 10.0;
    const scoreCom = mejorVentana.media_comunicacion_pct / 10.0;
    const scorePen = Math.max(0.0, 10.0 - pendDeg / 3.0);
    const scoreEne = Math.min(10.0, (mejorVentana.media_potencia_kw / Math.max(0.5, filtros.consumo_hab_kw || 3.5)) * 7.5);
    const nota10 = Math.min(10.0, Math.max(1.0, 0.38 * scoreIlu + 0.34 * scoreCom + 0.14 * scorePen + 0.14 * scoreEne));

    let etiqueta = 'Condiciones Extremas / Sombra';
    if (nota10 >= 9.0) etiqueta = 'Excepcional para Misión (Top Artemis)';
    else if (nota10 >= 8.0) etiqueta = 'Muy Bueno / Recomendado';
    else if (nota10 >= 6.5) etiqueta = 'Apto con Ventana Solar Específica';

    return {
      punto,
      media_iluminacion_pct: sumIlu / m,
      max_elevacion_solar_deg: maxElSol,
      min_elevacion_solar_deg: minElSol,
      media_comunicacion_pct: sumCom / m,
      media_elevacion_tierra_deg: sumElTie / m,
      pendiente_terreno_deg: pendDeg,
      temperatura_media_k: sumTemp / m,
      media_potencia_kw: sumPot / m,
      min_bateria_soc_pct: minSocPct,
      puntuacion_booking_10: nota10,
      cumple_todos_los_filtros: cumpleGlobal,
      etiqueta_valoracion: etiqueta,
      mejor_ventana: mejorVentana,
      top_ventanas_fechas: topVentanas,
      serie_temporal: serie,
    };
  }

  // ==========================================================================
  // ADAPTACIÓN INTEGRAL DEL INTERFAZ SEGÚN EL MODO (NIÑO / PROMEDIO / AVANZADO)
  // ==========================================================================
  function sincronizarControlesIngenieria(origen) {
    if (origen === 'live') {
      if (els.selPasoHorasProf && els.profLivePasoHoras) els.selPasoHorasProf.value = els.profLivePasoHoras.value;
      if (els.selBandaComProf && els.profLiveBandaCom) els.selBandaComProf.value = els.profLiveBandaCom.value;
      if (els.inpAlturaMastilProf && els.profLiveMastil) els.inpAlturaMastilProf.value = els.profLiveMastil.value;
      if (els.inpAreaPanelesProf && els.profLiveAreaPaneles) els.inpAreaPanelesProf.value = els.profLiveAreaPaneles.value;
      if (els.inpConsumoHabProf && els.profLiveConsumoHab) els.inpConsumoHabProf.value = els.profLiveConsumoHab.value;
      if (els.inpDiamAntenaProf && els.profLiveDiamAntena) els.inpDiamAntenaProf.value = els.profLiveDiamAntena.value;
    } else {
      if (els.profLivePasoHoras && els.selPasoHorasProf) els.profLivePasoHoras.value = els.selPasoHorasProf.value;
      if (els.profLiveBandaCom && els.selBandaComProf) els.profLiveBandaCom.value = els.selBandaComProf.value;
      if (els.profLiveMastil && els.inpAlturaMastilProf) els.profLiveMastil.value = els.inpAlturaMastilProf.value;
      if (els.profLiveAreaPaneles && els.inpAreaPanelesProf) els.profLiveAreaPaneles.value = els.inpAreaPanelesProf.value;
      if (els.profLiveConsumoHab && els.inpConsumoHabProf) els.profLiveConsumoHab.value = els.inpConsumoHabProf.value;
      if (els.profLiveDiamAntena && els.inpDiamAntenaProf) els.profLiveDiamAntena.value = els.inpDiamAntenaProf.value;
    }
  }

  function actualizarBotonesModoGrafica() {
    const mapBtns = [
      [els.btnModoGraficaTemp, 'TEMPORAL'],
      [els.btnModoGraficaPrecisa, 'PRECISA'],
      [els.btnModoGraficaEnergia, 'ENERGIA'],
      [els.btnModoGraficaPolar, 'POLAR'],
    ];
    mapBtns.forEach(([b, m]) => {
      if (b) b.classList.toggle('active', state.modoGrafica === m);
    });
  }

  function sincronizarModoIntentUI() {
    const sinLugar = els.selPuntoLunar && els.selPuntoLunar.value === 'NINGUNO';
    const sinFecha = els.chkSinFechaFija ? els.chkSinFechaFija.checked : false;

    if (els.inpFechaInicio) els.inpFechaInicio.disabled = sinFecha;
    if (els.inpFechaFin) els.inpFechaFin.disabled = sinFecha;
    if (els.cellFechaInicio) els.cellFechaInicio.classList.toggle('date-dimmed', sinFecha);
    if (els.cellFechaFin) els.cellFechaFin.classList.toggle('date-dimmed', sinFecha);
    if (els.cellDestinoLunar) els.cellDestinoLunar.classList.toggle('place-any', sinLugar);

    if (els.btnIntentAmbas) els.btnIntentAmbas.classList.toggle('active', !sinLugar && !sinFecha);
    if (els.btnIntentSoloFechas) els.btnIntentSoloFechas.classList.toggle('active', sinLugar && !sinFecha);
    if (els.btnIntentSoloLugar) els.btnIntentSoloLugar.classList.toggle('active', !sinLugar && sinFecha);

    const esEst = state.nivelConocimiento === 'estudiante';
    if (els.btnBuscarMision) {
      if (sinLugar && sinFecha) {
        els.btnBuscarMision.textContent = esEst ? '🌟 ¡Sorpréndeme!' : '🌟 Buscar Mejor Lugar + Fechas';
      } else if (sinLugar) {
        els.btnBuscarMision.textContent = esEst ? '🏕️ Buscar Mejores Lugares' : '📍 Buscar Mejores Lugares';
      } else if (sinFecha) {
        els.btnBuscarMision.textContent = esEst ? '🗓️ Buscar Mejores Días' : '🗓️ Buscar Mejores Fechas';
      } else {
        els.btnBuscarMision.textContent = esEst ? '🚀 ¡Ver Viaje y Dibujo!' : '🔍 Buscar y Ver Resultados';
      }
    }
  }

  function aplicarNivelConocimiento(nivel) {
    state.nivelConocimiento = nivel;
    document.body.classList.remove('nivel-estudiante', 'nivel-estandar', 'nivel-profesional');
    document.body.classList.add(`nivel-${nivel}`);

    const pairs = [
      [els.btnNivelEstudiante, els.cardNivelEstudiante, 'estudiante'],
      [els.btnNivelEstandar, els.cardNivelEstandar, 'estandar'],
      [els.btnNivelProfesional, els.cardNivelProfesional, 'profesional'],
    ];
    pairs.forEach(([btnTop, btnCard, key]) => {
      const activo = key === nivel;
      if (btnTop) btnTop.classList.toggle('active', activo);
      if (btnCard) btnCard.classList.toggle('active', activo);
    });

    if (nivel === 'estudiante') {
      // MODO SIMPLE / NIÑO: Texto ultraclaro y corto, gráfica simplificada visual, cero tecnicismos
      if (els.bannerModoActivoBadge) els.bannerModoActivoBadge.textContent = '🌱 MODO SIMPLE / NIÑO';
      if (els.bannerModoActivoTexto) {
        els.bannerModoActivoTexto.innerHTML =
          '<strong>Todo fácil y visual:</strong> Sin palabras raras. Puedes elegir solo el sitio, solo las fechas, ¡o las dos cosas!';
      }

      els.txtSaludoHero.textContent = '👋 ¡Planea tu excursión al Polo Sur de la Luna!';
      els.txtSubtituloHero.innerHTML =
        'Elige un sitio fácil o pincha en la <strong>foto real de la Luna</strong> para ver qué días hay más Sol.';
      els.txtConsejoTripulacion.innerHTML =
        '<strong>Pista fácil:</strong> Si no sabes adónde ir, elige <em>«No sé el sitio (recomiéndame el mejor)»</em> y deja que el cohete decida por ti.';

      els.lblPaso1Destino.innerHTML = '<span class="step-badge">1</span> 1. ¿Dónde vas?';
      els.lblPaso2Llegada.innerHTML = '<span class="step-badge">2</span> 2. Día de llegada';
      els.lblPaso3Salida.innerHTML = '<span class="step-badge">3</span> 3. Día de vuelta';
      els.lblPaso4Ventana.innerHTML = '<span class="step-badge">4</span> 4. Cuántos bloques';

      if (els.lblPerfilesRapidos) els.lblPerfilesRapidos.textContent = 'Elige rápido:';
      if (els.btnPresetSol) els.btnPresetSol.textContent = '☀️ Mucho Sol';
      if (els.btnPresetTierra) els.btnPresetTierra.textContent = '📱 Buena llamada';
      if (els.btnPresetHielo) els.btnPresetHielo.textContent = '🧊 Ver hielo';
      if (els.btnPresetEquilibrado) els.btnPresetEquilibrado.textContent = '⚖️ De todo';

      if (els.lblSumarioMapa2D) {
        els.lblSumarioMapa2D.textContent = '🌕 Foto de la Luna: ¡Pincha donde quieras aterrizar!';
      }
      if (els.lblTituloPanelMapa2D) {
        els.lblTituloPanelMapa2D.textContent = '🎯 Tu punto en la foto de la Luna';
      }
      if (els.lblExplicacionMapa2D) {
        els.lblExplicacionMapa2D.innerHTML =
          'Blanco = montañas con Sol. Oscuro = cráteres con hielo. <strong>¡Haz clic en cualquier sitio!</strong>';
      }

      if (els.lblCabeceraFiltros) els.lblCabeceraFiltros.textContent = '🎒 Tu mochila';
      els.lblTituloFiltroIlu.textContent = '☀️ 1. Luz del Sol';
      els.lblDescFiltroIlu.textContent = 'Para tener energía todo el viaje.';
      if (els.lblSliderIluTexto) els.lblSliderIluTexto.textContent = 'Mínimo de Sol:';

      els.lblTituloFiltroCom.textContent = '📱 2. Hablar con Casa';
      els.lblDescFiltroCom.textContent = 'Para enviar fotos a la Tierra.';
      if (els.lblSliderComTexto) els.lblSliderComTexto.textContent = 'Cobertura mínima:';
      if (els.lblModoEnlaceTexto) els.lblModoEnlaceTexto.textContent = 'Antena de viaje:';
      if (els.selModoEnlace && els.selModoEnlace.options.length >= 3) {
        els.selModoEnlace.options[0].textContent = '📡 Directo a la Tierra';
        els.selModoEnlace.options[1].textContent = '🛰️ Con satélite ayudante';
        els.selModoEnlace.options[2].textContent = '🌐 La mejor opción';
      }

      els.lblTituloFiltroTerreno.textContent = '🛞 3. Suelo y gusto';
      if (els.lblSliderPendTexto) els.lblSliderPendTexto.textContent = 'Cuesta máxima:';
      if (els.lblPrioridadTexto) els.lblPrioridadTexto.textContent = '¿Qué importa más?:';
      if (els.selPrioridad && els.selPrioridad.options.length >= 3) {
        els.selPrioridad.options[0].textContent = '⚖️ Sol y Llamadas';
        els.selPrioridad.options[1].textContent = '☀️ Mucho Sol';
        els.selPrioridad.options[2].textContent = '📱 Mejores Llamadas';
      }

      els.tituloBannerVentana.textContent = '🌟 Tus mejores días seguidos';
      els.lblKpiIluTitulo.textContent = '☀️ Sol';
      els.lblKpiComTitulo.textContent = '📱 Llamadas';
      els.lblKpiSolTitulo.textContent = '⛰️ Suelo';
      els.lblKpiTempTitulo.textContent = '🌡️ Temperatura';
      if (els.lblSubScoreTexto) els.lblSubScoreTexto.textContent = 'Nota del sitio';
      if (els.lblSumarioGrafica) {
        els.lblSumarioGrafica.textContent = '📊 Dibujo sencillo: Sol (rojo) y Llamadas (azul)';
      }
      if (els.lblTituloListaOfertas) {
        els.lblTituloListaOfertas.textContent = '🏕️ Mejores lugares del Polo Sur para ti';
      }
      if (els.lblSubListaOfertas) {
        els.lblSubListaOfertas.textContent = 'Ordenados por nota (0 a 10)';
      }

      if (els.selPasoHorasProf) els.selPasoHorasProf.value = '6';
      if (els.inpAlturaMastilProf) els.inpAlturaMastilProf.value = '0';
      sincronizarControlesIngenieria('sidebar');
      state.modoGrafica = 'TEMPORAL';
      actualizarBotonesModoGrafica();
      if (els.drawerIngenieriaProf) els.drawerIngenieriaProf.open = false;
    } else if (nivel === 'profesional') {
      // MODO AVANZADO / PROFESIONAL: Coordenadas esféricas + Gráficas de Alta Precisión + Parámetros en vivo
      if (els.bannerModoActivoBadge) els.bannerModoActivoBadge.textContent = '🔬 MODO AVANZADO / PROFESIONAL ACTIVO';
      if (els.bannerModoActivoTexto) {
        els.bannerModoActivoTexto.innerHTML =
          '<strong>Simulación Física + Coordenadas Esféricas (r, θ, φ):</strong> Resolución horaria <code>Δt = 1h / 30 min</code>, selector fino selenocéntrico 3D, máscara topográfica LOLA y aplicación directa de mástil, bandas RF/Láser, paneles FV y baterías.';
      }

      els.txtSaludoHero.textContent = '🛰️ NASA LunarBooking • Consola de Ingeniería del Polo Sur Lunar (IAU2000::30120)';
      els.txtSubtituloHero.innerHTML =
        'Evaluación astrodinámica en <strong>coordenadas esféricas (r, θ, φ)</strong> y estereográficas, optimización <code>O(N)</code> y simulación acoplada FV, baterías y Link Budget.';
      els.txtConsejoTripulacion.innerHTML =
        '<strong>Modo Avanzado:</strong> Puedes introducir el punto directamente en <strong>Coordenadas Esféricas (r, θ, φ)</strong> dentro del Mapa 2D y ajustar resolución, mástil, banda RF/Láser o consumo en tiempo real.';

      els.lblPaso1Destino.innerHTML = '<span class="step-badge">1</span> Emplazamiento Polo Sur';
      els.lblPaso2Llegada.innerHTML = '<span class="step-badge">2</span> Época Inicio (UTC)';
      els.lblPaso3Salida.innerHTML = '<span class="step-badge">3</span> Época Fin (UTC)';
      els.lblPaso4Ventana.innerHTML = '<span class="step-badge">4</span> Ventana Base (n ± m)';

      if (els.lblPerfilesRapidos) els.lblPerfilesRapidos.textContent = 'Perfiles de Misión Artemis:';
      if (els.btnPresetSol) els.btnPresetSol.textContent = '☀️ Pico Solar (Shackleton 89.8°S)';
      if (els.btnPresetTierra) els.btnPresetTierra.textContent = '📡 Estación DTE (Malapert +4850m)';
      if (els.btnPresetHielo) els.btnPresetHielo.textContent = '🧊 Prospección PSR (Cabeus LCROSS)';
      if (els.btnPresetEquilibrado) els.btnPresetEquilibrado.textContent = '⚖️ Cresta Nominal (Artemis 01)';

      if (els.lblSumarioMapa2D) {
        els.lblSumarioMapa2D.textContent = '🗺️ Cartografía Estereográfica IAU2000::30120 + Selector Esférico (r, θ, φ)';
      }
      if (els.lblTituloPanelMapa2D) {
        els.lblTituloPanelMapa2D.textContent = '🎯 Coordenadas Esféricas (r, θ, φ), Selenográficas y Cota LOLA';
      }
      if (els.lblExplicacionMapa2D) {
        els.lblExplicacionMapa2D.innerHTML =
          'Proyección estereográfica polar centrada en <code>90°S</code>. Introduce el punto en <code>(r, θ, φ)</code>, <code>(Lat, Lon)</code> o <code>(X, Y)</code> para evaluar la máscara topográfica LOLA.';
      }

      if (els.lblCabeceraFiltros) els.lblCabeceraFiltros.textContent = '⚙️ Restricciones de Misión';
      els.lblTituloFiltroIlu.textContent = '1. Restricciones Solares [PUNTO_01]';
      els.lblDescFiltroIlu.textContent = 'Fracción visible del disco solar e irradiancia rasante.';
      if (els.lblSliderIluTexto) els.lblSliderIluTexto.textContent = 'Fracción solar media mín.:';

      els.lblTituloFiltroCom.textContent = '2. Enlace DTE / LunaNet [PUNTO_02]';
      els.lblDescFiltroCom.textContent = 'Visibilidad topocéntrica Tierra y libración selenográfica.';
      if (els.lblSliderComTexto) els.lblSliderComTexto.textContent = 'Disponibilidad enlace mín.:';
      if (els.lblModoEnlaceTexto) els.lblModoEnlaceTexto.textContent = 'Arquitectura Telecom:';
      if (els.selModoEnlace && els.selModoEnlace.options.length >= 3) {
        els.selModoEnlace.options[0].textContent = '📡 Direct-to-Earth (DTE DSN)';
        els.selModoEnlace.options[1].textContent = '🛰️ Constelación Relé (LunaNet)';
        els.selModoEnlace.options[2].textContent = '🌐 Híbrido DTE + Relé';
      }

      els.lblTituloFiltroTerreno.textContent = '3. Pendiente LOLA y Función Objetivo';
      if (els.lblSliderPendTexto) els.lblSliderPendTexto.textContent = 'Pendiente máx. DEM LOLA:';
      if (els.lblPrioridadTexto) els.lblPrioridadTexto.textContent = 'Función objetivo O(N):';
      if (els.selPrioridad && els.selPrioridad.options.length >= 3) {
        els.selPrioridad.options[0].textContent = '⚖️ Multi-Objetivo (Ilu + Enlace + Potencia)';
        els.selPrioridad.options[1].textContent = '☀️ Maximizar Fracción Solar + Potencia FV';
        els.selPrioridad.options[2].textContent = '📡 Maximizar Disponibilidad Enlace RF/Óptico';
      }

      els.tituloBannerVentana.textContent = '📐 Ventana Continua Óptima de Alta Precisión (Suma Prefija O(N) [PUNTO_04])';
      els.lblKpiIluTitulo.textContent = 'Fracción Solar Media';
      els.lblKpiComTitulo.textContent = 'Disponibilidad Enlace (Banda)';
      els.lblKpiSolTitulo.textContent = 'Elevación Solar / Despeje';
      els.lblKpiTempTitulo.textContent = 'Temp (K) y Elev. Tierra';
      if (els.lblSubScoreTexto) els.lblSubScoreTexto.textContent = 'Índice Compuesto (Ilu+RF+FV+LOLA)';
      if (els.lblSumarioGrafica) {
        els.lblSumarioGrafica.textContent = '🔬 Gráficas Científicas de Alta Precisión (Multi-Eje, Baterías SoC %, Carta Polar 360°)';
      }
      if (els.lblTituloListaOfertas) {
        els.lblTituloListaOfertas.textContent = '🛰️ Matriz de Emplazamientos Candidatos del Polo Sur Lunar (84°S–90°S)';
      }
      if (els.lblSubListaOfertas) {
        els.lblSubListaOfertas.textContent = 'Recalculados en vivo con tus parámetros de mástil, banda RF, antena y paneles FV';
      }

      if (els.selPasoHorasProf && els.selPasoHorasProf.value === '6') {
        els.selPasoHorasProf.value = '1';
      }
      if (els.inpAlturaMastilProf && els.inpAlturaMastilProf.value === '0') {
        els.inpAlturaMastilProf.value = '15';
      }
      sincronizarControlesIngenieria('sidebar');
      if (state.modoGrafica === 'TEMPORAL') {
        state.modoGrafica = 'PRECISA';
      }
      actualizarBotonesModoGrafica();
      if (els.drawerIngenieriaProf) els.drawerIngenieriaProf.open = true;
      if (els.drawerGraficaTemporal) els.drawerGraficaTemporal.open = true;
    } else {
      // MODO INTERMEDIO / PROMEDIO: Agencia Booking + Puente Educativo Simple -> Avanzado
      if (els.bannerModoActivoBadge) els.bannerModoActivoBadge.textContent = '🚀 MODO INTERMEDIO (PUENTE SIMPLE ↔ PRO)';
      if (els.bannerModoActivoTexto) {
        els.bannerModoActivoTexto.innerHTML =
          '<strong>Modo Intermedio (Booking + Puente Pro):</strong> Reserva normal con fotos NASA y un <em>Puente Traductor</em> que conecta las ideas simples con magnitudes de ingeniería.';
      }

      els.txtSaludoHero.textContent = '🌕 Reserva y compara tu estancia en el Polo Sur de la Luna';
      els.txtSubtituloHero.innerHTML =
        'Busca por <strong>solo fechas</strong>, <strong>solo lugar</strong> o <strong>ambas</strong> para ver cómo evolucionan el Sol, la conexión y la energía.';
      els.txtConsejoTripulacion.innerHTML =
        '<strong>Puente de Aprendizaje:</strong> En esta vista tienes tarjetas traductoras (de % sencillos a W/m², grados y Kelvin) para prepararte antes de pasar al <em>🔬 Modo Avanzado</em>.';

      els.lblPaso1Destino.innerHTML = '<span class="step-badge">1</span> ¿A qué zona del Polo Sur vas?';
      els.lblPaso2Llegada.innerHTML = '<span class="step-badge">2</span> Llegada (Check-in)';
      els.lblPaso3Salida.innerHTML = '<span class="step-badge">3</span> Salida (Check-out)';
      els.lblPaso4Ventana.innerHTML = '<span class="step-badge">4</span> Ventana (n ± margen)';

      if (els.lblPerfilesRapidos) els.lblPerfilesRapidos.textContent = 'Perfiles Polo Sur:';
      if (els.btnPresetSol) els.btnPresetSol.textContent = '☀️ Máxima Luz (Shackleton)';
      if (els.btnPresetTierra) els.btnPresetTierra.textContent = '📡 Mejor Conexión Tierra (Malapert)';
      if (els.btnPresetHielo) els.btnPresetHielo.textContent = '🧊 Cráteres de Hielo (Cabeus)';
      if (els.btnPresetEquilibrado) els.btnPresetEquilibrado.textContent = '⚖️ Equilibrado (Cresta Polar)';

      if (els.lblSumarioMapa2D) {
        els.lblSumarioMapa2D.textContent = '🗺️ Mapa 2D Fotográfico Real del Polo Sur Lunar (NASA LROC 84°S – 90°S): Haz clic para elegir tu zona';
      }
      if (els.lblTituloPanelMapa2D) {
        els.lblTituloPanelMapa2D.textContent = '🎯 Selección sobre Imagen Real del Polo Sur de la Luna';
      }
      if (els.lblExplicacionMapa2D) {
        els.lblExplicacionMapa2D.innerHTML =
          'Debajo de las zonas de interés tienes el <strong>mosaico fotográfico real de la sonda LRO de la NASA</strong> del Polo Sur Lunar. Haz clic en cualquier punto azul o en cualquier cráter o montaña.';
      }

      if (els.lblCabeceraFiltros) els.lblCabeceraFiltros.textContent = '⚙️ Filtrar por requisitos';
      els.lblTituloFiltroIlu.textContent = '1. Iluminación Solar';
      els.lblDescFiltroIlu.textContent = 'Luz solar mínima durante tu estancia polar.';
      if (els.lblSliderIluTexto) els.lblSliderIluTexto.textContent = 'Luz solar media mín.';

      els.lblTituloFiltroCom.textContent = '2. Comunicación Tierra';
      els.lblDescFiltroCom.textContent = 'Cobertura directa a Tierra o satélite relé.';
      if (els.lblSliderComTexto) els.lblSliderComTexto.textContent = 'Cobertura mínima';
      if (els.lblModoEnlaceTexto) els.lblModoEnlaceTexto.textContent = 'Arquitectura de Enlace:';
      if (els.selModoEnlace && els.selModoEnlace.options.length >= 3) {
        els.selModoEnlace.options[0].textContent = '📡 Directo a Tierra (DTE)';
        els.selModoEnlace.options[1].textContent = '🛰️ Satélite Relé (LunaNet)';
        els.selModoEnlace.options[2].textContent = '🌐 Directo + Satélite';
      }

      els.lblTituloFiltroTerreno.textContent = '3. Terreno y Prioridad';
      if (els.lblSliderPendTexto) els.lblSliderPendTexto.textContent = 'Pendiente máx. suelo';
      if (els.lblPrioridadTexto) els.lblPrioridadTexto.textContent = 'Priorizar en ventana:';
      if (els.selPrioridad && els.selPrioridad.options.length >= 3) {
        els.selPrioridad.options[0].textContent = '⚖️ Equilibrado (Luz + Tierra)';
        els.selPrioridad.options[1].textContent = '☀️ Máxima Luz Solar';
        els.selPrioridad.options[2].textContent = '📡 Máxima Comunicación';
      }

      els.tituloBannerVentana.textContent = '✨ Mejor Rango Continuo de Fechas en el Polo Sur (Máxima Media)';
      els.lblKpiIluTitulo.textContent = 'Iluminación en Ventana';
      els.lblKpiComTitulo.textContent = 'Comunicación en Ventana';
      els.lblKpiSolTitulo.textContent = 'Elevación Solar Media / Máx';
      els.lblKpiTempTitulo.textContent = 'Temperatura y Horizonte Tierra';
      if (els.lblSubScoreTexto) els.lblSubScoreTexto.textContent = 'Puntuación Booking Polo Sur';
      if (els.lblSumarioGrafica) {
        els.lblSumarioGrafica.textContent = '📈 Gráfica Interactiva de Misión: Serie Temporal + Carta Polar 360°';
      }
      if (els.lblTituloListaOfertas) {
        els.lblTituloListaOfertas.textContent = '🏨 Zonas preseleccionadas del Polo Sur Lunar disponibles en tus fechas';
      }
      if (els.lblSubListaOfertas) {
        els.lblSubListaOfertas.textContent = 'Fotografías reales de la NASA • Ordenadas por nota Booking (0–10)';
      }

      if (els.selPasoHorasProf) els.selPasoHorasProf.value = els.selBridgePaso ? els.selBridgePaso.value : '6';
      if (els.inpAlturaMastilProf) els.inpAlturaMastilProf.value = '0';
      sincronizarControlesIngenieria('sidebar');
      if (state.modoGrafica === 'PRECISA' || state.modoGrafica === 'ENERGIA') {
        state.modoGrafica = 'TEMPORAL';
      }
      actualizarBotonesModoGrafica();
      if (els.drawerIngenieriaProf) els.drawerIngenieriaProf.open = false;
    }

    poblarSelectoresCatalogo(true);
    sincronizarModoIntentUI();
    sincronizarInputsPuntoSeleccionado();
    ejecutarBusqueda();
    ejecutarComparacion();
    if (document.body.classList.contains('modo-autismo')) {
      aplicarLimpiezaAutismo(true);
    }
    if (document.body.classList.contains('modo-tdah')) {
      aplicarPalabrasClaveTdah(true);
    }
    if (state.lupaCursorActiva) {
      reconstruirClonLupaCursor();
    }
  }

  function leerFiltrosActuales() {
    const esProf = state.nivelConocimiento === 'profesional';
    const esEst = state.nivelConocimiento === 'estudiante';
    const pasoIntermedio = (!esProf && !esEst && els.selBridgePaso) ? parseFloat(els.selBridgePaso.value || '6') : 6.0;
    return {
      iluminacion_min_pct: parseFloat(els.rngFiltroIlu.value || '60'),
      elevacion_solar_min_deg: esEst ? -5.0 : parseFloat(els.rngFiltroElSol.value || '0'),
      comunicacion_min_pct: parseFloat(els.rngFiltroCom.value || '50'),
      elevacion_tierra_min_deg: esEst ? -5.0 : parseFloat(els.rngFiltroElTie.value || '0'),
      modo_enlace: els.selModoEnlace.value || 'DTE',
      pendiente_max_deg: parseFloat(els.rngFiltroPend.value || '15'),
      prioridad_optimizacion: els.selPrioridad.value || 'EQUILIBRADO',
      paso_horas: esProf ? parseFloat(els.selPasoHorasProf?.value || '1') : pasoIntermedio,
      altura_mastil_m: esProf ? parseFloat(els.inpAlturaMastilProf?.value || '15') : 0.0,
      banda_com: esProf ? (els.selBandaComProf?.value || 'X') : 'X',
      diam_antena_m: esProf ? parseFloat(els.inpDiamAntenaProf?.value || '1.2') : 1.2,
      area_paneles_m2: esProf ? parseFloat(els.inpAreaPanelesProf?.value || '40') : 40.0,
      eficiencia_solar_pct: esProf ? parseFloat(els.inpEficienciaSolarProf?.value || '32') : 32.0,
      consumo_hab_kw: esProf ? parseFloat(els.inpConsumoHabProf?.value || '3.5') : 3.5,
    };
  }

  function poblarSelectoresCatalogo(preservarSeleccion = false) {
    const prevSel = els.selPuntoLunar.value;
    const prevA = els.selCompPuntoA.value;
    const prevB = els.selCompPuntoB.value;

    const selects = [els.selPuntoLunar, els.selCompPuntoA, els.selCompPuntoB];
    selects.forEach((sel, idx) => {
      sel.innerHTML = '';
      if (idx === 0) {
        const optAny = document.createElement('option');
        optAny.value = 'NINGUNO';
        optAny.textContent =
          state.nivelConocimiento === 'estudiante'
            ? '❓ No sé el sitio (Recomiéndame el mejor)'
            : '❓ Sin lugar fijo (Buscar mejores zonas para mis fechas)';
        sel.appendChild(optAny);
      }
      state.catalogo.forEach((p) => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = obtenerNombrePuntoSegunModo(p.id, p.nombre);
        sel.appendChild(opt);
      });
      if (idx === 0) {
        const optCustom = document.createElement('option');
        optCustom.value = 'custom';
        optCustom.textContent =
          state.nivelConocimiento === 'estudiante'
            ? '🎯 Mi punto elegido en la foto'
            : state.nivelConocimiento === 'profesional'
              ? '🎯 Coordenada Personalizada (Esféricas / Mapa 2D)'
              : '🎯 Zona Única Seleccionada en Mapa 2D del Polo Sur';
        sel.appendChild(optCustom);
      }
    });

    if (preservarSeleccion && prevSel) {
      els.selPuntoLunar.value = prevSel;
      if (prevA) els.selCompPuntoA.value = prevA;
      if (prevB) els.selCompPuntoB.value = prevB;
    } else if (state.catalogo.length >= 2) {
      els.selPuntoLunar.value = state.catalogo[0].id;
      els.selCompPuntoA.value = state.catalogo[0].id;
      els.selCompPuntoB.value = state.catalogo[1].id;
    }
  }

  function sincronizarInputsPuntoSeleccionado() {
    const id = els.selPuntoLunar.value;
    if (id === 'NINGUNO') {
      if (els.txtZonaMapa2DSeleccionada) {
        els.txtZonaMapa2DSeleccionada.textContent =
          state.nivelConocimiento === 'estudiante'
            ? '❓ Sin lugar fijo: buscaremos el mejor sitio para tus fechas'
            : '❓ Sin lugar fijo: al buscar recomendaremos la mejor zona del Polo Sur';
      }
      if (els.subZonaMapa2DCoords) {
        els.subZonaMapa2DCoords.textContent = 'Se evaluarán automáticamente las 8 zonas del Polo Sur lunar';
      }
      dibujarMapaPoloSur2D();
      return;
    }
    const p = state.catalogo.find((x) => x.id === id);
    if (!p) {
      const lat = parseFloat(els.inpLatitud.value || '-89.5');
      const lon = parseFloat(els.inpLongitud.value || '45');
      const alt = parseFloat(els.inpAltitud.value || '1500');
      actualizarVectorYEsfericasUI(lat, lon, alt);
      dibujarMapaPoloSur2D();
      return;
    }
    state.tipoCoordActual = 'SELENOGRAFICA';
    els.inpLatitud.value = p.latitud_deg.toFixed(2);
    els.inpLongitud.value = p.longitud_deg.toFixed(2);
    els.inpMapaX.value = Math.round(p.x_mapa_m);
    els.inpMapaY.value = Math.round(p.y_mapa_m);
    els.inpAltitud.value = Math.round(p.altitud_m);
    actualizarVectorYEsfericasUI(p.latitud_deg, p.longitud_deg, p.altitud_m);
    if (els.txtZonaMapa2DSeleccionada) {
      els.txtZonaMapa2DSeleccionada.textContent = `📍 ${obtenerNombrePuntoSegunModo(p.id, p.nombre)}`;
    }
    if (els.subZonaMapa2DCoords) {
      els.subZonaMapa2DCoords.textContent =
        state.nivelConocimiento === 'estudiante'
          ? `Altura de esta zona: ${Math.round(p.altitud_m)} m`
          : `Lat: ${p.latitud_deg.toFixed(2)}°S | Lon: ${p.longitud_deg.toFixed(1)}° | X: ${Math.round(p.x_mapa_m)} m, Y: ${Math.round(p.y_mapa_m)} m`;
    }
    dibujarMapaPoloSur2D();
  }

  // ==========================================================================
  // 4 MODOS DE GRÁFICA: ESTÁNDAR, CIENTÍFICA DE ALTA PRECISIÓN, ENERGÍA/BATERÍAS Y POLAR 360°
  // ==========================================================================
  function obtenerValorComMuestra(s) {
    if (typeof s.comunicacion_efectiva === 'number') return s.comunicacion_efectiva;
    const modoEnlace = els.selModoEnlace.value;
    if (modoEnlace === 'DTE') return s.comunicacion_dte_pct;
    if (modoEnlace === 'RELE') return s.comunicacion_rele_pct;
    return Math.max(s.comunicacion_dte_pct, s.comunicacion_rele_pct);
  }

  function dibujarCartaPolar360(ctx, w, h, ev, serie) {
    ctx.fillStyle = '#04112B';
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.34;
    const cy = h * 0.52;
    const radioMax = Math.min(cx - 24, h * 0.43);

    const elToRadius = (elDeg) => {
      const clamped = Math.max(-10, Math.min(20, elDeg));
      return ((20 - clamped) / 30.0) * radioMax;
    };

    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radioMax);
    grad.addColorStop(0, '#0B3D91');
    grad.addColorStop(0.7, '#061F4A');
    grad.addColorStop(1, '#04112B');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radioMax, 0, Math.PI * 2);
    ctx.fill();

    // Silueta del Horizonte Topográfico Local (cambia al subir el Mástil Solar)
    const mastilM = parseFloat(els.inpAlturaMastilProf?.value || '0') || 0;
    ctx.save();
    ctx.fillStyle = 'rgba(71, 115, 170, 0.25)';
    ctx.strokeStyle = '#4773AA';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let az = 0; az <= 360; az += 5) {
      const hMask = calcularMascaraHorizontePolarJs(ev.punto, az, mastilM);
      const rMask = elToRadius(hMask);
      const azRad = ((az - 90.0) * Math.PI) / 180.0;
      const px = cx + rMask * Math.cos(azRad);
      const py = cy + rMask * Math.sin(azRad);
      if (az === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    [-5, 0, 5, 10].forEach((elRef) => {
      const r = elToRadius(elRef);
      ctx.strokeStyle = elRef === 0 ? '#DCE4EF' : 'rgba(71, 115, 170, 0.4)';
      ctx.lineWidth = elRef === 0 ? 1.6 : 1;
      if (elRef < 0) ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px Segoe UI, sans-serif';
    ctx.fillText('0° Azimut (Hacia la Tierra) ↑', cx - 64, cy - radioMax - 6);
    ctx.fillText('180° Cara Oculta', cx - 38, cy + radioMax + 12);

    serie.forEach((s, idx) => {
      const azDeg = typeof s.azimut_solar_deg === 'number' ? s.azimut_solar_deg : (idx * (360.0 / serie.length)) % 360.0;
      const azRad = ((azDeg - 90.0) * Math.PI) / 180.0;
      const r = elToRadius(s.elevacion_solar_deg);
      const px = cx + r * Math.cos(azRad);
      const py = cy + r * Math.sin(azRad);

      ctx.fillStyle = s.elevacion_solar_deg >= 0 ? '#FC3D21' : '#4773AA';
      ctx.beginPath();
      ctx.arc(px, py, s.elevacion_solar_deg >= 0 ? 2.8 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    const rTierra = elToRadius(ev.media_elevacion_tierra_deg);
    ctx.fillStyle = '#105BD8';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - rTierra, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const boxX = w * 0.62;
    ctx.fillStyle = '#DCE4EF';
    ctx.font = 'bold 12px Segoe UI, sans-serif';
    ctx.fillText('🧭 Carta Polar 360° + Horizonte LOLA', boxX, 30);
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('• Anillo Blanco: Horizonte 0°', boxX, 52);
    ctx.fillStyle = '#4773AA';
    ctx.fillText(`• Contorno Azul: Máscara relieve (Mástil ${mastilM} m)`, boxX, 72);
    ctx.fillStyle = '#FC3D21';
    ctx.fillText('• Trazo Rojo: Sol visible sobre crestas', boxX, 92);
    ctx.fillStyle = '#105BD8';
    ctx.fillText(`• Punto Azul: Tierra a ${ev.media_elevacion_tierra_deg.toFixed(2)}°`, boxX, 112);
    ctx.fillStyle = '#DCE4EF';
    ctx.fillText(`• Resolución actual: ${serie.length} muestras`, boxX, 138);
    ctx.fillText(`• Elev. Solar Máx/Mín: ${ev.max_elevacion_solar_deg.toFixed(2)}° / ${ev.min_elevacion_solar_deg.toFixed(2)}°`, boxX, 158);
  }

  function dibujarGraficaEnergiaBaterias(ctx, w, h, ev, serie) {
    ctx.fillStyle = '#04112B';
    ctx.fillRect(0, 0, w, h);

    const padL = 52;
    const padR = 54;
    const padT = 20;
    const padB = 28;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const consumoKw = parseFloat(els.inpConsumoHabProf?.value || '3.5') || 3.5;
    let maxKw = Math.max(10.0, consumoKw * 2.2);
    serie.forEach((s) => {
      if ((s.potencia_generada_kw || 0) > maxKw) maxKw = s.potencia_generada_kw * 1.15;
    });

    // Rejilla de sub-divisiones finas
    ctx.strokeStyle = 'rgba(71, 115, 170, 0.35)';
    ctx.lineWidth = 1;
    ctx.font = '10px Consolas, monospace';
    ctx.fillStyle = '#DCE4EF';
    [0, 25, 50, 75, 100].forEach((pct) => {
      const y = padT + plotH * (1 - pct / 100.0);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      ctx.fillText(`SoC ${pct}%`, 4, y + 3);
      const kwVal = ((pct / 100.0) * maxKw).toFixed(1);
      ctx.fillText(`${kwVal}kW`, w - padR + 4, y + 3);
    });

    // Línea horizontal de demanda continua del hábitat/rover (kW)
    const yDemanda = padT + plotH * (1 - Math.min(1.0, consumoKw / maxKw));
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, yDemanda);
    ctx.lineTo(w - padR, yDemanda);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Demanda Hábitat: ${consumoKw.toFixed(1)} kW`, padL + 8, Math.max(padT + 12, yDemanda - 5));
    ctx.restore();

    // Curva 1: Estado de Carga de Baterías del Hábitat (SoC %) en Azul Ciencia (#105BD8)
    ctx.save();
    ctx.strokeStyle = '#105BD8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    serie.forEach((s, i) => {
      const x = padL + (i / (serie.length - 1)) * plotW;
      const soc = typeof s.bateria_soc_pct === 'number' ? s.bateria_soc_pct : 80.0;
      const y = padT + plotH * (1 - soc / 100.0);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Curva 2: Potencia Fotovoltaica Generada (kW) en Rojo NASA (#FC3D21)
    ctx.save();
    ctx.strokeStyle = '#FC3D21';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    serie.forEach((s, i) => {
      const x = padL + (i / (serie.length - 1)) * plotW;
      const kw = s.potencia_generada_kw || 0;
      const y = padT + plotH * (1 - Math.min(1.0, kw / maxKw));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#DCE4EF';
    ctx.fillText(`Rojo = Potencia Generada (kW) | Azul = Batería Hábitat SoC (%) | Blanco = Consumo (${consumoKw} kW)`, padL, h - 7);
  }

  function dibujarGraficaSimpleNino(ctx, w, h, ev, serie) {
    ctx.fillStyle = '#04112B';
    ctx.fillRect(0, 0, w, h);

    const padL = 96;
    const padR = 24;
    const padT = 22;
    const padB = 30;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // 3 franjas visuales muy claras: Oscuro / A medias / Mucho Sol
    const bandas = [
      { y0: 0.66, y1: 1.0, color: 'rgba(252, 61, 33, 0.10)', txt: '☀️ Mucho Sol' },
      { y0: 0.33, y1: 0.66, color: 'rgba(71, 115, 170, 0.08)', txt: '⛅ A medias' },
      { y0: 0.0, y1: 0.33, color: 'rgba(6, 31, 74, 0.35)', txt: '🌑 Sombra' },
    ];
    bandas.forEach((b) => {
      const top = padT + plotH * (1 - b.y1);
      const bottom = padT + plotH * (1 - b.y0);
      ctx.fillStyle = b.color;
      ctx.fillRect(padL, top, plotW, bottom - top);
      ctx.strokeStyle = 'rgba(220, 228, 239, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, bottom);
      ctx.lineTo(w - padR, bottom);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11.5px Segoe UI, sans-serif';
      ctx.fillText(b.txt, 8, (top + bottom) * 0.5 + 4);
    });

    // Caja brillante para los mejores días seguidos
    if (ev.mejor_ventana && ev.mejor_ventana.encontrada) {
      const idx0 = serie.findIndex((s) => s.fecha === ev.mejor_ventana.fecha_inicio_optima);
      const idx1 = serie.findIndex((s) => s.fecha === ev.mejor_ventana.fecha_fin_optima);
      if (idx0 >= 0 && idx1 >= idx0) {
        const x0 = padL + (idx0 / (serie.length - 1)) * plotW;
        const x1 = padL + (idx1 / (serie.length - 1)) * plotW;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.fillRect(x0, padT, Math.max(10, x1 - x0), plotH);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.0;
        ctx.strokeRect(x0, padT, Math.max(10, x1 - x0), plotH);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10.5px Segoe UI, sans-serif';
        ctx.fillText('⭐ MEJORES DÍAS', Math.min(w - 115, Math.max(padL + 4, x0 + 4)), padT + 14);
      }
    }

    // Relleno suave y curva gruesa de Luz del Sol (Rojo NASA)
    ctx.save();
    ctx.beginPath();
    serie.forEach((s, i) => {
      const x = padL + (i / (serie.length - 1)) * plotW;
      const y = padT + plotH * (1 - s.iluminacion_pct / 100.0);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.lineTo(padL, padT + plotH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(252, 61, 33, 0.18)';
    ctx.fill();

    ctx.strokeStyle = '#FC3D21';
    ctx.lineWidth = 3.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    serie.forEach((s, i) => {
      const x = padL + (i / (serie.length - 1)) * plotW;
      const y = padT + plotH * (1 - s.iluminacion_pct / 100.0);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Curva azul gruesa de Llamadas con la Tierra
    ctx.save();
    ctx.strokeStyle = '#105BD8';
    ctx.lineWidth = 3.0;
    ctx.lineJoin = 'round';
    if (state.daltonismoActivo) ctx.setLineDash([8, 5]);
    ctx.beginPath();
    serie.forEach((s, i) => {
      const x = padL + (i / (serie.length - 1)) * plotW;
      const comV = obtenerValorComMuestra(s);
      const y = padT + plotH * (1 - comV / 100.0);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Etiquetas de días simples en el eje horizontal
    ctx.fillStyle = '#DCE4EF';
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    const numMarcas = 4;
    for (let mIdx = 0; mIdx <= numMarcas; mIdx++) {
      const sIdx = Math.min(serie.length - 1, Math.round((mIdx / numMarcas) * (serie.length - 1)));
      const x = padL + (sIdx / (serie.length - 1)) * plotW;
      const diaTxt = (serie[sIdx].fecha || '').slice(5, 10);
      ctx.fillText(diaTxt, Math.min(w - 50, Math.max(padL, x - 16)), h - 8);
    }

    if (state.hoverGraficaIdx !== null && serie[state.hoverGraficaIdx]) {
      const idx = state.hoverGraficaIdx;
      const xCur = padL + (idx / (serie.length - 1)) * plotW;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(xCur, padT);
      ctx.lineTo(xCur, padT + plotH);
      ctx.stroke();
    }
  }

  function dibujarGraficaTemporal(ev) {
    const canvas = els.canvasGrafica;
    if (!canvas || !ev) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const serie = ev.serie_temporal || [];
    if (serie.length < 2) return;

    if (state.nivelConocimiento === 'estudiante') {
      if (els.lblRangoGrafica) {
        els.lblRangoGrafica.textContent = 'Rojo = Luz del Sol • Azul = Llamadas con la Tierra';
      }
      dibujarGraficaSimpleNino(ctx, w, h, ev, serie);
      return;
    }

    if (els.lblRangoGrafica) {
      const pasoActual = state.nivelConocimiento === 'profesional'
        ? (els.selPasoHorasProf?.value || '1')
        : (els.selBridgePaso?.value || '6');
      els.lblRangoGrafica.textContent = `${serie.length} puntos calculados (Δt = ${pasoActual}h)`;
    }

    if (state.modoGrafica === 'POLAR') {
      dibujarCartaPolar360(ctx, w, h, ev, serie);
      return;
    }
    if (state.modoGrafica === 'ENERGIA') {
      dibujarGraficaEnergiaBaterias(ctx, w, h, ev, serie);
      return;
    }

    const esPrecisa = state.modoGrafica === 'PRECISA' ||
      (state.nivelConocimiento === 'estandar' && els.chkBridgePrecisa && els.chkBridgePrecisa.checked);
    ctx.fillStyle = '#04112B';
    ctx.fillRect(0, 0, w, h);

    const padL = 48;
    const padR = 54;
    const padT = 20;
    const padB = 28;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // En modo PRECISA dibujamos sub-rejilla cada 10% y eje derecho de elevación (-10° a +10°)
    const pasosRejilla = esPrecisa ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] : [0, 25, 50, 75, 100];
    ctx.lineWidth = 1;
    ctx.font = '10px Consolas, monospace';
    pasosRejilla.forEach((pct) => {
      const y = padT + plotH * (1 - pct / 100.0);
      ctx.strokeStyle = pct % 50 === 0 ? 'rgba(71, 115, 170, 0.55)' : 'rgba(71, 115, 170, 0.22)';
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      if (esPrecisa ? pct % 20 === 0 : pct % 50 === 0) {
        ctx.fillStyle = '#DCE4EF';
        ctx.fillText(`${pct}%`, 6, y + 3);
      }
      if (esPrecisa && pct % 25 === 0) {
        const degVal = ((pct / 100.0) * 20.0 - 10.0).toFixed(1);
        ctx.fillStyle = '#4773AA';
        ctx.fillText(`${degVal}°`, w - padR + 4, y + 3);
      }
    });

    // Banda sombreada de la Mejor Ventana Continua
    if (ev.mejor_ventana && ev.mejor_ventana.encontrada) {
      const idx0 = serie.findIndex((s) => s.fecha === ev.mejor_ventana.fecha_inicio_optima);
      const idx1 = serie.findIndex((s) => s.fecha === ev.mejor_ventana.fecha_fin_optima);
      if (idx0 >= 0 && idx1 >= idx0) {
        const x0 = padL + (idx0 / (serie.length - 1)) * plotW;
        const x1 = padL + (idx1 / (serie.length - 1)) * plotW;
        ctx.fillStyle = 'rgba(220, 228, 239, 0.18)';
        ctx.fillRect(x0, padT, Math.max(5, x1 - x0), plotH);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(x0, padT, Math.max(5, x1 - x0), plotH);
      }
    }

    const verSol = els.chkSerieSol ? els.chkSerieSol.checked : true;
    const verCom = els.chkSerieCom ? els.chkSerieCom.checked : true;
    const verTemp = els.chkSerieTemp ? els.chkSerieTemp.checked : esPrecisa;
    const verElev = els.chkSerieElev ? els.chkSerieElev.checked : esPrecisa;

    if (verTemp) {
      ctx.save();
      ctx.strokeStyle = '#DCE4EF';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      serie.forEach((s, i) => {
        const x = padL + (i / (serie.length - 1)) * plotW;
        const pctTemp = Math.min(100, Math.max(0, ((s.temperatura_k - 30) / 220.0) * 100.0));
        const y = padT + plotH * (1 - pctTemp / 100.0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    if (verElev) {
      ctx.save();
      ctx.strokeStyle = '#4773AA';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      serie.forEach((s, i) => {
        const x = padL + (i / (serie.length - 1)) * plotW;
        const pctEl = Math.min(100, Math.max(0, ((s.elevacion_solar_deg + 10.0) / 20.0) * 100.0));
        const y = padT + plotH * (1 - pctEl / 100.0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    if (verCom) {
      ctx.save();
      ctx.strokeStyle = '#105BD8';
      ctx.lineWidth = esPrecisa ? 2.0 : 2.3;
      if (state.daltonismoActivo) ctx.setLineDash([7, 5]);
      ctx.beginPath();
      serie.forEach((s, i) => {
        const x = padL + (i / (serie.length - 1)) * plotW;
        const comVal = obtenerValorComMuestra(s);
        const y = padT + plotH * (1 - comVal / 100.0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    let idxMaxSol = 0;
    let idxMinSol = 0;
    if (verSol) {
      ctx.save();
      ctx.strokeStyle = '#FC3D21';
      ctx.lineWidth = esPrecisa ? 2.1 : 2.4;
      ctx.beginPath();
      serie.forEach((s, i) => {
        if (s.iluminacion_pct > serie[idxMaxSol].iluminacion_pct) idxMaxSol = i;
        if (s.iluminacion_pct < serie[idxMinSol].iluminacion_pct) idxMinSol = i;
        const x = padL + (i / (serie.length - 1)) * plotW;
        const y = padT + plotH * (1 - s.iluminacion_pct / 100.0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    // En Modo PRECISA anotamos automáticamente el Pico Máximo y el Valle Mínimo en la gráfica
    if (esPrecisa && verSol) {
      const xMax = padL + (idxMaxSol / (serie.length - 1)) * plotW;
      const yMax = padT + plotH * (1 - serie[idxMaxSol].iluminacion_pct / 100.0);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9.5px Consolas, monospace';
      ctx.fillText(`▲ Máx ${serie[idxMaxSol].iluminacion_pct.toFixed(1)}% (${serie[idxMaxSol].elevacion_solar_deg.toFixed(2)}°)`, Math.min(w - 180, Math.max(padL, xMax - 40)), Math.max(13, yMax - 6));

      const xMin = padL + (idxMinSol / (serie.length - 1)) * plotW;
      const yMin = padT + plotH * (1 - serie[idxMinSol].iluminacion_pct / 100.0);
      ctx.fillStyle = '#DCE4EF';
      ctx.fillText(`▼ Mín ${serie[idxMinSol].iluminacion_pct.toFixed(1)}%`, Math.min(w - 140, Math.max(padL, xMin - 30)), Math.min(h - 32, yMin + 12));
    }

    // Crosshair interactivo
    if (state.hoverGraficaIdx !== null && serie[state.hoverGraficaIdx]) {
      const idx = state.hoverGraficaIdx;
      const mues = serie[idx];
      const xCur = padL + (idx / (serie.length - 1)) * plotW;

      ctx.save();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xCur, padT);
      ctx.lineTo(xCur, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      if (verSol) {
        const yS = padT + plotH * (1 - mues.iluminacion_pct / 100.0);
        ctx.fillStyle = '#FC3D21';
        ctx.beginPath();
        ctx.arc(xCur, yS, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      }
      if (verCom) {
        const comV = obtenerValorComMuestra(mues);
        const yC = padT + plotH * (1 - comV / 100.0);
        ctx.fillStyle = '#105BD8';
        ctx.beginPath();
        ctx.arc(xCur, yC, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.fillStyle = '#DCE4EF';
    ctx.font = '10px Consolas, monospace';
    ctx.fillText(serie[0].fecha, padL, h - 7);
    const txtFin = serie[serie.length - 1].fecha;
    ctx.fillText(txtFin, w - padR - 112, h - 7);
  }

  function manejarHoverGrafica(evMouse) {
    const canvas = els.canvasGrafica;
    const busq = state.ultimaBusqueda;
    if (!canvas || !busq || !busq.evaluacion_principal) return;
    const ev = busq.evaluacion_principal;
    const serie = ev.serie_temporal || [];
    if (serie.length < 2) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const xPx = (evMouse.clientX - rect.left) * scaleX;
    const padL = state.nivelConocimiento === 'estudiante' ? 96 : 48;
    const padR = state.nivelConocimiento === 'estudiante' ? 24 : 54;
    const plotW = canvas.width - padL - padR;

    const frac = Math.max(0, Math.min(1, (xPx - padL) / plotW));
    const idx = Math.round(frac * (serie.length - 1));
    state.hoverGraficaIdx = idx;

    const s = serie[idx];
    const comV = obtenerValorComMuestra(s);
    const tempC = (s.temperatura_k - 273.15).toFixed(0);
    const potKw = (s.potencia_generada_kw || 0).toFixed(2);
    const socPct = (s.bateria_soc_pct || 85).toFixed(1);

    if (els.chartHoverReadout) {
      if (state.nivelConocimiento === 'estudiante') {
        const estadoSol = s.iluminacion_pct >= 75 ? '¡Mucho Sol!' : s.iluminacion_pct >= 30 ? 'Luz media' : 'En sombra';
        const estadoCom = comV >= 70 ? 'Muy bien' : comV >= 35 ? 'Regular' : 'Sin señal';
        els.chartHoverReadout.innerHTML =
          `<span>📅 Día: <strong>${(s.fecha || '').slice(0, 10)}</strong></span>` +
          `<span>☀️ Sol: <strong>${estadoSol} (${s.iluminacion_pct.toFixed(0)}%)</strong></span>` +
          `<span>📱 Tierra: <strong>${estadoCom} (${comV.toFixed(0)}%)</strong></span>` +
          `<span>🌡️ Temperatura: <strong>${tempC} °C</strong></span>`;
      } else {
        els.chartHoverReadout.innerHTML =
          `<span>📅 <strong>${s.fecha} UTC</strong> (#${idx + 1}/${serie.length})</span>` +
          `<span>☀️ Luz: <strong>${s.iluminacion_pct.toFixed(1)}%</strong> (${s.irradiancia_wm2.toFixed(0)} W/m²)</span>` +
          `<span>📡 Enlace: <strong>${comV.toFixed(1)}%</strong></span>` +
          `<span>⚡ FV: <strong>${potKw} kW</strong> (Bat: <strong>${socPct}%</strong>)</span>` +
          `<span>📐 Sol: <strong>${s.elevacion_solar_deg.toFixed(2)}°</strong> | Temp: <strong>${s.temperatura_k.toFixed(0)} K (${tempC} °C)</strong></span>`;
      }
    }

    dibujarGraficaTemporal(ev);
  }

  // ==========================================================================
  // LABORATORIO DE INGENIERÍA AVANZADA (MODO PROFESIONAL - 8 ESTUDIOS + EXPORT)
  // ==========================================================================
  function actualizarTelemetriaProfesional(ev) {
    const mv = ev.mejor_ventana;
    const serie = ev.serie_temporal || [];
    const areaM2 = parseFloat(els.inpAreaPanelesProf?.value || '40') || 40;
    const eficPct = parseFloat(els.inpEficienciaSolarProf?.value || '32') || 32;
    const consumoHabKw = parseFloat(els.inpConsumoHabProf?.value || '3.5') || 3.5;
    const diamAntenaM = parseFloat(els.inpDiamAntenaProf?.value || '1.2') || 1.2;
    const banda = els.selBandaComProf?.value || 'X';
    const pasoH = parseFloat(els.selPasoHorasProf?.value || '1') || 1;

    let sumIrradVentana = 0;
    let maxPotKw = 0;
    const i0 = mv.indice_inicio || 0;
    const i1 = mv.indice_fin || serie.length - 1;
    const nV = Math.max(1, i1 - i0 + 1);
    for (let i = i0; i <= i1 && i < serie.length; i++) {
      sumIrradVentana += serie[i].irradiancia_wm2 || 0;
      const pKw = (serie[i].irradiancia_wm2 * areaM2 * (eficPct / 100.0)) / 1000.0;
      if (pKw > maxPotKw) maxPotKw = pKw;
    }
    const irradMediaWm2 = sumIrradVentana / nV;
    const potenciaMediaKw = (irradMediaWm2 * areaM2 * (eficPct / 100.0)) / 1000.0;
    const energiaVentanaKwh = potenciaMediaKw * mv.duracion_horas;

    let fsplDb = 211.4;
    let margenDb = 8.5 + mv.media_elevacion_tierra_deg * 0.4 + 6.0 * Math.log10(Math.max(0.3, diamAntenaM));
    let tasaMbps = 48.0 * (mv.media_comunicacion_pct / 100.0) * Math.pow(diamAntenaM / 1.2, 2);
    if (banda === 'S') {
      fsplDb = 199.8;
      margenDb = 11.4 + mv.media_elevacion_tierra_deg * 0.35 + 6.0 * Math.log10(Math.max(0.3, diamAntenaM));
      tasaMbps = 3.2 * (mv.media_comunicacion_pct / 100.0) * (diamAntenaM / 1.2);
    } else if (banda === 'KA') {
      fsplDb = 221.2;
      margenDb = 6.2 + mv.media_elevacion_tierra_deg * 0.45 + 6.0 * Math.log10(Math.max(0.3, diamAntenaM));
      tasaMbps = 340.0 * (mv.media_comunicacion_pct / 100.0) * Math.pow(diamAntenaM / 1.2, 2);
    } else if (banda === 'LASER') {
      fsplDb = 294.0;
      margenDb = 4.6 + mv.media_elevacion_tierra_deg * 0.5;
      tasaMbps = 1850.0 * (mv.media_comunicacion_pct / 100.0);
    }

    let maxPasosDeficitSeguidos = 0;
    let rachaActual = 0;
    serie.forEach((s) => {
      const pKw = (s.irradiancia_wm2 * areaM2 * (eficPct / 100.0)) / 1000.0;
      if (pKw < consumoHabKw) {
        rachaActual++;
        if (rachaActual > maxPasosDeficitSeguidos) maxPasosDeficitSeguidos = rachaActual;
      } else {
        rachaActual = 0;
      }
    });
    const horasDeficitMax = maxPasosDeficitSeguidos * pasoH;
    const capBateriaKwh = Math.max(15.0, horasDeficitMax * consumoHabKw * 0.65);
    const masaBateriasKg = Math.round(capBateriaKwh / 0.35);

    const diasVentana = Math.max(1.0, mv.duracion_horas / 24.0);
    const factorHorizonte = ev.punto.altitud_m < 0 ? 0.68 : 0.88;
    const dosisMsv = diasVentana * 1.12 * factorHorizonte;
    const espesorRegolitoCm = Math.round(35 + (ev.punto.altitud_m > 2500 ? 25 : 12));

    let minTempK = 400;
    let maxTempK = 0;
    serie.forEach((s) => {
      if (s.temperatura_k < minTempK) minTempK = s.temperatura_k;
      if (s.temperatura_k > maxTempK) maxTempK = s.temperatura_k;
    });
    const deltaTK = Math.max(5.0, maxTempK - minTempK);
    const deltaVDescensoMs = Math.round(1845 + Math.abs(ev.punto.latitud_deg + 90.0) * 8.5 + Math.max(0, ev.punto.altitud_m) * 0.012);

    if (els.profKpiPotencia) els.profKpiPotencia.textContent = `${potenciaMediaKw.toFixed(2)} kW (Pico ${maxPotKw.toFixed(1)} kW)`;
    if (els.profSubPotencia) els.profSubPotencia.textContent = `Área ${areaM2} m² • Efic. ${eficPct}%`;

    if (els.profKpiEnergia) els.profKpiEnergia.textContent = `${energiaVentanaKwh.toFixed(0)} kWh`;
    if (els.profSubEnergia) {
      els.profSubEnergia.textContent = `Vs demanda ${consumoHabKw} kW: ${potenciaMediaKw >= consumoHabKw ? '✓ Superávit' : '▲ Déficit (Usa Batería)'}`;
    }

    if (els.profKpiIrradiancia) els.profKpiIrradiancia.textContent = `${irradMediaWm2.toFixed(0)} W/m²`;
    if (els.profSubIrradiancia) els.profSubIrradiancia.textContent = `Despeje solar medio: ${mv.media_elevacion_solar_deg.toFixed(2)}°`;

    if (els.profKpiEnlace) els.profKpiEnlace.textContent = `${margenDb.toFixed(1)} dB • ${tasaMbps.toFixed(1)} Mbps`;
    if (els.profSubEnlace) els.profSubEnlace.textContent = `Banda ${banda} • Antena Ø ${diamAntenaM} m (FSPL ${fsplDb.toFixed(0)} dB)`;

    if (els.profKpiBateriaNoche) els.profKpiBateriaNoche.textContent = `${capBateriaKwh.toFixed(0)} kWh (${masaBateriasKg} kg Li-S)`;
    if (els.profSubBateriaNoche) els.profSubBateriaNoche.textContent = `Máx. déficit continuo: ${horasDeficitMax.toFixed(1)} h`;

    if (els.profKpiRadiacion) els.profKpiRadiacion.textContent = `${dosisMsv.toFixed(1)} mSv • Blindaje ${espesorRegolitoCm} cm`;
    if (els.profSubRadiacion) els.profSubRadiacion.textContent = `GCR espacial + bloqueo topográfico`;

    if (els.profKpiTermico) els.profKpiTermico.textContent = `ΔT ${deltaTK.toFixed(0)} K (${minTempK.toFixed(0)}–${maxTempK.toFixed(0)} K)`;
    if (els.profSubTermico) els.profSubTermico.textContent = `Emisividad regolito ε = 0.95`;

    if (els.profKpiDeltaV) els.profKpiDeltaV.textContent = `${deltaVDescensoMs} m/s (NRHO → Sur)`;
    if (els.profSubDeltaV) els.profSubDeltaV.textContent = `Pendiente LOLA: ${ev.pendiente_terreno_deg.toFixed(1)}°`;
  }

  function exportarEfemeridesCsv() {
    if (!state.ultimaBusqueda || !state.ultimaBusqueda.evaluacion_principal) return;
    const ev = state.ultimaBusqueda.evaluacion_principal;
    const serie = ev.serie_temporal || [];
    const lines = [
      'Indice,Fecha_UTC,Iluminacion_Pct,Irradiancia_Wm2,Elevacion_Solar_Deg,Azimut_Solar_Deg,Elevacion_Tierra_Deg,Comunicacion_Efectiva_Pct,Potencia_FV_kW,Bateria_SoC_Pct,Temperatura_K',
    ];
    serie.forEach((s) => {
      lines.push(
        `${s.indice},"${s.fecha}",${s.iluminacion_pct.toFixed(2)},${s.irradiancia_wm2.toFixed(2)},` +
          `${s.elevacion_solar_deg.toFixed(3)},${(s.azimut_solar_deg || 0).toFixed(2)},` +
          `${s.elevacion_tierra_deg.toFixed(3)},${obtenerValorComMuestra(s).toFixed(2)},` +
          `${(s.potencia_generada_kw || 0).toFixed(2)},${(s.bateria_soc_pct || 85).toFixed(1)},${s.temperatura_k.toFixed(2)}`
      );
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efemerides_polo_sur_${ev.punto.id || 'zona'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportarInformeJson() {
    if (!state.ultimaBusqueda) return;
    const blob = new Blob([JSON.stringify(state.ultimaBusqueda, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_mision_nasa_polo_sur.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function actualizarPuenteIntermedio(ev) {
    if (!ev || !ev.mejor_ventana) return;
    const mv = ev.mejor_ventana;
    const serie = ev.serie_temporal || [];
    const mediaIrrad = serie.length
      ? serie.reduce((acc, s) => acc + (s.irradiancia_wm2 || 0), 0) / serie.length
      : 280;
    if (els.bridgeLuzPct) els.bridgeLuzPct.textContent = `${mv.media_iluminacion_pct.toFixed(0)}% de luz solar`;
    if (els.bridgeIrradKw) els.bridgeIrradKw.textContent = `${mediaIrrad.toFixed(0)} W/m² • ${(mv.media_potencia_kw || 3.5).toFixed(2)} kW`;
    if (els.bridgeComPct) els.bridgeComPct.textContent = `${mv.media_comunicacion_pct.toFixed(0)}% de enlace`;
    if (els.bridgeElevDeg) els.bridgeElevDeg.textContent = `Sol ${mv.media_elevacion_solar_deg.toFixed(1)}° | Tierra ${mv.media_elevacion_tierra_deg.toFixed(1)}°`;
    if (els.bridgeTempC) els.bridgeTempC.textContent = `${(ev.temperatura_media_k - 273.15).toFixed(0)} °C`;
    if (els.bridgeTempK) els.bridgeTempK.textContent = `${ev.temperatura_media_k.toFixed(1)} K (Ping: 2.56 s)`;
  }

  function renderResultadoBusqueda(data, opciones = {}) {
    state.ultimaBusqueda = data;
    const ev = data.evaluacion_principal;
    const p = ev.punto;
    const modoBusq = data.modo_busqueda || 'AMBAS';
    const esEst = state.nivelConocimiento === 'estudiante';
    const esProf = state.nivelConocimiento === 'profesional';
    const infoFoto = FOTO_REAL_POR_ZONA[p.id] || FOTO_REAL_POR_ZONA.custom;

    if (els.bannerResultadoModoBusqueda) {
      const nomPrincipal = obtenerNombrePuntoSegunModo(p.id, p.nombre);
      const mv0 = ev.mejor_ventana;
      if (modoBusq === 'SOLO_FECHAS') {
        els.bannerResultadoModoBusqueda.innerHTML = esEst
          ? `<span>📍 <strong>¡Sitio recomendado para tus días!</strong> El mejor ganador es <strong>${nomPrincipal}</strong> (Mira toda la lista abajo).</span>`
          : `<span>📍 <strong>Búsqueda Solo por Fechas:</strong> Mejor zona recomendada = <strong>${nomPrincipal}</strong> (${ev.puntuacion_booking_10.toFixed(1)}/10). Ranking completo abajo.</span>`;
      } else if (modoBusq === 'SOLO_LUGAR') {
        els.bannerResultadoModoBusqueda.innerHTML = esEst
          ? `<span>🗓️ <strong>¡Mejores días encontrados para ${nomPrincipal}!</strong> Del <strong>${mv0.fecha_inicio_optima.slice(0, 10)}</strong> al <strong>${mv0.fecha_fin_optima.slice(0, 10)}</strong>.</span>`
          : `<span>🗓️ <strong>Búsqueda Solo por Lugar (Escaneo 6 meses):</strong> Mejor ventana para ${nomPrincipal}: <strong>${mv0.fecha_inicio_optima} &rarr; ${mv0.fecha_fin_optima} UTC</strong>.</span>`;
      } else if (modoBusq === 'SIN_ESPECIFICAR') {
        els.bannerResultadoModoBusqueda.innerHTML = esEst
          ? `<span>🌟 <strong>¡Combinación ganadora!</strong> Ve a <strong>${nomPrincipal}</strong> del ${mv0.fecha_inicio_optima.slice(0, 10)} al ${mv0.fecha_fin_optima.slice(0, 10)}.</span>`
          : `<span>🌟 <strong>Recomendación Automática Global:</strong> ${nomPrincipal} entre ${mv0.fecha_inicio_optima} y ${mv0.fecha_fin_optima} UTC.</span>`;
      } else {
        els.bannerResultadoModoBusqueda.innerHTML = esEst
          ? `<span>📈 <strong>Resumen de tu viaje a ${nomPrincipal}:</strong> Abajo ves los dibujos y la nota.</span>`
          : `<span>📈 <strong>Evolución completa en ${nomPrincipal}:</strong> ${ev.serie_temporal.length} instantes calculados entre tus fechas.</span>`;
      }
    }

    // Mostrar Top 5 ventanas de fechas recomendadas especialmente en modo SOLO_LUGAR o SIN_ESPECIFICAR
    if (els.panelTopFechasRecomendadas && els.gridTopFechasRecomendadas) {
      const topFechas = ev.top_ventanas_fechas || [];
      const mostrarTopFechas = (modoBusq === 'SOLO_LUGAR' || modoBusq === 'SIN_ESPECIFICAR' || esProf) && topFechas.length > 0;
      els.panelTopFechasRecomendadas.style.display = mostrarTopFechas ? 'block' : 'none';
      if (mostrarTopFechas) {
        els.gridTopFechasRecomendadas.innerHTML = '';
        topFechas.forEach((v, idx) => {
          const card = document.createElement('div');
          card.className = 'top-fecha-chip' + (idx === 0 ? ' rank-1' : '');
          const iniCorto = esEst ? v.fecha_inicio_optima.slice(0, 10) : v.fecha_inicio_optima;
          const finCorto = esEst ? v.fecha_fin_optima.slice(0, 10) : v.fecha_fin_optima;
          card.innerHTML = `
            <strong>${idx === 0 ? '🏆 #1 Mejor Ventana' : `📅 Opción #${idx + 1}`}</strong>
            <span>${iniCorto} &rarr; ${finCorto}</span>
            <span>☀️ Sol: <strong>${v.media_iluminacion_pct.toFixed(1)}%</strong> | 📡 Enlace: <strong>${v.media_comunicacion_pct.toFixed(1)}%</strong></span>
            <button type="button" class="btn btn-outline-blue btn-aplicar-ventana" style="padding:3px 8px; font-size:11px; margin-top:2px;">
              🔎 ${esEst ? 'Ver solo estos días' : 'Inspeccionar estas fechas'}
            </button>
          `;
          card.querySelector('.btn-aplicar-ventana').addEventListener('click', () => {
            if (els.chkSinFechaFija) els.chkSinFechaFija.checked = false;
            const dIniIso = v.fecha_inicio_optima.replace(' ', 'T').slice(0, 16);
            const dFinIso = v.fecha_fin_optima.replace(' ', 'T').slice(0, 16);
            if (els.inpFechaInicio) els.inpFechaInicio.value = dIniIso;
            if (els.inpFechaFin) els.inpFechaFin.value = dFinIso;
            if (els.selPuntoLunar && els.selPuntoLunar.value === 'NINGUNO') {
              els.selPuntoLunar.value = p.id;
              sincronizarInputsPuntoSeleccionado();
            }
            sincronizarModoIntentUI();
            ejecutarBusqueda({ scrollAResultados: true });
          });
          els.gridTopFechasRecomendadas.appendChild(card);
        });
      }
    }

    if (els.imgFeaturedPunto) {
      els.imgFeaturedPunto.src = infoFoto.img;
      els.imgFeaturedPunto.alt = p.nombre;
    }
    if (els.lblFeaturedPhotoCredit) {
      els.lblFeaturedPhotoCredit.textContent = infoFoto.credito;
    }

    els.tituloPuntoEvaluado.textContent = obtenerNombrePuntoSegunModo(p.id, p.nombre);
    els.txtResumenHumanoLugar.textContent = obtenerDescripcionPuntoSegunModo(p.id, p.descripcion);

    const mastilM = esProf ? (parseFloat(els.inpAlturaMastilProf?.value || '0') || 0) : 0;
    const esfCalc = selenograficasAEsfericas(p.latitud_deg, p.longitud_deg, p.altitud_m);
    els.subtituloCoordsPunto.textContent =
      `Polo Sur Lunar • Esféricas: r=${esfCalc.rKm.toFixed(3)} km, θ=${esfCalc.thetaDeg.toFixed(2)}°, φ=${esfCalc.phiDeg.toFixed(1)}° | ` +
      `Lat: ${p.latitud_deg.toFixed(2)}°S, Lon: ${p.longitud_deg.toFixed(2)}° | ` +
      `Altitud: ${Math.round(p.altitud_m)} m ${mastilM > 0 ? `(mástil +${mastilM}m)` : ''} | Pend.: ${ev.pendiente_terreno_deg.toFixed(1)}°`;

    els.txtValoracionPunto.textContent = esEst
      ? ev.puntuacion_booking_10 >= 8.5
        ? '¡Súper Bien!'
        : ev.puntuacion_booking_10 >= 7.0
          ? 'Buen Sitio'
          : 'Difícil'
      : ev.etiqueta_valoracion;
    els.numScorePunto.textContent = ev.puntuacion_booking_10.toFixed(1);

    const iconoEstado = state.daltonismoActivo ? (ev.cumple_todos_los_filtros ? '[✓ APTO] ' : '[▲ AVISO] ') : '';
    if (ev.cumple_todos_los_filtros) {
      els.badgeCumplimiento.textContent = esEst
        ? `${iconoEstado}🎉 ¡PERFECTO PARA TU VIAJE!`
        : `${iconoEstado}CUMPLE TODOS TUS FILTROS DE MISIÓN (POLO SUR)`;
      els.badgeCumplimiento.style.backgroundColor = '#0B3D91';
    } else {
      els.badgeCumplimiento.textContent = esEst
        ? `${iconoEstado}💡 MIRA TUS MEJORES DÍAS ABAJO`
        : `${iconoEstado}CUMPLIMIENTO PARCIAL (MIRA VENTANA ÓPTIMA)`;
      els.badgeCumplimiento.style.backgroundColor = '#FC3D21';
    }

    const mv = ev.mejor_ventana;
    const diasEquiv = (mv.duracion_horas / 24.0).toFixed(1);
    if (esEst) {
      els.txtResumenVentanaOptima.innerHTML =
        `🌟 Mejores días: del <strong>${mv.fecha_inicio_optima.slice(0, 10)}</strong> al <strong>${mv.fecha_fin_optima.slice(0, 10)}</strong> ` +
        `(<strong>${diasEquiv} días</strong>) • Luz de Sol: <strong>${mv.media_iluminacion_pct.toFixed(0)}%</strong> • Llamadas: <strong>${mv.media_comunicacion_pct.toFixed(0)}%</strong>.`;
    } else if (esProf) {
      const banda = els.selBandaComProf?.value || 'X';
      els.txtResumenVentanaOptima.innerHTML =
        `Ventana óptima de alta resolución (<code>Δt = ${els.selPasoHorasProf?.value || 1}h</code>, <strong>${mv.num_muestras} muestras</strong> = ${mv.duracion_horas.toFixed(1)} h ≈ ${diasEquiv} d): ` +
        `<strong>${mv.fecha_inicio_optima} UTC</strong> &rarr; <strong>${mv.fecha_fin_optima} UTC</strong> | ` +
        `Índice objetivo: <strong>${mv.media_maxima_valor.toFixed(2)}%</strong> (Banda ${banda}, Mástil +${mastilM} m).`;
    } else {
      els.txtResumenVentanaOptima.innerHTML =
        `Mejor ventana continua entre <strong>${mv.fecha_inicio_optima} UTC</strong> y ` +
        `<strong>${mv.fecha_fin_optima} UTC</strong> (${mv.num_muestras} muestras / ${mv.duracion_horas.toFixed(0)} h ≈ ${diasEquiv} días) ` +
        `con <strong>media máxima combinada de ${mv.media_maxima_valor.toFixed(2)}%</strong>.`;
    }

    els.kpiVentanaIlu.textContent = `${mv.media_iluminacion_pct.toFixed(1)}%`;
    els.subKpiIlu.textContent = esEst
      ? mv.media_iluminacion_pct >= 80
        ? '¡Muchísimo Sol para tus paneles!'
        : 'Tendrás ratos de sombra (usa baterías)'
      : mv.media_iluminacion_pct >= 80
        ? 'Alta exposición solar'
        : 'Con eclipses topográficos';

    els.kpiVentanaCom.textContent = `${mv.media_comunicacion_pct.toFixed(1)}%`;
    els.subKpiCom.textContent = esEst
      ? els.selModoEnlace.value === 'DTE'
        ? 'Hablando directo con la Tierra'
        : 'Con ayuda de satélite espacial'
      : els.selModoEnlace.value === 'DTE'
        ? `Directo a Tierra (${esProf ? 'Banda ' + (els.selBandaComProf?.value || 'X') : 'DTE'})`
        : 'Con Satélite Relé LunaNet';

    els.kpiVentanaSol.textContent = esEst
      ? `${mv.media_elevacion_solar_deg.toFixed(1)}° sobre las montañas`
      : `${mv.media_elevacion_solar_deg.toFixed(2)}° / Máx ${ev.max_elevacion_solar_deg.toFixed(2)}°`;
    els.subKpiSol.textContent = esEst
      ? `Inclinación del suelo: ${ev.pendiente_terreno_deg.toFixed(0)}° (fácil)`
      : `Pendiente LOLA: ${ev.pendiente_terreno_deg.toFixed(1)}°`;

    els.kpiVentanaTie.textContent = kelvinACelsiusTexto(ev.temperatura_media_k, esEst);
    els.subKpiTemp.textContent = esEst
      ? '¡Recuerda llevar tu traje espacial térmico!'
      : `Tierra a ${mv.media_elevacion_tierra_deg.toFixed(2)}° sobre horizonte`;

    actualizarTelemetriaProfesional(ev);
    actualizarPuenteIntermedio(ev);
    dibujarGraficaTemporal(ev);
    dibujarMapaPoloSur2D();

    const ofertas = [...(data.ofertas_recomendadas || [])].sort(
      (a, b) => b.puntuacion_booking_10 - a.puntuacion_booking_10
    );
    els.listaOfertasBooking.innerHTML = '';

    ofertas.forEach((of) => {
      const nombreCard = obtenerNombrePuntoSegunModo(of.punto.id, of.punto.nombre);
      const descTexto = obtenerDescripcionPuntoSegunModo(of.punto.id, of.punto.descripcion);
      const tempTexto = kelvinACelsiusTexto(of.temperatura_media_k, esEst);
      const prefijoDalt = state.daltonismoActivo ? (of.cumple_todos_los_filtros ? '✓ ' : '▲ ') : '';
      const fotoZona = FOTO_REAL_POR_ZONA[of.punto.id] || FOTO_REAL_POR_ZONA.custom;
      const listaTags = esEst ? fotoZona.tagsNino : esProf ? fotoZona.tagsProf : fotoZona.tagsEstandar;
      const tagsHtml = (listaTags || []).map((t) => `<span class="amenity-tag">${t}</span>`).join('');

      const card = document.createElement('div');
      card.className = 'booking-card ' + (of.cumple_todos_los_filtros ? 'cumple' : 'no-cumple');
      card.innerHTML = `
        <div class="card-thumb">
          <img class="zone-photo-bg" src="${fotoZona.img}" alt="${nombreCard}" loading="lazy" />
          <div class="thumb-overlay">
            <span class="crater-tag">${prefijoDalt}${of.cumple_todos_los_filtros ? (esEst ? '¡IDEAL PARA TI!' : 'APTO POLO SUR') : (esEst ? 'AVENTURA DIFÍCIL' : 'EXTREMO')}</span>
            <span class="crater-coords">${esEst ? `Altura: ${Math.round(of.punto.altitud_m)} m` : `${of.punto.latitud_deg.toFixed(2)}°S • ${Math.round(of.punto.altitud_m)} m`}</span>
          </div>
        </div>
        <div class="card-body">
          <h3>${nombreCard}</h3>
          <div class="agency-amenities">${tagsHtml}</div>
          <p>${descTexto}</p>
          <div class="progress-bars">
            <div class="bar-row">
              <span>${esEst ? '☀️ Luz del Sol' : '☀️ Luz Ventana'}</span>
              <div class="bar-track"><div class="bar-fill-ilu" style="width:${Math.min(100, of.mejor_ventana.media_iluminacion_pct)}%;"></div></div>
              <strong>${of.mejor_ventana.media_iluminacion_pct.toFixed(1)}%</strong>
            </div>
            <div class="bar-row">
              <span>${esEst ? '📱 Hablar con Casa' : '📡 Conexión Tierra'}</span>
              <div class="bar-track"><div class="bar-fill-com" style="width:${Math.min(100, of.mejor_ventana.media_comunicacion_pct)}%;"></div></div>
              <strong>${of.mejor_ventana.media_comunicacion_pct.toFixed(1)}%</strong>
            </div>
          </div>
        </div>
        <div class="card-cta">
          <div class="booking-score-box">
            <div class="score-text">
              <strong>${esEst ? (of.puntuacion_booking_10 >= 8.2 ? '¡Fantástico!' : 'Interesante') : of.etiqueta_valoracion.split('(')[0]}</strong>
              <span>${tempTexto}</span>
            </div>
            <div class="score-number">${of.puntuacion_booking_10.toFixed(1)}</div>
          </div>
          <div class="best-dates-mini">
            <strong>${esEst ? `Mejores días (${(of.mejor_ventana.duracion_horas / 24).toFixed(1)} días):` : `Mejor ventana (${(of.mejor_ventana.duracion_horas / 24).toFixed(1)} d):`}</strong><br>
            ${of.mejor_ventana.fecha_inicio_optima} &rarr; ${of.mejor_ventana.fecha_fin_optima}
          </div>
          <div style="display:flex; gap:6px; width:100%;">
            <button type="button" class="btn btn-blue btn-sel-oferta" style="flex:1; padding:6px 10px; font-size:12px;">
              ${esEst ? 'Elegir este lugar' : 'Seleccionar'}
            </button>
            <button type="button" class="btn btn-outline-blue btn-comp-oferta" style="padding:6px 10px; font-size:12px;">
              ${esEst ? 'Comparar' : 'Comparar'}
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-sel-oferta').addEventListener('click', () => {
        els.selPuntoLunar.value = of.punto.id;
        sincronizarModoIntentUI();
        sincronizarInputsPuntoSeleccionado();
        ejecutarBusqueda({ scrollAResultados: true });
      });

      card.querySelector('.btn-comp-oferta').addEventListener('click', () => {
        els.selCompPuntoB.value = of.punto.id;
        if (els.drawerComparador) els.drawerComparador.open = true;
        ejecutarComparacion();
        document.getElementById('seccionComparador').scrollIntoView({ behavior: 'smooth' });
      });

      els.listaOfertasBooking.appendChild(card);
    });
    if (document.body.classList.contains('modo-autismo')) {
      aplicarLimpiezaAutismo(true);
    }
    if (document.body.classList.contains('modo-tdah')) {
      aplicarPalabrasClaveTdah(true);
    }
    if (state.lupaCursorActiva) {
      reconstruirClonLupaCursor();
    }
  }

  function scrollAResultadosSiInteractivo(debeHacerScroll) {
    if (!debeHacerScroll) return;
    if (els.drawerGraficaTemporal) {
      els.drawerGraficaTemporal.open = true;
    }
    if (els.seccionResultadosPrincipal) {
      els.seccionResultadosPrincipal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (els.featuredResultCard && !document.body.classList.contains('modo-autismo')) {
      els.featuredResultCard.classList.remove('just-updated');
      void els.featuredResultCard.offsetWidth;
      els.featuredResultCard.classList.add('just-updated');
      setTimeout(() => {
        if (els.featuredResultCard) els.featuredResultCard.classList.remove('just-updated');
      }, 1500);
    }
  }

  function esEntornoPublicoEstatico() {
    const host = (window.location.hostname || '').toLowerCase();
    const proto = window.location.protocol || '';
    if (proto === 'file:') return false;
    return host !== 'localhost' && host !== '127.0.0.1' && host !== '::1' && host !== '';
  }

  async function llamarApiCpp(ruta, opciones = {}) {
    if (esEntornoPublicoEstatico() || state.apiCppNoDisponible) {
      throw new Error('STATIC_HOSTING_JS_MODE');
    }
    const esHttp = window.location.protocol === 'http:' || window.location.protocol === 'https:';
    const url = esHttp ? ruta : `http://127.0.0.1:8085${ruta}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), esHttp ? 2500 : 700);
    try {
      const resp = await fetch(url, { ...opciones, signal: ctrl.signal });
      clearTimeout(timer);
      if (!resp.ok) {
        state.apiCppNoDisponible = true;
      }
      return resp;
    } catch (err) {
      clearTimeout(timer);
      state.apiCppNoDisponible = true;
      throw err;
    }
  }

  async function ejecutarBusqueda(opciones = {}) {
    const filtros = leerFiltrosActuales();
    const idSel = els.selPuntoLunar.value;
    const sinLugarFijo = idSel === 'NINGUNO';
    const sinFechaFija = Boolean(els.chkSinFechaFija && els.chkSinFechaFija.checked);
    const latVal = Math.min(-80.0, Math.max(-90.0, parseFloat(els.inpLatitud.value || '-89.78')));
    const lonVal = parseFloat(els.inpLongitud.value || '120.0');
    const altVal = parseFloat(els.inpAltitud.value || '2150');
    const esfActual = selenograficasAEsfericas(latVal, lonVal, altVal);

    const payload = {
      id_punto: idSel,
      sin_lugar_fijo: sinLugarFijo,
      sin_fecha_fija: sinFechaFija,
      tipo_coord: state.tipoCoordActual || 'SELENOGRAFICA',
      nombre: idSel === 'custom'
        ? `Zona Única Mapa 2D Polo Sur (${latVal.toFixed(2)}°S, ${lonVal.toFixed(1)}°)`
        : undefined,
      latitud_deg: latVal,
      longitud_deg: lonVal,
      x_mapa_m: parseFloat(els.inpMapaX.value || '2940'),
      y_mapa_m: parseFloat(els.inpMapaY.value || '-5890'),
      altitud_m: altVal,
      r_km: parseFloat(els.inpEsfRadioKm?.value || esfActual.rKm.toFixed(3)),
      theta_deg: parseFloat(els.inpEsfThetaDeg?.value || esfActual.thetaDeg.toFixed(2)),
      phi_deg: parseFloat(els.inpEsfPhiDeg?.value || esfActual.phiDeg.toFixed(1)),
      fecha_inicio: els.inpFechaInicio.value || '2026-11-15T00:00',
      fecha_fin: els.inpFechaFin.value || '2026-12-15T00:00',
      n_intervalo_deseado: parseInt(els.inpIntervaloN.value || '16', 10),
      margen_intervalo: parseInt(els.inpMargenN.value || '4', 10),
      ...filtros,
    };

    try {
      const resp = await llamarApiCpp('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.ok) {
          state.servidorCppActivo = true;
          els.badgeEstadoMotor.textContent = 'Motor C++17 Conectado';
          renderResultadoBusqueda(data, opciones);
          scrollAResultadosSiInteractivo(Boolean(opciones.scrollAResultados));
          return;
        }
      }
    } catch (_) {
      state.servidorCppActivo = false;
      els.badgeEstadoMotor.textContent = esEntornoPublicoEstatico()
        ? 'Web Pública GitHub (Motor JS)'
        : 'Motor Local Activo';
    }

    const payloadEval = sinFechaFija
      ? { ...payload, fecha_inicio: '2026-11-15T00:00', fecha_fin: '2027-05-15T00:00' }
      : payload;
    const filtrosEval = sinFechaFija
      ? { ...filtros, paso_horas: Math.max(6.0, filtros.paso_horas) }
      : filtros;

    const puntoObj =
      state.catalogo.find((x) => x.id === idSel) || {
        id: 'custom',
        nombre: payload.nombre || 'Zona Única Seleccionada en Mapa 2D (Polo Sur)',
        region: 'Polo Sur Lunar • Punto Seleccionado en Mapa 2D',
        latitud_deg: payload.latitud_deg,
        longitud_deg: payload.longitud_deg,
        x_mapa_m: payload.x_mapa_m,
        y_mapa_m: payload.y_mapa_m,
        altitud_m: payload.altitud_m,
        descripcion: 'Zona específica del Polo Sur Lunar seleccionada directamente sobre la fotografía real de la Luna.',
      };

    const ofertas = state.catalogo
      .map((c) => evaluarLocalEnJs(c, payloadEval, filtrosEval))
      .sort((a, b) => {
        if (b.cumple_todos_los_filtros !== a.cumple_todos_los_filtros) {
          return b.cumple_todos_los_filtros ? 1 : -1;
        }
        return b.puntuacion_booking_10 - a.puntuacion_booking_10;
      });
    const evPrincipal = sinLugarFijo && ofertas.length > 0
      ? ofertas[0]
      : evaluarLocalEnJs(puntoObj, payloadEval, filtrosEval);
    const modoBusqueda =
      sinLugarFijo && !sinFechaFija
        ? 'SOLO_FECHAS'
        : !sinLugarFijo && sinFechaFija
          ? 'SOLO_LUGAR'
          : sinLugarFijo && sinFechaFija
            ? 'AMBAS_LIBRE'
            : 'AMBAS';

    renderResultadoBusqueda(
      {
        ok: true,
        modo_busqueda: modoBusqueda,
        sin_lugar_fijo: sinLugarFijo,
        sin_fecha_fija: sinFechaFija,
        evaluacion_principal: evPrincipal,
        ofertas_recomendadas: ofertas,
      },
      opciones
    );
    scrollAResultadosSiInteractivo(Boolean(opciones.scrollAResultados));
  }

  function renderResultadoComparacion(comp) {
    state.ultimaComparacion = comp;
    const a = comp.eval_a;
    const b = comp.eval_b;
    const esEst = state.nivelConocimiento === 'estudiante';

    const nomA = obtenerNombrePuntoSegunModo(a.punto.id, a.punto.nombre);
    const nomB = obtenerNombrePuntoSegunModo(b.punto.id, b.punto.nombre);
    const ganNombre = a.puntuacion_booking_10 >= b.puntuacion_booking_10 ? nomA : nomB;

    els.bannerGanadorComp.textContent = esEst
      ? `🏆 El mejor lugar para tu viaje es: ${ganNombre} (Nota ${Math.max(a.puntuacion_booking_10, b.puntuacion_booking_10).toFixed(1)} sobre 10)`
      : `🏆 ${comp.recomendacion_sintesis}`;
    els.thCompNombreA.textContent = nomA;
    els.thCompNombreB.textContent = nomB;

    const filas = [
      {
        param: esEst ? '🏔️ Altura del lugar' : 'Coordenadas y Altitud en el Polo Sur',
        valA: esEst ? `${Math.round(a.punto.altitud_m)} metros` : `${a.punto.latitud_deg.toFixed(2)}°S, ${a.punto.longitud_deg.toFixed(1)}° (${Math.round(a.punto.altitud_m)} m)`,
        valB: esEst ? `${Math.round(b.punto.altitud_m)} metros` : `${b.punto.latitud_deg.toFixed(2)}°S, ${b.punto.longitud_deg.toFixed(1)}° (${Math.round(b.punto.altitud_m)} m)`,
        win: a.punto.altitud_m >= b.punto.altitud_m ? `Más alto en A` : `Más alto en B`,
        winSide: '',
      },
      {
        param: esEst ? '📅 Mejores días seguidos' : 'Mejor Ventana Continua (Máxima Media)',
        valA: `${a.mejor_ventana.fecha_inicio_optima} a ${a.mejor_ventana.fecha_fin_optima}`,
        valB: `${b.mejor_ventana.fecha_inicio_optima} a ${b.mejor_ventana.fecha_fin_optima}`,
        win:
          a.mejor_ventana.media_maxima_valor >= b.mejor_ventana.media_maxima_valor
            ? `${nomA} (${a.mejor_ventana.media_maxima_valor.toFixed(1)}%)`
            : `${nomB} (${b.mejor_ventana.media_maxima_valor.toFixed(1)}%)`,
        winSide: a.mejor_ventana.media_maxima_valor >= b.mejor_ventana.media_maxima_valor ? 'A' : 'B',
      },
      {
        param: esEst ? '☀️ Luz del Sol disponible (%)' : 'Iluminación Solar Media en Ventana (%)',
        valA: `${a.mejor_ventana.media_iluminacion_pct.toFixed(2)}%`,
        valB: `${b.mejor_ventana.media_iluminacion_pct.toFixed(2)}%`,
        win: a.mejor_ventana.media_iluminacion_pct >= b.mejor_ventana.media_iluminacion_pct ? nomA : nomB,
        winSide: a.mejor_ventana.media_iluminacion_pct >= b.mejor_ventana.media_iluminacion_pct ? 'A' : 'B',
      },
      {
        param: esEst ? '📱 Cobertura con la Tierra (%)' : 'Cobertura de Comunicación en Ventana (%)',
        valA: `${a.mejor_ventana.media_comunicacion_pct.toFixed(2)}%`,
        valB: `${b.mejor_ventana.media_comunicacion_pct.toFixed(2)}%`,
        win: a.mejor_ventana.media_comunicacion_pct >= b.mejor_ventana.media_comunicacion_pct ? nomA : nomB,
        winSide: a.mejor_ventana.media_comunicacion_pct >= b.mejor_ventana.media_comunicacion_pct ? 'A' : 'B',
      },
      {
        param: esEst ? '🛞 Suelo llano y Temperatura' : 'Pendiente Topográfica y Temperatura Media',
        valA: `${a.pendiente_terreno_deg.toFixed(1)}° • ${kelvinACelsiusTexto(a.temperatura_media_k, esEst)}`,
        valB: `${b.pendiente_terreno_deg.toFixed(1)}° • ${kelvinACelsiusTexto(b.temperatura_media_k, esEst)}`,
        win: a.pendiente_terreno_deg <= b.pendiente_terreno_deg ? 'Suelo más llano en A' : 'Suelo más llano en B',
        winSide: a.pendiente_terreno_deg <= b.pendiente_terreno_deg ? 'A' : 'B',
      },
      {
        param: esEst ? '⭐ Nota Final (0 a 10)' : 'Cumplimiento de Filtros + Puntuación Global (0-10)',
        valA: `${a.puntuacion_booking_10.toFixed(2)} / 10`,
        valB: `${b.puntuacion_booking_10.toFixed(2)} / 10`,
        win: ganNombre,
        winSide: a.puntuacion_booking_10 >= b.puntuacion_booking_10 ? 'A' : 'B',
      },
    ];

    els.tbodyComparador.innerHTML = '';
    filas.forEach((f) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${f.param}</strong></td>
        <td class="${f.winSide === 'A' ? 'win-cell' : ''}">${f.valA}</td>
        <td class="${f.winSide === 'B' ? 'win-cell' : ''}">${f.valB}</td>
        <td><strong>${f.win}</strong></td>
      `;
      els.tbodyComparador.appendChild(tr);
    });
    if (document.body.classList.contains('modo-autismo')) {
      aplicarLimpiezaAutismo(true);
    }
    if (document.body.classList.contains('modo-tdah')) {
      aplicarPalabrasClaveTdah(true);
    }
    if (state.lupaCursorActiva) {
      reconstruirClonLupaCursor();
    }
  }

  async function ejecutarComparacion() {
    const filtros = leerFiltrosActuales();
    const idA = els.selCompPuntoA.value;
    const idB = els.chkMismoLugarFechas.checked ? idA : els.selCompPuntoB.value;

    const payload = {
      modo_comparacion: state.modoComparacion,
      id_punto_a: idA,
      id_punto_b: idB,
      fecha_inicio_a: els.inpCompIniA.value || '2026-11-15T00:00',
      fecha_fin_a: els.inpCompFinA.value || '2026-12-01T00:00',
      fecha_inicio_b: els.inpCompIniB.value || '2026-12-01T00:00',
      fecha_fin_b: els.inpCompFinB.value || '2026-12-15T00:00',
      mismo_lugar_fechas: els.chkMismoLugarFechas.checked ? 'true' : 'false',
      n_intervalo_deseado: parseInt(els.inpIntervaloN.value || '16', 10),
      margen_intervalo: parseInt(els.inpMargenN.value || '4', 10),
      ...filtros,
    };

    try {
      const resp = await llamarApiCpp('/api/comparar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.ok) {
          renderResultadoComparacion(data);
          return;
        }
      }
    } catch (_) {}

    const pA = state.catalogo.find((x) => x.id === idA) || state.catalogo[0];
    const pB = state.catalogo.find((x) => x.id === idB) || state.catalogo[1];
    const evA = evaluarLocalEnJs(
      pA,
      {
        fecha_inicio: payload.fecha_inicio_a,
        fecha_fin: payload.fecha_fin_a,
        paso_horas: filtros.paso_horas,
        n_intervalo_deseado: payload.n_intervalo_deseado,
        margen_intervalo: payload.margen_intervalo,
      },
      filtros
    );
    const evB = evaluarLocalEnJs(
      pB,
      {
        fecha_inicio: payload.fecha_inicio_b,
        fecha_fin: payload.fecha_fin_b,
        paso_horas: filtros.paso_horas,
        n_intervalo_deseado: payload.n_intervalo_deseado,
        margen_intervalo: payload.margen_intervalo,
      },
      filtros
    );

    const ganIlu = evA.mejor_ventana.media_iluminacion_pct >= evB.mejor_ventana.media_iluminacion_pct ? pA.nombre : pB.nombre;
    const ganCom = evA.mejor_ventana.media_comunicacion_pct >= evB.mejor_ventana.media_comunicacion_pct ? pA.nombre : pB.nombre;
    const ganGlob = evA.puntuacion_booking_10 >= evB.puntuacion_booking_10 ? pA.nombre : pB.nombre;

    renderResultadoComparacion({
      modo_comparacion: state.modoComparacion,
      eval_a: evA,
      eval_b: evB,
      ganador_iluminacion: ganIlu,
      ganador_comunicacion: ganCom,
      ganador_global: ganGlob,
      recomendacion_sintesis: `Ganador global: ${ganGlob} (Nota ${Math.max(evA.puntuacion_booking_10, evB.puntuacion_booking_10).toFixed(1)}/10). Mejor iluminación en ${ganIlu} y mejor comunicación en ${ganCom}.`,
    });
  }

  function toggleModoClase(btn, claseBody, callbackExtra) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const activo = document.body.classList.toggle(claseBody);
      btn.classList.toggle('active', activo);
      const dot = btn.querySelector('.status-dot');
      if (dot) dot.textContent = activo ? 'Activo' : 'Desactivado';
      if (callbackExtra) callbackExtra(activo);
    });
  }

  function bindEventos() {
    if (els.btnToggleAdaptaciones && els.panelAdaptaciones) {
      els.btnToggleAdaptaciones.addEventListener('click', () => {
        els.panelAdaptaciones.open = !els.panelAdaptaciones.open;
        programarSyncLupaCursor();
      });
    }

    document.querySelectorAll('.a11y-subtab-btn').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-a11y-tab');
        document.querySelectorAll('.a11y-subtab-btn').forEach((b) => {
          const active = b === tabBtn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        document.querySelectorAll('#panelAdaptaciones .adaptation-category-card').forEach((card) => {
          card.classList.toggle('active', card.getAttribute('data-a11y-panel') === target);
        });
        programarSyncLupaCursor();
      });
    });

    if (els.panelAdaptaciones) {
      els.panelAdaptaciones.addEventListener('toggle', () => {
        programarSyncLupaCursor();
      });
      els.panelAdaptaciones.addEventListener('scroll', () => {
        programarSyncLupaCursor();
      }, { passive: true });
    }

    document.addEventListener('toggle', () => {
      programarSyncLupaCursor();
    }, true);

    if (els.appZoomRoot && typeof MutationObserver !== 'undefined') {
      const lupaObserver = new MutationObserver(() => {
        programarSyncLupaCursor();
      });
      lupaObserver.observe(els.appZoomRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['open', 'hidden', 'class', 'style'],
      });
    }

    if (els.btnAbrirMapa2DTop && els.drawerMapaPoloSur2D) {
      els.btnAbrirMapa2DTop.addEventListener('click', () => {
        els.drawerMapaPoloSur2D.open = !els.drawerMapaPoloSur2D.open;
        if (els.drawerMapaPoloSur2D.open) {
          dibujarMapaPoloSur2D();
        }
      });
    }

    if (els.drawerMapaPoloSur2D) {
      els.drawerMapaPoloSur2D.addEventListener('toggle', () => {
        if (els.drawerMapaPoloSur2D.open) {
          dibujarMapaPoloSur2D();
        }
      });
    }

    [els.chkMapaFotoReal, els.chkMapaCrateres, els.chkMapaSitios, els.selTipoFotoMapa2D].forEach((ctrl) => {
      if (ctrl) {
        ctrl.addEventListener('change', () => dibujarMapaPoloSur2D());
      }
    });

    if (els.canvasMapaPoloSur2D) {
      let arrastrando = false;
      els.canvasMapaPoloSur2D.addEventListener('mousedown', (ev) => {
        arrastrando = true;
        seleccionarPuntoDesdeClickMapa2D(ev);
      });
      els.canvasMapaPoloSur2D.addEventListener('mousemove', (ev) => {
        actualizarHoverMapa2D(ev);
        if (arrastrando) seleccionarPuntoDesdeClickMapa2D(ev);
      });
      els.canvasMapaPoloSur2D.addEventListener('mouseleave', () => {
        state.hoverMapaPx = null;
        dibujarMapaPoloSur2D();
      });
      window.addEventListener('mouseup', () => {
        arrastrando = false;
      });
    }

    // Selector de los 4 Modos de Gráfica
    const botonesGraf = [
      [els.btnModoGraficaTemp, 'TEMPORAL'],
      [els.btnModoGraficaPrecisa, 'PRECISA'],
      [els.btnModoGraficaEnergia, 'ENERGIA'],
      [els.btnModoGraficaPolar, 'POLAR'],
    ];
    botonesGraf.forEach(([btn, modo]) => {
      if (btn) {
        btn.addEventListener('click', () => {
          state.modoGrafica = modo;
          actualizarBotonesModoGrafica();
          if (state.ultimaBusqueda) dibujarGraficaTemporal(state.ultimaBusqueda.evaluacion_principal);
        });
      }
    });

    [els.chkSerieSol, els.chkSerieCom, els.chkSerieTemp, els.chkSerieElev].forEach((chk) => {
      if (chk) {
        chk.addEventListener('change', () => {
          if (state.ultimaBusqueda) dibujarGraficaTemporal(state.ultimaBusqueda.evaluacion_principal);
        });
      }
    });

    if (els.canvasGrafica) {
      els.canvasGrafica.addEventListener('mousemove', manejarHoverGrafica);
      els.canvasGrafica.addEventListener('mouseleave', () => {
        state.hoverGraficaIdx = null;
        if (state.ultimaBusqueda) dibujarGraficaTemporal(state.ultimaBusqueda.evaluacion_principal);
      });
    }

    if (els.btnExportarCsvProf) els.btnExportarCsvProf.addEventListener('click', exportarEfemeridesCsv);
    if (els.btnExportarJsonProf) els.btnExportarJsonProf.addEventListener('click', exportarInformeJson);

    [els.btnNivelEstudiante, els.cardNivelEstudiante].forEach((b) => {
      if (b) b.addEventListener('click', () => aplicarNivelConocimiento('estudiante'));
    });
    [els.btnNivelEstandar, els.cardNivelEstandar].forEach((b) => {
      if (b) b.addEventListener('click', () => aplicarNivelConocimiento('estandar'));
    });
    [els.btnNivelProfesional, els.cardNivelProfesional].forEach((b) => {
      if (b) b.addEventListener('click', () => aplicarNivelConocimiento('profesional'));
    });

    toggleModoClase(els.btnModoAutismo, 'modo-autismo', (activo) => {
      aplicarLimpiezaAutismo(activo);
      if (state.lupaCursorActiva) reconstruirClonLupaCursor();
    });
    toggleModoClase(els.btnModoTdah, 'modo-tdah', (activo) => {
      aplicarPalabrasClaveTdah(activo);
      if (state.lupaCursorActiva) reconstruirClonLupaCursor();
    });
    toggleModoClase(els.btnModoDislexia, 'modo-dislexia');
    toggleModoClase(els.btnModoBajaVision, 'modo-baja-vision');
    toggleModoClase(els.btnModoMotora, 'modo-motora');
    toggleModoClase(els.btnModoFotofobia, 'modo-fotofobia');
    toggleModoClase(els.btnModoDaltonismo, 'modo-daltonismo', (activo) => {
      state.daltonismoActivo = activo;
      if (state.ultimaBusqueda) renderResultadoBusqueda(state.ultimaBusqueda);
    });

    if (els.btnModoLupaCursor) {
      els.btnModoLupaCursor.addEventListener('click', () => {
        toggleLupaCursor(!state.lupaCursorActiva);
      });
    }
    if (els.rngZoomCursor) {
      els.rngZoomCursor.addEventListener('input', (e) => {
        const val = Math.min(3.0, Math.max(1.25, parseFloat(e.target.value || '2')));
        state.zoomCursorFactor = val;
        if (els.lblZoomCursor) els.lblZoomCursor.textContent = `${val.toFixed(2)}x`;
        if (state.lupaCursorActiva && state.ultimoCursorPos) {
          actualizarPosicionLupaCursor(state.ultimoCursorPos.x, state.ultimoCursorPos.y);
        }
      });
    }

    if (els.rngLupaContinua) {
      els.rngLupaContinua.addEventListener('input', (e) => {
        aplicarZoomLupa(e.target.value);
      });
    }
    if (els.rngLupaFlotante) {
      els.rngLupaFlotante.addEventListener('input', (e) => {
        aplicarZoomLupa(e.target.value);
      });
    }
    if (els.btnLupaMenos) {
      els.btnLupaMenos.addEventListener('click', () => {
        aplicarZoomLupa((state.zoomLupaPct || 100) - 5);
      });
    }
    if (els.btnLupaMas) {
      els.btnLupaMas.addEventListener('click', () => {
        aplicarZoomLupa((state.zoomLupaPct || 100) + 5);
      });
    }
    if (els.btnLupaReset) {
      els.btnLupaReset.addEventListener('click', () => aplicarZoomLupa(100));
    }
    if (els.btnLupaFlotanteReset) {
      els.btnLupaFlotanteReset.addEventListener('click', () => aplicarZoomLupa(100));
    }

    if (els.btnResetA11y) {
      els.btnResetA11y.addEventListener('click', () => {
        document.body.classList.remove(
          'modo-autismo',
          'modo-tdah',
          'modo-dislexia',
          'modo-baja-vision',
          'modo-daltonismo',
          'modo-motora',
          'modo-fotofobia'
        );
        state.daltonismoActivo = false;
        aplicarLimpiezaAutismo(false);
        aplicarPalabrasClaveTdah(false);
        toggleLupaCursor(false);
        aplicarZoomLupa(100);
        [
          els.btnModoAutismo,
          els.btnModoTdah,
          els.btnModoDislexia,
          els.btnModoBajaVision,
          els.btnModoDaltonismo,
          els.btnModoMotora,
          els.btnModoFotofobia,
        ].forEach((b) => {
          if (!b) return;
          b.classList.remove('active');
          const dot = b.querySelector('.status-dot');
          if (dot) dot.textContent = 'Desactivado';
        });
        aplicarNivelConocimiento('estandar');
      });
    }

    window.addEventListener('mousemove', (ev) => {
      state.ultimoCursorPos = { x: ev.clientX, y: ev.clientY };
      if (document.body.classList.contains('modo-tdah') && els.tdahFocusBar) {
        els.tdahFocusBar.style.top = `${Math.max(0, ev.clientY - 48)}px`;
      }
      if (state.lupaCursorActiva) {
        if (state.cursorLensRaf) cancelAnimationFrame(state.cursorLensRaf);
        state.cursorLensRaf = requestAnimationFrame(() => {
          actualizarPosicionLupaCursor(ev.clientX, ev.clientY);
        });
      }
    });

    window.addEventListener('scroll', () => {
      if (state.lupaCursorActiva) {
        programarSyncLupaCursor();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (state.lupaCursorActiva) {
        reconstruirClonLupaCursor();
      }
    });

    if (els.drawerGraficaTemporal) {
      els.drawerGraficaTemporal.addEventListener('toggle', () => {
        if (els.drawerGraficaTemporal.open && state.ultimaBusqueda) {
          dibujarGraficaTemporal(state.ultimaBusqueda.evaluacion_principal);
        }
      });
    }

    if (els.btnIrComparador) {
      els.btnIrComparador.addEventListener('click', () => {
        if (els.drawerComparador) els.drawerComparador.open = true;
        document.getElementById('seccionComparador').scrollIntoView({ behavior: 'smooth' });
      });
    }

    document.querySelectorAll('.preset-mission-btn[data-preset-mision]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-mission-btn[data-preset-mision]').forEach((x) => x.classList.remove('active'));
        btn.classList.add('active');
        const tipo = btn.dataset.presetMision;
        if (tipo === 'sol') {
          els.selPuntoLunar.value = 'shackleton_rim';
          els.rngFiltroIlu.value = '80';
          els.lblFiltroIlu.textContent = '80%';
          els.selPrioridad.value = 'MAX_ILUMINACION';
        } else if (tipo === 'tierra') {
          els.selPuntoLunar.value = 'malapert_massif';
          els.rngFiltroCom.value = '85';
          els.lblFiltroCom.textContent = '85%';
          els.selModoEnlace.value = 'DTE';
          els.selPrioridad.value = 'MAX_COMUNICACION';
        } else if (tipo === 'hielo') {
          els.selPuntoLunar.value = 'cabeus_crater';
          els.rngFiltroIlu.value = '0';
          els.lblFiltroIlu.textContent = '0%';
          els.selModoEnlace.value = 'CUALQUIERA';
          els.selPrioridad.value = 'EQUILIBRADO';
        } else {
          els.selPuntoLunar.value = 'connecting_ridge';
          els.rngFiltroIlu.value = '60';
          els.lblFiltroIlu.textContent = '60%';
          els.rngFiltroCom.value = '50';
          els.lblFiltroCom.textContent = '50%';
          els.selPrioridad.value = 'EQUILIBRADO';
        }
        if (els.chkSinFechaFija) els.chkSinFechaFija.checked = false;
        sincronizarModoIntentUI();
        sincronizarInputsPuntoSeleccionado();
        ejecutarBusqueda({ scrollAResultados: true });
        ejecutarComparacion();
      });
    });

    if (els.btnIntentAmbas) {
      els.btnIntentAmbas.addEventListener('click', () => {
        if (els.selPuntoLunar.value === 'NINGUNO') {
          els.selPuntoLunar.value = 'shackleton_rim';
          sincronizarInputsPuntoSeleccionado();
        }
        if (els.chkSinFechaFija) els.chkSinFechaFija.checked = false;
        sincronizarModoIntentUI();
        ejecutarBusqueda({ scrollAResultados: true });
      });
    }

    if (els.btnIntentSoloFechas) {
      els.btnIntentSoloFechas.addEventListener('click', () => {
        els.selPuntoLunar.value = 'NINGUNO';
        if (els.chkSinFechaFija) els.chkSinFechaFija.checked = false;
        sincronizarModoIntentUI();
        ejecutarBusqueda({ scrollAResultados: true });
      });
    }

    if (els.btnIntentSoloLugar) {
      els.btnIntentSoloLugar.addEventListener('click', () => {
        if (els.selPuntoLunar.value === 'NINGUNO') {
          els.selPuntoLunar.value = 'shackleton_rim';
          sincronizarInputsPuntoSeleccionado();
        }
        if (els.chkSinFechaFija) els.chkSinFechaFija.checked = true;
        sincronizarModoIntentUI();
        ejecutarBusqueda({ scrollAResultados: true });
      });
    }

    if (els.chkSinFechaFija) {
      els.chkSinFechaFija.addEventListener('change', () => {
        sincronizarModoIntentUI();
        ejecutarBusqueda();
      });
    }

    els.selPuntoLunar.addEventListener('change', () => {
      if (els.selPuntoLunar.value === 'custom' && els.drawerMapaPoloSur2D) {
        els.drawerMapaPoloSur2D.open = true;
      }
      sincronizarModoIntentUI();
      sincronizarInputsPuntoSeleccionado();
      ejecutarBusqueda();
    });

    const onLatLonInput = () => {
      els.selPuntoLunar.value = 'custom';
      state.tipoCoordActual = 'SELENOGRAFICA';
      const lat = Math.min(-80.0, Math.max(-90.0, parseFloat(els.inpLatitud.value || '-89.5')));
      const lon = parseFloat(els.inpLongitud.value || '0');
      const alt = parseFloat(els.inpAltitud.value || '2000');
      const [xm, ym] = latLonToStereographic(lat, lon);
      els.inpMapaX.value = Math.round(xm);
      els.inpMapaY.value = Math.round(ym);
      actualizarVectorYEsfericasUI(lat, lon, alt);
      sincronizarModoIntentUI();
      dibujarMapaPoloSur2D();
    };

    const onXYInput = () => {
      els.selPuntoLunar.value = 'custom';
      state.tipoCoordActual = 'SELENOGRAFICA';
      const xm = parseFloat(els.inpMapaX.value || '0');
      const ym = parseFloat(els.inpMapaY.value || '0');
      const [lat, lon] = stereographicToLatLon(xm, ym);
      const alt = parseFloat(els.inpAltitud.value || '2000');
      els.inpLatitud.value = lat.toFixed(2);
      els.inpLongitud.value = lon.toFixed(2);
      actualizarVectorYEsfericasUI(lat, lon, alt);
      sincronizarModoIntentUI();
      dibujarMapaPoloSur2D();
    };

    const onEsfericasInput = () => {
      els.selPuntoLunar.value = 'custom';
      state.tipoCoordActual = 'ESFERICAS';
      const rKm = parseFloat(els.inpEsfRadioKm?.value || '1739.55');
      const thetaDeg = parseFloat(els.inpEsfThetaDeg?.value || '179.78');
      const phiDeg = parseFloat(els.inpEsfPhiDeg?.value || '120.0');
      const sel = esfericasASelenograficas(rKm, thetaDeg, phiDeg);
      const [xm, ym] = latLonToStereographic(sel.latDeg, sel.lonDeg);
      els.inpLatitud.value = sel.latDeg.toFixed(2);
      els.inpLongitud.value = sel.lonDeg.toFixed(2);
      els.inpAltitud.value = Math.round(sel.altM);
      els.inpMapaX.value = Math.round(xm);
      els.inpMapaY.value = Math.round(ym);
      if (els.lblVectorCartesiano3D) {
        const vec = esfericasACartesianas3D(rKm, thetaDeg, phiDeg);
        const psiSur = Math.max(0, 180.0 - thetaDeg);
        els.lblVectorCartesiano3D.textContent =
          `Vector 3D MCMF: (${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)}) km | Ángulo Polo Sur ψ = ${psiSur.toFixed(2)}°`;
      }
      sincronizarModoIntentUI();
      dibujarMapaPoloSur2D();
    };

    els.inpLatitud.addEventListener('input', onLatLonInput);
    els.inpLongitud.addEventListener('input', onLatLonInput);
    if (els.inpAltitud) els.inpAltitud.addEventListener('input', onLatLonInput);
    els.inpMapaX.addEventListener('input', onXYInput);
    els.inpMapaY.addEventListener('input', onXYInput);
    [els.inpEsfRadioKm, els.inpEsfThetaDeg, els.inpEsfPhiDeg].forEach((el) => {
      if (el) {
        el.addEventListener('input', onEsfericasInput);
        el.addEventListener('change', () => {
          onEsfericasInput();
          ejecutarBusqueda();
        });
      }
    });

    if (els.chkBridgePrecisa) {
      els.chkBridgePrecisa.addEventListener('change', () => {
        if (state.ultimaBusqueda?.evaluacion_principal) {
          dibujarGraficaTemporal(state.ultimaBusqueda.evaluacion_principal);
        }
      });
    }
    if (els.selBridgePaso) {
      els.selBridgePaso.addEventListener('change', () => {
        if (els.selPasoHorasProf) els.selPasoHorasProf.value = els.selBridgePaso.value;
        ejecutarBusqueda();
      });
    }
    if (els.btnSaltoProDesdeBridge) {
      els.btnSaltoProDesdeBridge.addEventListener('click', () => {
        aplicarNivelConocimiento('profesional');
      });
    }
    if (els.btnVolverNinoDesdeBridge) {
      els.btnVolverNinoDesdeBridge.addEventListener('click', () => {
        aplicarNivelConocimiento('estudiante');
      });
    }

    const actualizarEtiquetasSliders = () => {
      els.lblFiltroIlu.textContent = `${els.rngFiltroIlu.value}%`;
      els.lblFiltroElSol.textContent = `${parseFloat(els.rngFiltroElSol.value).toFixed(1)}°`;
      els.lblFiltroCom.textContent = `${els.rngFiltroCom.value}%`;
      els.lblFiltroElTie.textContent = `${parseFloat(els.rngFiltroElTie.value).toFixed(1)}°`;
      els.lblFiltroPend.textContent = `${parseFloat(els.rngFiltroPend.value).toFixed(1)}°`;
    };

    [els.rngFiltroIlu, els.rngFiltroElSol, els.rngFiltroCom, els.rngFiltroElTie, els.rngFiltroPend].forEach((rng) => {
      rng.addEventListener('input', () => {
        actualizarEtiquetasSliders();
      });
      rng.addEventListener('change', () => {
        actualizarEtiquetasSliders();
        ejecutarBusqueda();
        ejecutarComparacion();
      });
    });

    document.querySelectorAll('.step-adj-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const delta = parseFloat(btn.dataset.delta || '1');
        const input = document.getElementById(targetId);
        if (!input) return;
        const min = parseFloat(input.min || '-100');
        const max = parseFloat(input.max || '100');
        const actual = parseFloat(input.value || '0');
        input.value = String(Math.min(max, Math.max(min, actual + delta)));
        actualizarEtiquetasSliders();
        ejecutarBusqueda();
      });
    });

    document.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.presetIlu;
        els.rngFiltroIlu.value = v;
        els.lblFiltroIlu.textContent = `${v}%`;
        ejecutarBusqueda();
        ejecutarComparacion();
      });
    });

    // Sincronización y aplicación inmediata de controles de Ingeniería (Barra Lateral)
    [
      els.selPasoHorasProf,
      els.selBandaComProf,
      els.inpAlturaMastilProf,
      els.inpAreaPanelesProf,
      els.inpEficienciaSolarProf,
      els.inpConsumoHabProf,
      els.inpDiamAntenaProf,
    ].forEach((el) => {
      if (el) {
        const handler = () => {
          sincronizarControlesIngenieria('sidebar');
          ejecutarBusqueda();
          ejecutarComparacion();
        };
        el.addEventListener('change', handler);
        el.addEventListener('input', handler);
      }
    });

    // Sincronización y aplicación inmediata de controles de Ingeniería (Consola en Vivo Superior)
    [
      els.profLivePasoHoras,
      els.profLiveBandaCom,
      els.profLiveMastil,
      els.profLiveAreaPaneles,
      els.profLiveConsumoHab,
      els.profLiveDiamAntena,
    ].forEach((el) => {
      if (el) {
        const handler = () => {
          sincronizarControlesIngenieria('live');
          ejecutarBusqueda();
          ejecutarComparacion();
        };
        el.addEventListener('change', handler);
        el.addEventListener('input', handler);
      }
    });

    [els.selModoEnlace, els.selPrioridad].forEach((el) => {
      if (el) {
        el.addEventListener('change', () => {
          ejecutarBusqueda();
          ejecutarComparacion();
        });
      }
    });

    els.btnBuscarMision.addEventListener('click', () => {
      sincronizarModoIntentUI();
      ejecutarBusqueda({ scrollAResultados: true });
      ejecutarComparacion();
    });
    els.btnAplicarFiltros.addEventListener('click', () => {
      sincronizarModoIntentUI();
      ejecutarBusqueda({ scrollAResultados: true });
      ejecutarComparacion();
    });

    document.querySelectorAll('.modo-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.modo-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.modoComparacion = tab.dataset.modo;
        if (state.modoComparacion === 'FECHAS_POR_FILTROS') {
          els.chkMismoLugarFechas.checked = true;
        } else if (state.modoComparacion === 'LUGARES_FECHAS_MANUALES') {
          els.chkMismoLugarFechas.checked = false;
        }
        ejecutarComparacion();
      });
    });

    els.chkMismoLugarFechas.addEventListener('change', ejecutarComparacion);
    els.btnEjecutarComparacion.addEventListener('click', ejecutarComparacion);

    document.querySelectorAll('.btn-filtro-curiosidad').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-filtro-curiosidad').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.catCuriosidad;
        document.querySelectorAll('.curiosidad-card').forEach((card) => {
          if (cat === 'todas') {
            card.style.display = 'flex';
          } else if (cat === 'humor') {
            card.style.display = card.classList.contains('humor-card') ? 'flex' : 'none';
          } else {
            card.style.display = !card.classList.contains('humor-card') ? 'flex' : 'none';
          }
        });
      });
    });
  }

  async function init() {
    try {
      const resp = await llamarApiCpp('/api/catalogo');
      if (resp.ok) {
        const data = await resp.json();
        if (data.ok && Array.isArray(data.catalogo) && data.catalogo.length > 0) {
          state.catalogo = data.catalogo.map((p) => {
            const ref = CATALOGO_RESPALDO.find((x) => x.id === p.id);
            return {
              ...p,
              nombre_nino: ref?.nombre_nino || p.nombre,
              nombre_estandar: ref?.nombre_estandar || p.nombre,
              nombre_prof: ref?.nombre_prof || p.nombre,
              explicacion_estudiante: ref?.explicacion_estudiante || p.descripcion,
              descripcion_prof: ref?.descripcion_prof || p.descripcion,
            };
          });
          state.servidorCppActivo = true;
        }
      }
    } catch (_) {}

    if (esEntornoPublicoEstatico() && els.badgeEstadoMotor) {
      els.badgeEstadoMotor.textContent = 'Web Pública GitHub (Motor JS)';
    }

    poblarSelectoresCatalogo();
    sincronizarInputsPuntoSeleccionado();
    bindEventos();
    aplicarNivelConocimiento('estandar');
  }

  init();
})();
