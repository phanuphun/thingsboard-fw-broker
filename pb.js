const mqtt = require("mqtt");

const host = "191.20.110.47"; // หรือ IP ของ MQTT broker
const port = 1883; // พอร์ตที่ใช้สำหรับ MQTT broker

const accessToken = "y8nm7aiz1l2e5iqbs4bl"; // ใส่ access token ที่ได้จาก Dashboard

const client = mqtt.connect(`mqtt://${host}:${port}`, {
  clientId: `freefarm-publish-${Math.floor(Math.random() * 1000)}`,
  username: accessToken,
  reconnectPeriod: 3000, // รอ 3 วิถ้าหลุด
  keepalive: 10, // ส่ง ping ทุก 60 วินาที
  clean: true, // ใช้ session ใหม่ทุกครั้ง
});

const TEST_TOPIC = "v1/devices/me/telemetry";

client.on("connect", () => {
  console.log("🌐 Connected to MQTT broker");

  // ไม่ต้อง publish แรกทันที → ไปทำใน loop ได้เลย
  setInterval(() => {
    const TEST_MESSAGE = "ping_" + Date.now();
    const sensorData = {
      temperature: (20 + Math.random() * 10).toFixed(2),
      humidity: (40 + Math.random() * 20).toFixed(2),
      light: Math.floor(300 + Math.random() * 200),
      co2: Math.floor(400 + Math.random() * 100), // CO2 level (ppm)
      pressure: (1000 + Math.random() * 50).toFixed(2), // Pressure (hPa)
      pm25: (5 + Math.random() * 10).toFixed(2), // PM2.5 (µg/m³)
      pm10: (10 + Math.random() * 20).toFixed(2), // PM10 (µg/m³)
      voc: (0.1 + Math.random() * 0.5).toFixed(2), // VOC (ppm)
      noise: (30 + Math.random() * 20).toFixed(2), // Noise (dB)
      battery: (50 + Math.random() * 50).toFixed(2), // Battery (%)
      motion: Math.random() > 0.5, // Motion detected (bool)
      uv: (0 + Math.random() * 10).toFixed(2), // UV index
      rainfall: (0 + Math.random() * 5).toFixed(2), // Rainfall (mm)
      windSpeed: (0 + Math.random() * 15).toFixed(2), // Wind speed (m/s)
      windDirection: Math.floor(Math.random() * 360), // Wind direction (degrees)
      soilMoisture: (10 + Math.random() * 40).toFixed(2), // Soil moisture (%)
      soilTemperature: (15 + Math.random() * 10).toFixed(2), // Soil temperature (°C)
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

process.on("SIGINT", () => {
  console.log(
    "\n🛑 Caught interrupt signal (SIGINT), disconnecting MQTT client..."
  );
  // client.end() จะส่ง DISCONNECT packet ไปยัง broker ก่อนปิด connection
  client.end(false, () => {
    console.log("✅ MQTT client disconnected, exiting process.");
    process.exit(0);
  });
});
