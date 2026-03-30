const Eris = require("eris");
const keep_alive = require('./keep_alive.js')

// Suporta múltiplos tokens separados por vírgula
const tokens = process.env.TOKENS ? process.env.TOKENS.split(',') : [];

if (tokens.length === 0) {
  console.error('❌ Nenhum token encontrado! Configure a variável TOKENS.');
  process.exit(1);
}

console.log(`🚀 Iniciando ${tokens.length} bot(s)...`);

// Conecta cada bot
tokens.forEach((token, index) => {
  const trimmedToken = token.trim();
  
  if (!trimmedToken) return;
  
  const bot = new Eris(trimmedToken);
  
  bot.on("ready", () => {
    console.log(`✅ Bot ${index + 1} conectado: ${bot.user.username}#${bot.user.discriminator}`);
  });
  
  bot.on("error", (err) => {
    console.error(`❌ Erro no Bot ${index + 1}:`, err);
  });
  
  bot.connect().catch(err => {
    console.error(`❌ Falha ao conectar Bot ${index + 1}:`, err.message);
  });
});
