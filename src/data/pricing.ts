// Shared by the pricing section and the landing chatbot context.
// The free beta gives the same software as the Profesional plan; sensors only come with the second plan.
export const software = [
  "Facturas y albaranes leídos por la IA",
  "Proveedores, costes y alertas de precio",
  "Inventario y recuento",
  "Recetas, escandallos y alérgenos",
  "TPV, comandero y pantalla de cocina",
  "Registros APPCC",
  "Chat y llamada con Maingoo AI",
  "Todos los usuarios que necesites",
];
export const beta = [...software, "Soporte directo del equipo"];
export const plans = [
  {
    name: "Profesional",
    text: "El software completo para tu local.",
    items: software,
  },
  {
    name: "Profesional + sensores",
    text: "El software y el control de temperatura de tus cámaras.",
    items: ["Todo lo del plan Profesional", "Hasta 5 sensores de temperatura cedidos", "Temperaturas registradas solas y alertas al momento"],
  },
];
