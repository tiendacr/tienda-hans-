# Tienda Hans

Tienda en línea de demostración para **ropa, tenis y accesorios**, con una estética de boutique moderna y elegante en blanco y negro.

## Incluye
- Catálogo de productos de muestra.
- Carrito de compras.
- Formulario con datos del cliente, entrega y notas de talla/color.
- Dos rutas visibles: pedido por WhatsApp y continuar compra en la web.
- Diseño adaptable a celular y computadora.

## Personalizar productos
Edita el arreglo `products` dentro de `app.js`. Cambia nombre, categoría y precio por tus productos reales. Los precios de muestra están en colones costarricenses. Reemplaza las ilustraciones por fotografías reales.

## Configurar WhatsApp
En `app.js`, busca `const WHATSAPP_NEGOCIO = "";` y coloca tu número con código de país, sin `+` ni espacios. Ejemplo de formato: `50688888888`.

## Publicar con GitHub Pages
1. Crea un repositorio en GitHub.
2. Sube los archivos de esta carpeta a la raíz.
3. Entra a **Settings → Pages**.
4. Selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.

## MUY IMPORTANTE: pagos y pedidos reales
Esta entrega es una maqueta de frontend. El botón de WhatsApp abre un mensaje preparado cuando configures el número. La ruta web actualmente registra una demostración únicamente en el navegador del comprador: **no cobra, no confirma pagos y no envía el pedido a un panel central**.

Para aceptar pagos reales dentro de la web se necesita conectar una pasarela de pago compatible con Costa Rica y un backend seguro. Para recibir todos los pedidos en un panel y controlar inventario, también hace falta una base de datos y notificaciones. No recopiles números de tarjeta ni códigos de seguridad en este sitio.
