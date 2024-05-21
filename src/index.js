const events = require('events');
const fs = require('fs');

const writeDirAndFile = ((data, path) => {
const dirs = path.split("/").slice(1, -1);

  if (dirs.length === 0) {
      fs.writeFileSync(path, data, "utf-8");
  } else {
      const dirsLength = dirs.length;
      const processedDirs = [];
      let i = 0;

      while (i < dirsLength) {
          processedDirs.push(dirs[i]);
          const currentPath = `./${processedDirs.join("/")}`;

          if (!fs.existsSync(currentPath) || !fs.lstatSync(currentPath).isDirectory()) {
              fs.mkdirSync(currentPath);
          }

          i++;
      }

      fs.writeFileSync(path, data, "utf-8");
  }
}); 

class viceDB extends events {
    constructor(construct) {
        super();
        this.dataLog = construct.dataLog || Boolean(false);
        this.eventData = {};
        this.data = {};
        this.jsonFilePath = construct.filePath || "./vicedb/database.json";

        if(!fs.existsSync(this.jsonFilePath)){
            writeDirAndFile("{}", this.jsonFilePath);
        } else {
          const checkedData = JSON.parse(fs.readFileSync(this.jsonFilePath));
          if(typeof checkedData === "object") {
            this.data = checkedData;
          }
        }
        } 

    saveData() {
            fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.data, null, 2), "utf-8");
        }

    set(key, value) {
          // DataChange Event //
           if (this.dataLog == true) {
            if (this.data[key] == undefined && value.length < 15) { this.on("dataChange", console.log('\x1b[33m', `-- ViceDB | 🧬 "${key}", "${value}" değeriyle oluşturuldu!`)); };
            if (this.data[key] == undefined && value.length > 15) { this.on("dataChange", console.log('\x1b[33m', `-- ViceDB | 🧬 "${key}" oluşturuldu!`)); };
            if (this.data[key] !== value && this.data[key] !== undefined && value.length < 15 && this.data[key].length < 15) { this.on("dataChange", console.log(`\x1b[33m -- ViceDB | "${this.data[key]}" 🔧 "${value}" değişikliği "${key}" için gerçekleşti!`)); };
            if (this.data[key] == value) return;
            if (this.data[key] !== undefined) {
              if (value.length > 15 || this.data[key].length > 15) { this.on("dataChange", console.log(`\x1b[33m -- ViceDB | 🔧 "${key}" için bir değişiklik gerçekleşti!`)); };
            }
           }
          // DataChange Event //

            this.data[key] = value;
            if (!key) throw Error("Değiştirilecek değişken bulunamadı!");
            if (!value) throw Error("Değiştirilecek değer bulunamadı!");
            this.saveData();
          }

    get(key) {
          if (this.data[key] == undefined) throw Error("Çekilecek veri bulunamadı!");
          if (!key) {
                throw Error("Çekilecek veri bulunamadı!");
          } else {
                return this.data[key];
          }
        }

    remove(key) {
          if (this.data[key] == undefined) throw Error("Silinecek veri bulunamadı!");
          if (!key) {
            throw Error("Silinecek veri bulunamadı!");
      } else {
        if (this.data[key].length < 15) { this.on("dataChange", console.log('\x1b[33m', `-- ViceDB | 🗑️  "${key}" değişkeni silindi, "${this.data[key]}" değeriydi!`)); }
        else { this.on("dataChange", console.log('\x1b[33m', `-- ViceDB | 🗑️  "${key}" değişkeni silindi!`)); }
            delete this.data[key];
            this.saveData();
      }
    }  
    
    clear() {
      this.data = {};
      this.saveData();
    }

    on(event) {}
  }

module.exports = viceDB;
