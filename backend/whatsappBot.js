// Importaciones
const venom = require('venom-bot');
const readline = require('readline');

// Configura readline para leer desde la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Pregunta al usuario los números
rl.question('Ingresa los números de WhatsApp separados por coma (ej: 51987654321,51912345678): ', (input) => {
  // Procesa la entrada y arma el array de números en formato correcto
  const numeros = input
    .split(',')
    .map(num => num.trim())
    .filter(num => num.length > 0)
    .map(num => num + '@c.us');

  venom
    .create({
      session: 'post_encuesta_bot',
      multidevice: true,
      headless: true,
      browserArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-sync',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--enable-automation',
        '--password-store=basic',
        '--use-mock-keychain',
        '--headless=new'
      ]
    })
    .then(async (client) => {
      for (const numero of numeros) {
        await client.sendText(numero, '¡Hola! Este es un mensaje automático de prueba.');
        console.log(`Mensaje enviado a ${numero}`);
      }
      rl.close();
      // Opcional: puedes cerrar el bot después de enviar los mensajes
      // await client.close();
    })
    .catch((error) => {
      console.error('Error al iniciar el bot:', error);
      rl.close();
    });
});
