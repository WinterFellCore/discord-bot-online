const { Client } = require('discord.js-selfbot-v13');
const keep_alive = require('./keep_alive.js');

// Suporta múltiplos tokens separados por vírgula
const tokens = process.env.TOKENS ? process.env.TOKENS.split(',') : [];

if (tokens.length === 0) {
  console.error('❌ Nenhum token encontrado! Configure a variável TOKENS.');
  process.exit(1);
}

console.log(`🚀 Iniciando ${tokens.length} conta(s)...`);

// Conecta cada conta com retry
tokens.forEach((token, index) => {
  const trimmedToken = token.trim();
  
  if (!trimmedToken) return;
  
  let retryCount = 0;
  const maxRetries = 5;
  
  function connectClient() {
    const client = new Client({
      checkUpdate: false,
      ws: {
        properties: {
          browser: 'Discord Client'
        }
      }
    });
    
    client.on('ready', () => {
      console.log(`✅ Conta ${index + 1} online: ${client.user.tag}`);
      retryCount = 0; // Reset retry count on success
    });
    
    client.on('error', (err) => {
      console.error(`❌ Erro na Conta ${index + 1}:`, err.message);
      
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`🔄 Tentando reconectar Conta ${index + 1} (tentativa ${retryCount}/${maxRetries})...`);
        setTimeout(() => connectClient(), 10000 * retryCount); // Backoff exponencial
      }
    });
    
    client.login(trimmedToken).catch(err => {
      console.error(`❌ Falha ao conectar Conta ${index + 1}:`, err.message);
      
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`🔄 Tentando novamente Conta ${index + 1} (tentativa ${retryCount}/${maxRetries})...`);
        setTimeout(() => connectClient(), 10000 * retryCount);
      }
    });
  }
  
  // Delay entre cada conexão para evitar rate limit
  setTimeout(() => connectClient(), index * 5000);
});
