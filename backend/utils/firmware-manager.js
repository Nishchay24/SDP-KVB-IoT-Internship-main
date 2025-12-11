// utils/firmware-manager.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class FirmwareManager {
  constructor(firmwareDir) {
    this.firmwareDir = firmwareDir;
    this.ensureFirmwareDir();
  }

  ensureFirmwareDir() {
    if (!fs.existsSync(this.firmwareDir)) {
      fs.mkdirSync(this.firmwareDir, { recursive: true });
    }
  }

  uploadFirmware(firmwareBuffer, version) {
    try {
      const firmwarePath = path.join(this.firmwareDir, "firmware.bin");

      // Write firmware file
      fs.writeFileSync(firmwarePath, firmwareBuffer);

      // Create version info file
      const versionInfo = {
        version: version,
        timestamp: new Date().toISOString(),
        size: firmwareBuffer.length,
        md5: this.calculateMD5(firmwareBuffer),
      };

      const versionPath = path.join(this.firmwareDir, "version.json");
      fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));

      console.log("Firmware uploaded successfully:");
      console.log(`- Version: ${version}`);
      console.log(`- Size: ${firmwareBuffer.length} bytes`);
      console.log(`- MD5: ${versionInfo.md5}`);

      return versionInfo;
    } catch (error) {
      console.error("Error uploading firmware:", error);
      throw error;
    }
  }

  calculateMD5(buffer) {
    const hashSum = crypto.createHash("md5");
    hashSum.update(buffer);
    return hashSum.digest("hex");
  }

  getFirmwareInfo() {
    try {
      const firmwarePath = path.join(this.firmwareDir, "firmware.bin");
      const versionPath = path.join(this.firmwareDir, "version.json");

      if (!fs.existsSync(firmwarePath) || !fs.existsSync(versionPath)) {
        return null;
      }

      const versionInfo = JSON.parse(fs.readFileSync(versionPath, "utf8"));
      const stats = fs.statSync(firmwarePath);

      return {
        ...versionInfo,
        fileExists: true,
        fileSize: stats.size,
      };
    } catch (error) {
      console.error("Error getting firmware info:", error);
      return null;
    }
  }
}

module.exports = FirmwareManager;
