const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "smart-farm-js-subscriber",
  keepalive: 60,
  reconnectPeriod: 3000,
  clean: true,
});

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  // ✅ รับ RPC จาก Dashboard
  client.subscribe("external/telemetry/+", { qos: 0 }, (err) => {
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
