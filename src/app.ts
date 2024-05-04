import 'dotenv/config'
import { createBot, MemoryDB, createProvider } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
import flow from './flows';

const PORT = process.env.PORT ?? 3001

const main = async () => {
    const provider = createProvider(BaileysProvider)

    const { handleCtx, httpServer } = await createBot({
        database: new MemoryDB(),
        provider,
        flow,
    })

    httpServer(+PORT)

    provider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        const { number, message } = req.body
        await bot.sendMessage(number, message, {})
        return res.end('send')
    }))
}

main()