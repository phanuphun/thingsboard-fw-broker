const mqtt = require("mqtt");

const host = "191.20.110.47"; // หรือ IP ของ MQTT broker
const port = 1883; // พอร์ตที่ใช้สำหรับ MQTT broker

const accessToken = "8HveGd6agfbntNc7Wt33"; // ใส่ access token ที่ได้จาก Dashboard

const client = mqtt.connect(`mqtt://${host}:${port}`, {
  clientId: `smart-bruh-js-publisher-${Math.floor(Math.random() * 1000)}`,
  username: accessToken,
  reconnectPeriod: 3000, // รอ 3 วิถ้าหลุด
  keepalive: 60, // ส่ง ping ทุก 60 วินาที
  clean: true, // ใช้ session ใหม่ทุกครั้ง
});

const TEST_TOPIC = "v1/devices/me/telemetry";
const TEST_MESSAGE = "ping_" + Date.now();

client.on("connect", () => {
  console.log("🌐 Connected to MQTT broker");

  // ไม่ต้อง publish แรกทันที → ไปทำใน loop ได้เลย
  setInterval(() => {
    const TEST_MESSAGE = "ping_" + Date.now();
    const sensorData = {
      temperature: (20 + Math.random() * 10).toFixed(2),
      humidity: (40 + Math.random() * 20).toFixed(2),
      light: Math.floor(300 + Math.random() * 200),
      message: TEST_MESSAGE,
      timestamp: new Date().toISOString(),
    };

    client.publish(
      TEST_TOPIC,
      JSON.stringify(sensorData),
      { qos: 1, retain: true },
      (err) => {
        if (err) {
          console.error("❌ Publish error:", err);
        } else {
          console.log(`📤 Published to ${TEST_TOPIC}:`, sensorData);
        }
      }
    );
  }, 2000);
});

client.on("disconnect", (packet) => {
  console.warn("⚠️ Disconnected:", packet);
});

client.on("offline", () => {
  console.warn("⚠️ Client went offline");
});

client.on("end", () => {
  console.log("🛑 Client ended");
});

client.on("error", (err) => {
  console.error("❌ MQTT Error:", err.message);
});

client.on("reconnect", () => {
  console.log("🔁 Reconnecting to MQTT broker...");
});
