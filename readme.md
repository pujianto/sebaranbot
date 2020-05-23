# Sebaranbot Backend
Sebuah inline bot Telegram yang menyajikan informasi tingkat kerentanan persebaran COVID-19 (tinggi, sedang, dan rendah) pada tingkat kecamatan. Data diambil perjam dari situs https://covid19.go.id/peta-sebaran

Sebaranbot memanfaatkan fitur [inline bot](https://core.telegram.org/bots/inline) di Telegram, yang memungkinkan berinteraksi dengan bot tanpa perlu chat secara langsung. cukup mention @sebaranbot diikuti nama kecamatan.

### Cara menjalankan
- Buat `.env` file dan isi parameter bot sesuai dengan template di `example.env` 
- `npm run fetch-data` untuk mendownload data dari data.covid19.go.id
- `npm start` untuk menjalankan backend bot
