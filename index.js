const {
  makeWASocket,
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
} = require("baileys");

const qrcode = require("qrcode-terminal");
const { Boom } = require("@hapi/boom");
const axios = require("axios");
require("dotenv").config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED =
  process.env.NODE_TLS_REJECT_UNAUTHORIZED;

console.log(
  "NODE_TLS_REJECT_UNAUTHORIZED",
  process.env.NODE_TLS_REJECT_UNAUTHORIZED
);

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.appropriate("Desktop"),
    printQRInTerminal: false,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close" && lastDisconnect) {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }

    if (update.qr) {
      qrcode.generate(update.qr, { small: true });
    }
  });
  sock.ev.on("messages.upsert", async (m) => {
    for (let index = 0; index < m.messages.length; index++) {
      const message = m.messages[index];
      const content =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text;

      if (message.key.remoteJid.endsWith("@g.us")) {
        continue;
      }

      if (content && (content.startsWith("/++") || content.startsWith("/--"))) {
        const messageText = content;

        try {
          const response = await axios.post(
            `${process.env.API_URL}/transaction?messagem=${encodeURIComponent(
              messageText
            )}`,
            null,
            {
              headers: { Accept: "*/*" },
            }
          );
          const result = response.data;

          await sock.sendMessage(message.key.remoteJid, {
            text: `✅ ${JSON.stringify(result)}`,
          });
        } catch (error) {
          await sock.sendMessage(message.key.remoteJid, {
            text: "Erro ao comunicar com a API.",
          });
        }
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

connectToWhatsApp();
