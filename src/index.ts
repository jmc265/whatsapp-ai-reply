import OpenAI from 'openai';
import qrcode from 'qrcode-terminal';
import { Client, LocalAuth, MessageTypes } from 'whatsapp-web.js';

const openAiAPIKey = process.env.OPEN_AI_API_KEY;
const openAiModelKey = process.env.OPEN_AI_MODEL_KEY;
const openAiSystemPrompt = process.env.OPEN_AI_SYSTEM_PROMPT;

if (!openAiAPIKey) {
    console.log('Please sent environment variable "OPEN_AI_API_KEY"');
    process.exit(1);
}
if (!openAiModelKey) {
    console.log('Please sent environment variable "OPEN_AI_MODEL_KEY"');
    process.exit(1);
}
if (!openAiSystemPrompt) {
    console.log('Please sent environment variable "OPEN_AI_SYSTEM_PROMPT"');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: openAiAPIKey
});

const whatsAppClient = new Client({
    authStrategy: new LocalAuth({
        dataPath: '/mnt/auth-data'
    }),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

whatsAppClient.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

whatsAppClient.on('ready', () => {
    console.log('WhatsApp AI Reply is ready');
    console.log('WhatsApp Self ID: ', whatsAppClient.info.wid._serialized)
});

whatsAppClient.on('message_reaction', async (whatsAppReaction) => {
    if (whatsAppReaction.senderId !== process.env.SELF_CONTACT_ID) {
        return;
    }
    if (!whatsAppReaction.reaction || whatsAppReaction.reaction === '') {
        return;
    }
    const whatsAppMessage = await whatsAppClient.getMessageById(whatsAppReaction.msgId._serialized);
    if (whatsAppMessage.type !== MessageTypes.TEXT) {
        return;
    }
    const whatsAppChat = await whatsAppMessage.getChat();
    try {
        await whatsAppChat.sendStateTyping();
        await whatsAppMessage.react('');
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: openAiSystemPrompt },
                { role: 'user', content: whatsAppMessage.body },
                { role: 'user', content: whatsAppReaction.reaction }
            ],
            model: openAiModelKey,
        });
        if (chatCompletion.choices[0].message.content) {
            await whatsAppMessage.reply(chatCompletion.choices[0].message.content);
        }
    } catch (e) {
        console.error('Error getting AI reply', e);
    } finally {
        await whatsAppChat.clearState();
    }
});

whatsAppClient.initialize();
