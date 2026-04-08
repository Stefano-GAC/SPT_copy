// ========== CONFIGURACIÓN RÁPIDA ==========
// Reemplaza estos valores con los tuyos

const CONFIG = {
  // Número de WhatsApp (formato: código país + número sin espacios ni guiones)
  // Ejemplo: España 34 + 666 123 456 = 34666123456
  WHATSAPP_NUMBER: '34XXXXXXXXX',
  
  // Mensaje por defecto a enviar
  WHATSAPP_MESSAGE: 'Hola, quisiera más información sobre Sauna Puerta de Toledo.',
  
  // Email para formularios
  EMAIL: 'contacto@saunapuertadetoledo.com',
  
  // Teléfono de contacto
  PHONE: '+34 666 123 456',
  
  // URL de Google Maps
  GOOGLE_MAPS_URL: 'https://www.google.com/maps/search/Sauna+Puerta+de+Toledo',
  
  // Horarios
  HOURS: {
    WEEKDAY: '14:00 - 04:00',      // Lunes a Viernes
    WEEKEND: '12:00 - 06:00',      // Sábados, Domingos, Festivos
  },
  
  // Ubicación
  ADDRESS: {
    street: 'Cuesta de las Descargas, 6',
    postal: '28005',
    city: 'Madrid',
    country: 'España'
  },
  
  // Redes sociales
  SOCIAL: {
    facebook: 'https://www.facebook.com/saunapuertadetoledo',
    instagram: 'https://www.instagram.com/saunapuertadetoledo/',
    twitter: 'https://twitter.com/saunapuerta'
  },
  
  // Colores
  COLORS: {
    primary: '#d4af37',
    accent: '#c1272d',
    dark: '#1a1a1a',
    light: '#f5f5f5'
  },
  
  // Modo debug
  DEBUG: true
};

// Actualizar el número de WhatsApp en el main.js
if (CONFIG.DEBUG) {
  console.log('🔧 CONFIG loaded:', CONFIG);
}

// Exportar para uso global
window.CONFIG = CONFIG;
