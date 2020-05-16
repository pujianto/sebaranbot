import chokidar from 'chokidar';
import dotenv from 'dotenv';
import SebaranBot from './sebaranbot.js';

dotenv.config();
const config = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN',
        max_inline_results: process.env.MAX_INLINE_RESULTS || 10, 
        config: {
            polling: {
                interval: 700,
                params: {
                    timeout: 15,            
                }
            }
        }
    },

};
 
const bot = new SebaranBot(config, 'runtime/locations.json');

chokidar.watch('runtime/watchfile', {
    'persistent': true
}).on('change', (path) => {
    console.debug(`${path} has been changed`);
    bot.refreshData();
});

bot.watch();

