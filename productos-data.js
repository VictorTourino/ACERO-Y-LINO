// ========== DATOS CENTRALIZADOS DE PRODUCTOS ==========
window.PRODUCTOS = [
  // ===== ARMADURAS =====
  {
    id: 2,
    nombre: "Armadura de Metal",
    categoria: "armaduras",
    descripcion: "Esta armadura combina la robustez del acero con una movilidad articulada sorprendente, permitiendo al caballero moverse con agilidad y confianza. Cada pieza ha sido forjada y pulida a mano, presentando un acabado en acero pavonado o envejecido que le otorga un aire de veteranía. Desde el yelmo de bacinete con visor funcional hasta las grebas perfectamente ajustadas, esta armadura es una obra maestra de la ingeniería medieval.",
    precio: 2000,
    imagen: "ArmaduraMetal/ArmaduraMetal.png",
    modelo3D: "ArmaduraMetal/ArmaduraMetal.glb",
    colores: ["#8c8c8c", "#4a4a4a", "#c0c0c0"],
    especificaciones: {
      "Yelmo": "Tipo Gran Bacinete con visor móvil y orificios de ventilación optimizados.",
      "Torso": "Peto y espaldar articulados con correas de cuero de alta resistencia para un ajuste personalizado.",
      "Extremidades": "Hombreras, brazales, coderas, quijotes (muslos) y grebas (espinillas) totalmente articulados.",
      "Material": "Acero al carbono de 1.5 mm de espesor (calibre 16), ideal para exhibición o combate ligero."
    },
    notaPrecio: "Fabricacion a medida. Plazo de entrega 4-6 semanas.",
    seccion: "novedades"
  },
  // ===== COMPLEMENTOS =====
  {
    id: 6,
    nombre: "Sombrero Vaquero",
    categoria: "complementos",
    descripcion: "Este sombrero presenta un acabado de cuero envejecido artificialmente, ofrece ese aspecto 'usado' y auténtico desde el primer día. Destaca por sus detalles de costura en cruz hechos a mano alrededor de la base de la corona y el ala, reforzando su estructura y dándole un aire artesanal. Su diseño robusto pero ligero lo hace perfecto tanto para aventuras al aire libre como para completar un look urbano con personalidad.",
    precio: 60,
    imagen: "/Sombrero/10642549.png",
    modelo3D: "/Sombrero/Sombrero.glb",
    colores: ["#1a2744", "#000000", "#5c3a1e", "#c6a44b"],
    especificaciones: {
      "Material": "Cuero sintético (PU) de alta calidad con textura de grano natural y efecto desgastado.",
      "Acabado": "Puntas cosidas a mano con hilo encerado de alta resistencia.",
      "Diseño": "Corona de estilo 'Cattleman' con ala curva clásica para máxima protección solar.",
      "Ventilación": "Ojales metálicos laterales para asegurar la transpirabilidad en climas cálidos.",
      "Color": "Marrón Tabaco con matices oxidados."
    },
    notaPrecio: "Si se desea personalizar, el precio aumentara en funcion de las modificaciones deseadas.",
    seccion: "ofertas"
  },
  {
    id: 8,
    nombre: "Bandera",
    categoria: "complementos",
    descripcion: "El estandarte está confeccionado en lona de algodón envejecida, con bordes deshilachados y marcas de batalla sutiles que le otorgan un aspecto auténtico de reliquia histórica. El diseño está enmarcado por una intrincada cenefa de nudos celtas y se presenta suspendido de un mástil de madera oscura con remates de bronce, listo para ser exhibido con orgullo.",
    precio: 100,
    imagen: "/Bandera/Bandera.png",
    modelo3D: "/Bandera/Bandera.glb",
    colores: ["#83072D", "#1a2744", "#c6a44b"],
    especificaciones: {
      "Material": "Lona de algodón de alto gramaje con impresión digital de alta resolución y efecto desgastado.",
      "Soporte": "Mástil de madera maciza con cuerda de suspensión de cáñamo reforzada.",
      "Diseño": "Heráldica clásica con motivos de león y bordados visuales tipo damasco.",
      "Dimensiones": "90 cm de largo x 50 cm de ancho (formato estandarte vertical)."
    },
    notaPrecio: "Heraldica personalizable. Consultar disenos.",
    seccion: "novedades"
  },
  {
    id: 9,
    nombre: "Collar",
    categoria: "complementos",
    descripcion: "Este collar de pechera destaca por su gran cristal central en azul zafiro, rodeado por una intrincada estructura de filigrana de bronce donde dos dragones tallados parecen custodiar la gema. La cadena está compuesta por eslabones gruesos y decorados que aseguran que la pieza se asiente con elegancia sobre la clavícula. De la pieza central cuelgan delicadas cuentas en tonos rubí y esmeralda, aportando un movimiento rítmico y un contraste de color que recuerda a las joyas de la alta nobleza medieval.",
    precio: 55,
    imagen: "/Collar/Collar.png",
    modelo3D: "/Collar/Collar.glb",
    colores: ["#c6a44b", "#8c8c8c", "#b8860b"],
    especificaciones: {
      "Material": "Aleación de bronce envejecido con pátina artesanal (libre de níquel).",
      "Piedras": "Cristal central facetado de alto brillo y cuentas de vidrio premium.",
      "Cierre": "Sistema de barra y aro decorado, fácil de abrochar y muy seguro.",
      "Peso": "Diseñado para ser una pieza de declaración con presencia, pero equilibrada para un uso cómodo.",
      "Estilo": "Gótico / Fantasía Épica / Renacentista."
    },
    notaPrecio: "Cada pieza es unica debido al proceso artesanal.",
    seccion: "novedades"
  },
  {
    id: 10,
    nombre: "Pendientes",
    categoria: "complementos",
    descripcion: "Estas piezas de diseño artístico combinan la elegancia de la joyería antigua con una estética fantástica, ideales para ocasiones especiales o para complementar un vestuario de gala de inspiración medieval. El diseño presenta una imponente piedra central en forma de lágrima de color verde esmeralda, engastada en una estructura de bronce envejecido con intrincados calados. De la base cuelgan dos figuras de dragones enfrentados de los cuales se desprenden delicadas cuentas de cristal en tonos rubí y zafiro.",
    precio: 100,
    imagen: "/Pendientes/PendientesSinFondo.png",
    modelo3D: "/GLBs/Meshy_AI_Emerald_Teardrop_Drag_0414182342_texture.glb",
    colores: ["#c6a44b", "#8c8c8c"],
    especificaciones: {
      "Materiales": "Aleación de bronce con acabado pátina antigua (libre de níquel y plomo).",
      "Piedras": "Cristales de alta refracción tallados en facetas para un brillo máximo.",
      "Diseño": "Motivos heráldicos de dragones y filigrana celta.",
      "Cierre": "Gancho de tipo 'anzuelo' reforzado para mayor comodidad y seguridad.",
      "Peso": "Ligeros y equilibrados, diseñados para un uso prolongado sin fatiga."
    },
    notaPrecio: "Hipoalergenicos. Consultar materiales disponibles.",
    seccion: "ofertas"
  },
  {
    id: 11,
    nombre: "Candil",
    categoria: "complementos",
    descripcion: "Es el accesorio perfecto para completar sets de fotografía, decorar castillos o iluminar eventos nocturnos de recreación histórica. Fabricado en hierro forjado con acabado en negro azabache mate, el farol presenta una estructura de tres niveles reforzada con remaches clásicos. Su diseño abierto permite una ventilación perfecta para velas de cera real, proyectando sombras dramáticas y una luz cálida y constante.",
    precio: 45,
    imagen: "/Candil/CandilSinFOndo.png",
    modelo3D: "/GLBs/Candil.glb",
    colores: ["#2a2a2a", "#5c3a1e", "#8c8c8c"],
    especificaciones: {
      "Material": "Acero al carbono forjado a mano con tratamiento anticorrosión.",
      "Diseño": "Estructura cilíndrica de barrote plano con base estable.",
      "Capacidad": "Apto para velas de pilar de hasta 7 cm de diámetro.",
      "Portabilidad": "Argolla funcional para colgar o transportar.",
      "Dimensiones": "30 cm de altura (sin contar la argolla) x 12 cm de ancho."
    },
    notaPrecio: "Incluye una vela de cera natural.",
    seccion: "novedades"
  },
  {
    id: 13,
    nombre: "Libro",
    categoria: "complementos",
    descripcion: "Diseñado para quienes valoran la escritura a mano y la estética de la fantasía épica. La cubierta está confeccionada en cuero auténtico de grano grueso con un acabado envejecido y un relieve central que muestra un imponente dragón enmarcado en nudos rúnicos. Las esquinas están protegidas por refuerzos de latón tallado, y el cierre de doble hebilla asegura que tus secretos permanezcan a salvo bajo una presión firme y elegante.",
    precio: 65,
    imagen: "/Libro/Libro.png",
    modelo3D: "/Libro/Libro.glb",
    colores: ["#5c3a1e", "#2c1810", "#8b4513"],
    especificaciones: {
      "Material Exterior": "Cuero curtido artesanalmente con detalles metálicos en latón.",
      "Papel Interior": "200 páginas de papel pergamino de algodón hecho a mano, libre de ácido y con bordes rasgados para un look auténtico.",
      "Cierre": "Sistema de correas dobles con hebillas de rodillo funcionales.",
      "Uso": "Compatible con pluma estilográfica, carboncillo y acuarela (papel de alto gramaje).",
      "Dimensiones": "A5 (21 cm x 15 cm)"
    },
    notaPrecio: "Grabado en portada disponible bajo pedido.",
    seccion: "novedades"
  },
  {
    id: 14,
    nombre: "Silla",
    categoria: "complementos",
    descripcion: "Esta pieza de mobiliario combina una estructura robusta de líneas rectas con un trabajo de talla exquisito que la convierte en el centro de atención de cualquier estancia. El respaldo alto presenta un escudo heráldico tallado en relieve enmarcado por un intrincado nudo celta. Su diseño ergonómico de época se complementa con un asiento acolchado en lino rústico de color teja.",
    precio: 400,
    imagen: "/Silla/Silla.png",
    modelo3D: "/Silla/Silla.glb",
    colores: ["#5c3a1e", "#2c1810"],
    especificaciones: {
      "Madera": "Roble macizo con acabado en barniz mate natural para resaltar la veta.",
      "Talla": "Panel central tallado a mano.",
      "Tapicería": "Cojín de espuma de alta densidad forrado en lino de gramaje grueso (resistente al desgaste).",
      "Estructura": "Ensamblaje reforzado para garantizar estabilidad y una larga vida útil.",
      "Estilo": "Gótico tardío / Renacimiento rústico."
    },
    notaPrecio: "Producto artesanal. Cada pieza puede variar ligeramente.",
    seccion: "ofertas"
  },

  // ===== VESTIDOS =====
  {
    id: 17,
    nombre: "Vestido de Plebeya",
    categoria: "vestidos",
    descripcion: "Diseñado para quienes buscan autenticidad en recreaciones históricas, este vestido de dos piezas combina la durabilidad de los tejidos tradicionales con un corte favorecedor que evoca la vida en la aldea medieval. El cuerpo está confeccionado en una mezcla de lino y lana en tono marrón tierra, destacando un corsé frontal con cordones ajustables que permite definir la silueta de forma cómoda.",
    precio: 175,
    imagen: "/VestidoPlebeya/VestidoPlebeya.png",
    modelo3D: "/VestidoPlebeya/VestidoPlebeya.glb",
    colores: ["#F8F5EB", "#5c3a1e", "#2d5a27"],
    especificaciones: {
      "Material": "Mezcla de algodón pesado y lino (textura transpirable y resistente)",
      "Diseño": "Talle ajustado con cordones frontales funcionales y falda de línea A con vuelo natural.",
      "Color": "Paleta orgánica en tonos Marrón Roble y Ocre Arena. Versatilidad: Ideal para roles de campesina, tabernera o artesana en eventos LARP y ferias medievales.",
      "Comodidad": "Sin cremalleras; ajuste mediante lazada frontal para adaptarse a distintas medidas."
    },
    notaPrecio: "Colores naturales. El tono puede variar ligeramente.",
    seccion: "ofertas"
  },
  {
    id: 19,
    nombre: "Corset",
    categoria: "vestidos",
    descripcion: "Esta pieza de corsetería artesanal evoca la opulencia de las cortes europeas, combinando una estructura técnica que realza la figura con una estética visualmente deslumbrante. Confeccionado en brocado de damasco premium, el tejido presenta motivos florales en hilo de oro sobre fondo carmesí profundo. El escote cuadrado está rematado con encaje de bolillos y el sistema de lazada frontal permite un ajuste preciso.",
    precio: 150,
    imagen: "/Corset/Corset.png",
    modelo3D: "/Corset/Corset.glb",
    colores: ["#5c3a1e", "#000000", "#83072D"],
    especificaciones: {
      "Material": "Brocado de seda sintética reforzado y forro de algodón 100% para mayor transpirabilidad.",
      "Estructura": "Varillas de acero flexible de alta calidad (20 unidades) para un soporte firme.",
      "Ajuste": "Lazada frontal funcional con ojales metálicos reforzados y cierre de seguridad.",
      "Acabado": "Ribetes de bies en satén y detalle de encaje en el escote y hombros.",
      "Estilo": "Victoriano / Barroco."
    },
    notaPrecio: "Se recomienda tomar medidas exactas para el mejor ajuste.",
    seccion: "ofertas"
  },

  // ===== GAMBESONES =====
  {
    id: 22,
    nombre: "Gambesón",
    categoria: "gambesones",
    descripcion: "Esta túnica acolchada no solo es una pieza clave de la vestimenta defensiva histórica, sino también una declaración de estilo para el combatiente moderno de LARP o recreación medieval. Confeccionado en lona de algodón de alta resistencia con un acolchado vertical denso, este gambesón ofrece una excelente absorción de impactos. Su diseño destaca por un sistema de cierre frontal mediante seis hebillas de cuero con herrajes de latón.",
    precio: 200,
    imagen: "/Gambes%C3%B3n/Gambeson.png",
    modelo3D: "/Gambes%C3%B3n/Gambeson.glb",
    colores: ["#000000", "#2c2c2c", "#1a1a2e"],
    especificaciones: {
      "Material": "Exterior de lona de algodón 100% y relleno de fibras sintéticas de alta densidad para mayor ligereza.",
      "Diseño": "Acolchado longitudinal que favorece la movilidad de los brazos y el torso.",
      "Cuello": "Cuello alto tipo oficial con cierre de hebilla para proteger la zona cervical.",
      "Ajuste": "Hebillas de cuero genuino reforzadas con remaches.",
      "Color": "Negro obsidiana profundo."
    },
    notaPrecio: "Disponible en colores personalizados bajo pedido.",
    seccion: "ofertas"
  },

  // ===== MAQUILLAJE =====
  {
    id: 25,
    nombre: "Látex",
    categoria: "maquillaje",
    descripcion: "Logra transformaciones hiperrealistas con el látex líquido Simple-Scar. Diseñado específicamente para artistas de efectos especiales (SFX), este látex es la herramienta definitiva para crear desde sutiles arrugas de envejecimiento hasta complejas cicatrices y prótesis cutáneas directamente sobre la piel. Su fórmula de secado rápido y acabado flexible permite una libertad de movimiento total.",
    precio: 12.5,
    imagen: "/L%C3%A1tex/Latex.png",
    modelo3D: "/L%C3%A1tex/Latex.glb",
    colores: ["#f5e6c8", "#d4a574", "#8b6914"],
    especificaciones: {
      "Multiusos": "Ideal para modelar cicatrices, quemaduras, ampollas y texturas de piel de fantasía.",
      "Fácil aplicación": "Se aplica suavemente con esponja o pincel.",
      "Acabado Profesional": "Fórmula de grado cinematográfico que no se cuartea.",
      "Contenido": "90 mL.",
      "Seguridad": "Formulado para uso tópico (se recomienda prueba de sensibilidad en el antebrazo)."
    },
    notaPrecio: "No apto para personas con alergia al latex.",
    seccion: "ofertas"
  },
  {
    id: 26,
    nombre: "Maquillaje",
    categoria: "maquillaje",
    descripcion: "Inspirada en los antiguos recipientes de tocador de la nobleza celta, esta polvera es perfecta para quienes buscan accesorios sostenibles y duraderos. El cuerpo está tallado en madera de nogal auténtica, con una tapa que luce un nudo celta grabado en relieve. El interior está diseñado para albergar polvos compactos e incluye una almohadilla aplicadora de lino premium.",
    precio: 45,
    imagen: "/Maquillaje/Maquillaje.png",
    modelo3D: "/Maquillaje/Maquillaje.glb",
    colores: ["#d4a574", "#f5e6c8", "#8b6914", "#83072D"],
    especificaciones: {
      "Material": "Madera de nogal maciza tratada con aceites naturales (resistente a la humedad).",
      "Diseño": "Tapa de ajuste a presión con pirograbado de precisión láser.",
      "Cierre": "Bisagra y broche de latón envejecido para un cierre seguro.",
      "Incluye": "Aplicador circular de algodón y lino hipoalergénico.",
      "Dimensiones": "8 cm de diámetro (formato viaje/bolso)."
    },
    notaPrecio: "Kit profesional. Incluye estuche de transporte.",
    seccion: "novedades"
  }
];
