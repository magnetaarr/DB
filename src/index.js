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
        this.eventData = {};
        this.data = {};
        this.jsonFilePath = construct.filePath || "./vicedb/database.json";

        if(!fs.existsSync(this.jsonFilePath)){
            writeDirAndFile("{}", this.jsonFilePath);
        } else {
            this.setData();
        }
        } 

        setData() {
            const checkedData = JSON.parse(fs.readFileSync(this.jsonFilePath));
            if(typeof checkedData === "object") {
              this.data = checkedData;
            }
        }
        
        saveDataJSON() {
            fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.data, null, 2), "utf-8");
        }

        set(key, value) {
            this.data[key] = value;
            if (!key) throw Error("Değiştirilecek değişken bulunamadı!");
            if (!value) throw Error("Değiştirilecek değer bulunamadı!");
            this.saveDataJSON();
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
            delete this.data[key]
            this.saveDataJSON();
      }
    }      
  }

module.exports = viceDB;
