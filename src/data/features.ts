// The 18 feature clips of the landing; the `clip` id is the file stem in public/videos (see docs/plan-landing.md).
export type FeatureGroup = "compras" | "servicio" | "cocina" | "ia" | "admin";

export interface FeatureClipData {
  clip: string;
  group: FeatureGroup;
  title: string;
  text: string;
  icon: string;
  poster?: string;
  seconds: number;
}

export const featureGroups: Record<FeatureGroup, string> = {
  compras: "Compras y costes",
  servicio: "Servicio",
  cocina: "Cocina segura",
  ia: "Tu asistente",
  admin: "Administración",
};

const icons = {
  doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z",
  check: "M4 12l5 5L20 6",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5",
  pos: "M4 4h16v10H4zM8 20h8M12 14v6",
  phone: "M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2",
  pan: "M3 11h14a4 4 0 01-4 4H7a4 4 0 01-4-4zM17 11h4",
  table: "M4 10h16M6 10v9M18 10v9M9 6h6",
  cash: "M3 6h18v12H3zM12 9a3 3 0 100 6 3 3 0 000-6z",
  chart: "M5 20V10M12 20V4M19 20v-7",
  chat: "M4 5h16v11H8l-4 4z",
  call: "M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  thermo: "M10 13.5V4a2 2 0 014 0v9.5a4 4 0 11-4 0z",
  tool: "M14 6a4 4 0 01-5 5l-6 6 3 3 6-6a4 4 0 015-5l-3 3-3-3z",
  bank: "M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18",
  users: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M17 11a3 3 0 100-6M22 21a6 6 0 00-5-6",
};

export const featureClips: FeatureClipData[] = [
  { clip: "01-facturas", group: "compras", title: "Facturas que se leen solas", text: "Sube una foto o un PDF: Maingoo lee las líneas, crea el proveedor y suma el stock.", icon: icons.doc, poster: "/posters/invoice.jpg", seconds: 9 },
  { clip: "02-albaranes", group: "compras", title: "Albaranes sin duplicados", text: "Cada albarán cuenta una sola vez, aunque llegue suelto o dentro de la factura.", icon: icons.truck, seconds: 8 },
  { clip: "03-revisiones", group: "compras", title: "Revisiones de la IA", text: "Lo que no cuadra te llega como una pregunta clara, paso a paso.", icon: icons.check, seconds: 8 },
  { clip: "04-costes", group: "compras", title: "Costes que avisan", text: "Si un proveedor sube un precio, lo ves al momento y comparas con los demás.", icon: icons.trend, poster: "/posters/product.jpg", seconds: 8 },
  { clip: "05-inventario", group: "compras", title: "Inventario y recuento", text: "El stock al día con cada compra y venta, y recuentos rápidos desde la tablet.", icon: icons.box, seconds: 6 },
  { clip: "06-recetas", group: "cocina", title: "Recetas, escandallos y alérgenos", text: "Coste real de cada plato y sus alérgenos, creados con ayuda de la IA.", icon: icons.book, poster: "/posters/plato-pollo.jpg", seconds: 9 },
  { clip: "07-tpv", group: "servicio", title: "TPV", text: "Sala en plano, carta con fotos, cobro y cuenta dividida en dos toques.", icon: icons.pos, poster: "/posters/plato-hamburguesa.jpg", seconds: 10 },
  { clip: "08-comandero", group: "servicio", title: "Comandero", text: "El camarero toma la comanda en el móvil y la manda a cocina al instante.", icon: icons.phone, poster: "/posters/plato-patatas-bravas.jpg", seconds: 8 },
  { clip: "09-cocina", group: "servicio", title: "Pantalla de cocina", text: "Comandas por estación, con el tiempo de cada una a la vista.", icon: icons.pan, seconds: 7 },
  { clip: "10-plano", group: "servicio", title: "Plano de sala", text: "Dibuja tus salas o importa el plano desde una foto.", icon: icons.table, seconds: 7 },
  { clip: "11-caja", group: "servicio", title: "Cierre de caja", text: "Abre, cuenta y cierra la caja con un arqueo guiado.", icon: icons.cash, seconds: 8 },
  { clip: "12-informes", group: "ia", title: "Informes que llegan solos", text: "Ventas, compras y costes en PDF o Excel, y enviados por correo.", icon: icons.chart, poster: "/posters/dashboard.jpg", seconds: 8 },
  { clip: "13-chat", group: "ia", title: "Pregúntale a Maingoo AI", text: "Escribe tu duda y responde con datos, gráficas e informes.", icon: icons.chat, poster: "/posters/chat-answer.jpg", seconds: 6 },
  { clip: "14-llamada", group: "ia", title: "Llámale", text: "¿Sin tiempo para escribir? Habla con Maingoo como en una llamada.", icon: icons.call, poster: "/posters/voice.jpg", seconds: 6 },
  { clip: "15-appcc", group: "cocina", title: "APPCC y sensores de temperatura", text: "Temperaturas registradas solas, alertas al momento y PDF del mes.", icon: icons.thermo, seconds: 10 },
  { clip: "16-maquinaria", group: "cocina", title: "Maquinaria y utensilios", text: "El equipo de la cocina, siempre localizado y al día.", icon: icons.tool, seconds: 6 },
  { clip: "17-gestoria", group: "admin", title: "Tu gestoría al día", text: "Los datos de tu gestor a mano, y Maingoo AI le envía tus informes por correo.", icon: icons.bank, seconds: 6 },
  { clip: "18-equipo", group: "admin", title: "Equipo y control", text: "Usuarios, permisos, PIN del TPV, dispositivos y registro de actividad.", icon: icons.users, seconds: 8 },
];
