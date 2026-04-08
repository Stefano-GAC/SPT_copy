# Documentacion De Traspaso Tecnico

Este documento resume el estado actual del proyecto para que otro desarrollador pueda continuar sin perder contexto.

## 1. Objetivo Del Proyecto

Landing web para Sauna Puerta de Toledo con:

- Presentacion de marca y propuesta de valor.
- Secciones informativas (instalaciones, horarios, FAQ, contacto).
- Tarjetas interactivas en horarios y tarifas (flip 3D).
- Galeria con lightbox.
- Formulario de resenas en frontend.
- Soporte ES/EN desde JS.

## 2. Estructura Real Del Repositorio

Ruta base: salida/saunapuertadetoledo.com

- index.html: Documento principal con estructura de contenido.
- index-backup.html: Copia previa de respaldo.
- css/reset.css: Normalizacion base.
- css/theme.css: Estilos visuales globales, variables de color y layout principal.
- css/animations.css: Keyframes y utilidades de animacion.
- css/cards.css: Estilos de tarjetas flip (horarios y tarifas) y efectos de brillo.
- css/responsive.css: Reglas por breakpoints.
- js/main.js: Toda la logica interactiva principal.
- js/config.js, js/astra-config.js, js/ie-fix.js, js/wp-emoji-settings.js: scripts auxiliares heredados.
- assets/images: Imagenes usadas por hero, galeria y branding.

## 3. Flujo De Carga En Frontend

En DOMContentLoaded (main.js) se inicializan los modulos en este orden:

1. initAOS
2. initScrollTop
3. initHtmlActionBindings
4. initFAQ
5. initMobileMenu
6. initSmoothScroll
7. initFlipCards
8. initScheduleCards
9. initHeroCarousel
10. initScrollProgress
11. initLightbox
12. initCookieBanner
13. initReviewForm
14. initLanguageToggle
15. initExperienceMode
16. initVisitTour
17. initWeekendVisualMode
18. initSaturdayEventMode

Notas:

- La pantalla de carga se oculta en window.load.
- AOS se toma desde CDN en index.html y se configura en initAOS.

## 4. Mapa Funcional Por Seccion HTML

En index.html, las anclas principales son:

- #inicio: Hero + CTA
- #nosotros: cards informativas
- #instalaciones: grid de servicios
- #horarios: schedule cards con reverso dinamico
- #precios: price cards flip 3D
- #galeria: items con lightbox
- #faq: acordeon
- #contacto: direccion, transporte, CTA WhatsApp, mapa

Elementos globales relevantes:

- #scroll-progress: barra superior de progreso de scroll.
- #loading-screen: overlay inicial.
- #cookie-banner: consentimiento.
- #whatsapp-btn: acceso rapido a WhatsApp.
- #scroll-top-btn: volver arriba.

## 5. JS Principal: Responsabilidad De Cada Bloque

Archivo: js/main.js

Bloques clave:

- initHtmlActionBindings: centraliza acciones declarativas del HTML.
  - [data-scroll-target]: scroll suave a seccion.
  - [data-action="open-whatsapp"]: abre WhatsApp.
- initFlipCards: gira tarjetas de tarifas con clase flipped.
- initScheduleCards: logica de movimiento estimado por franja horaria.
- initLanguageToggle + getStaticTranslations: traduccion de textos y atributos ES/EN.
- initLightbox: abre/cierra/recorre galeria.
- initCookieBanner, acceptCookies, declineCookies: gestion de consentimiento en localStorage.
- initReviewForm: validacion y alta de nueva resena visual en frontend.

## 6. CSS: Donde Tocar Cada Cosa

- theme.css
  - Variables de paleta (:root)
  - Layout base de secciones
  - Navbar, botones, hero, tipografias

- cards.css
  - .price-card-flip, .price-card-inner, .flipped
  - Front/back de tarjetas
  - Efecto brillo diagonal (pseudo-elementos ::after)
  - Hover lift y sombras

- animations.css
  - keyframes genericos (fade, zoom, flip)
  - clases utilitarias de animacion

- responsive.css
  - breakpoints 1024, 768 y 480
  - ajuste de grids y componentes para movil

## 7. Sobre El Bloque Script type=application/ld+json

El bloque en head NO es logica de UI. Es schema JSON-LD para SEO.

Que declara:

- Tipo de entidad: HealthAndBeautyBusiness.
- Nombre comercial, URL y descripcion.
- Direccion estructurada.
- Coordenadas geograficas.
- Horario de apertura.
- Perfiles sociales.

Por que no moverlo al JS de app:

1. Los buscadores esperan este bloque en el HTML renderizado, idealmente en head.
2. No depende de eventos de usuario.
3. No aporta beneficio moverlo a main.js y puede reducir la lectura por crawlers.

Conclusion: se mantiene en index.html.

## 8. Cambio Reciente Importante (Ya Aplicado)

Se elimino JS inline de atributos onclick para dejar HTML mas limpio.

Antes:

- onclick en botones de CTA, cookies, WhatsApp y scroll top.

Ahora:

- HTML usa atributos declarativos (data-action, data-scroll-target).
- main.js registra listeners en initHtmlActionBindings e initCookieBanner.

## 9. Lineas Criticas A Revisar Al Continuar

1. openWhatsApp en js/main.js
   - phoneNumber esta como placeholder: 34XXXXXXXXX.
   - Debe reemplazarse por numero real.

2. Tarjetas de precios
   - JS: initFlipCards
   - CSS: cards.css (.price-card-flip, .price-card-inner, .flipped)
   - En integraciones externas, evitar mezclar flip 3D propio con flip de AOS.

3. Traducciones
   - Gran parte del contenido ES/EN se define en getStaticTranslations.
   - Si se cambia HTML (textos o selectores), actualizar ese mapeo.

4. Banner de cookies
   - Estado en localStorage: cookieConsent = all | essential.
   - Si se integra CMP real, esta parte sera reemplazada.

## 10. Guia Rapida Para El Siguiente Dev

Si quiere cambiar textos:

- HTML base en index.html
- Traduccion en getStaticTranslations (main.js)

Si quiere cambiar look visual:

- Variables y componentes base: theme.css
- Tarjetas: cards.css
- Movil: responsive.css

Si quiere cambiar interacciones:

- main.js (funciones init*).

Si quiere cambiar SEO:

- meta tags y JSON-LD en head de index.html.

## 11. Checklist De Entrega Tecnica

- [ ] Confirmar numero real de WhatsApp en js/main.js.
- [ ] Validar comportamiento ES/EN en toda la home.
- [ ] Probar flip de tarjetas en desktop y movil.
- [ ] Validar banner de cookies en primer acceso y accesos posteriores.
- [ ] Revisar carga de imagenes (rutas en assets/images).
- [ ] Ejecutar validacion SEO (meta + schema).

## 12. Estado General

- Estructura modular estable.
- Interacciones principales centralizadas en js/main.js.
- HTML sin handlers inline de eventos.
- Bloque JSON-LD conservado correctamente para SEO.
