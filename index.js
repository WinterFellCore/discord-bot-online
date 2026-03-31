const { Client } = require('discord.js-selfbot-v13');
const keep_alive = require('./keep_alive.js');

// Suporta múltiplos tokens separados por vírgula
const tokens = process.env.TOKENS ? process.env.TOKENS.split(',') : [];

if (tokens.length === 0) {
  console.error('❌ Nenhum token encontrado! Configure a variável TOKENS.');
  process.exit(1);
}

console.log(`🚀 Iniciando ${tokens.length} conta(s)...`);

// Conecta cada conta
tokens.forEach((token, index) => {
  const trimmedToken = token.trim();
  
  if (!trimmedToken) return;
  
  const client = new Client({
    checkUpdate: false
  });
  
  client.on('ready', () => {
    console.log(`✅ Conta ${index + 1} online: ${client.user.tag}`);
  });
  
  client.on('error', (err) => {
    console.error(`❌ Erro na Conta ${index + 1}:`, err.message);
  });
  
  client.login(trimmedToken).catch(err => {
    console.error(`❌ Falha ao conectar Conta ${index + 1}:`, err.message);
  });
});
