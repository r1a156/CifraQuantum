import asyncio
import aiohttp
from datetime import datetime, timedelta
import json
from pathlib import Path
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

TELEGRAM_BOT_TOKEN = "6490419657:AAEY_naNgWDxEiComiVGdWFRd89JOrRSCn4"
TELEGRAM_CHAT_ID = "@Bigboss191719"

class DailyReportBot:
    def __init__(self):
        self.bot = Bot(token=TELEGRAM_BOT_TOKEN)
        self.dp = Dispatcher()
        self.setup_handlers()
        
    def setup_handlers(self):
        @self.dp.message(Command("start"))
        async def cmd_start(message: types.Message):
            await message.answer("🌌 Цифра 2.0 + Chronos - Бот активирован!")
            
        @self.dp.message(Command("status"))
        async def cmd_status(message: types.Message):
            status = await self.get_network_status()
            await message.answer(status, parse_mode="Markdown")
            
    async def get_network_status(self) -> str:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get('http://localhost:8000/stats') as response:
                    stats = await response.json()
            return (
                "📊 *СТАТУС СЕТИ ЦИФРА + CHRONOS*\n"
                f"📍 Блоков: {stats['total_blocks']}\n"
                f"🎯 Точность AI: {stats['avg_ai_score']*100:.1f}%\n"
                f"🔗 Размер сети: {stats['cell_network_size']} ячеек\n"
                f"🔄 Цикл эволюции: {stats['evolution_cycle']}\n"
                f"⏰ Время: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            )
        except Exception as e:
            return f"❌ Ошибка получения статуса: {e}"
    
    async def start_bot(self):
        print("🤖 Запуск Telegram бота...")
        await self.dp.start_polling(self.bot)
    
    async def stop_bot(self):
        await self.bot.close()

daily_bot = DailyReportBot()
