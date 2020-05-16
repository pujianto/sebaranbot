import fs from 'fs'; 
import { v4 as uuidv4 } from 'uuid';
import TelegramBot from 'node-telegram-bot-api';
import Mustache from 'mustache';

class SebaranBot {
    
    constructor (config, JsonFilePath) {
        this.telegram = new TelegramBot(config.telegram.token, config.telegram.config);
        this.config = config;
        this.data = {};
        this.jsonPath = JsonFilePath;
        this.inlineTemplate = fs.readFileSync('templates/inline_search.mustache').toString();
        this.refreshData();

    }

    _inlineSearch (query) {
        console.debug(`incoming search from: ${query.from.first_name} ${query.from.last_name || ''} query: ${query.query}`);
        if (query.query.length < 4) {
            return null; 
        }

        const results = this.data.locations.filter(item => {
            const q = query.query.replace(/\W+/g,' ').replace(/\s\s+/g, ' ').toLowerCase().split(' ');
            return q.every((el) => {
                return item.fullName.toLowerCase().indexOf(el) > -1;
            })
        }).slice(0, this.config.telegram.max_inline_results);

        if (results.length < 1) {
            return null; 
        }

        const lastSync = (new Date(this.data.lastSync)).toLocaleString('en-ID', { timeZone: 'Asia/Jakarta' });
        const answers = results.map((answer) => {
            
            const answerId = uuidv4();
            const message = Mustache.render(this.inlineTemplate, {lastSync: lastSync, fullName: answer.fullName, severity: answer.severity })

            return {
                type: 'article',
                id: answerId,
                title: `Kec. ${answer.name}`,
                description: `Info tingkat penyebaran COVID-19 di Kec. ${answer.fullName}`,
                input_message_content: {
                    message_text: message,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'

                }
            };
        });

        this.telegram.answerInlineQuery(query.id, answers); 
    }

    watch () {
        this.telegram.on('inline_query', (query) => {
            this._inlineSearch(query);
        });

        this.telegram.on('polling_error', (err) => console.error(err));
    }

    refreshData () {
        this.data = JSON.parse(fs.readFileSync(this.jsonPath));
        console.debug('data refreshed');
    }

}

export default SebaranBot;
 
