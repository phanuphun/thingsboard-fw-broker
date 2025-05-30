const mqtt = require("mqtt");

const host = "191.20.110.47"; // หรือ IP ของ MQTT broker
const port = 1885; // พอร์ตที่ใช้สำหรับ MQTT broker

const client = mqtt.connect(`mqtt://${host}:${port}`, {
  clientId: "smart-farm-js-subscriber",
  keepalive: 60,
  reconnectPeriod: 3000,
  clean: true,
});

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  // ✅ รับ RPC จาก Dashboard
  client.subscribe("/external/telemetry", { qos: 1 }, (err) => {
    if (err) {
      console.error("❌ Subscribe error:", err.message);
    } else {
      console.log("📡 Subscribed to RPC requests");
    }
  });
});

client.on("message", (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.log(`📥 [${topic}]`, payload);
  } catch (err) {
    console.error("❌ Error parsing message:", err.message);
  }
});
