import asyncio
import aiohttp
from datetime import datetime, timedelta
import json
from pathlib import Path
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
import sys
sys.path.append('..')
from quantum_blockchain.core.quantum_chain import quantum_blockchain
from chronos_exchange.ai_market_maker.odds_calculator import odds_calculator

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
            
        @self.dp.message(Command("nft"))
        async def cmd_nft(message: types.Message):
            nft_info = await self.get_daily_nft_info()
            await message.answer(nft_info, parse_mode="Markdown")
            
        @self.dp.message(Command("bet"))
        async def cmd_bet(message: types.Message):
            try:
                _, event_id, prediction, amount = message.text.split()
                amount = int(amount)
                prediction = prediction.lower() == "yes"
                user = message.from_user.username
                quantum_blockchain.place_bet(event_id, user, amount, prediction)
                odds = await odds_calculator.calculate_odds({"event_id": event_id})
                await message.answer(
                    f"✅ Ставка принята!\n"
                    f"Событие: {event_id}\n"
                    f"Прогноз: {'YES' if prediction else 'NO'}\n"
                    f"Сумма: {amount} TRUTH\n"
                    f"Коэффициенты: YES {odds['yes_odds']}x, NO {odds['no_odds']}x",
                    parse_mode="Markdown"
                )
            except Exception as e:
                await message.answer(f"❌ Ошибка: {e}", parse_mode="Markdown")
    
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
                f"🖼️ NFT создано: {stats['listed_nfts']}\n"
                f"📈 Рынков Chronos: {len(quantum_blockchain.prediction_markets)}\n"
                f"⏰ Время: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            )
        except Exception as e:
            return f"❌ Ошибка получения статуса: {e}"
    
    async def get_daily_nft_info(self) -> str:
        nft_storage = Path("storage/nfts/daily")
        if not nft_storage.exists():
            return "🎨 Daily NFT еще не создан"
        nft_files = list(nft_storage.glob("nft_daily_*.png"))
        if not nft_files:
            return "🎨 Daily NFT еще не создан"
        latest_nft = max(nft_files, key=lambda x: x.stat().st_mtime)
        metadata_file = nft_storage / f"metadata_{latest_nft.stem.split('_')[-1]}.json"
        if metadata_file.exists():
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
            return (
                "🖼️ *ПОСЛЕДНИЙ DAILY NFT*\n"
                f"📛 Название: {metadata['name']}\n"
                f"📝 Описание: {metadata['description']}\n"
                f"🔄 Атрибуты:\n"
                f"   - Время генерации: {metadata['attributes'][0]['value']}\n"
                f"   - Событие: {metadata['attributes'][1]['value']}\n"
                f"   - Цифра: {metadata['attributes'][2]['value']}\n"
                f"⏰ Создан: {metadata['created_at']}"
            )
        return f"🎨 NFT создан: {latest_nft.name}"
    
    async def send_daily_report(self):
        try:
            status_report = await self.get_network_status()
            nft_report = await self.get_daily_nft_info()
            report = (
                "🌌 *ЕЖЕДНЕВНЫЙ ОТЧЕТ ЦИФРА + CHRONOS*\n"
                "=============================\n"
                f"{status_report}\n\n"
                f"{nft_report}\n\n"
                f"📅 {datetime.now().strftime('%Y-%m-%d')}"
            )
            await self.bot.send_message(chat_id=TELEGRAM_CHAT_ID, text=report, parse_mode="Markdown")
            print("✅ Ежедневный отчет отправлен в Telegram")
        except Exception as e:
            print(f"❌ Ошибка отправки отчета: {e}")
    
    async def start_bot(self):
        print("🤖 Запуск Telegram бота...")
        await self.dp.start_polling(self.bot)
    
    async def stop_bot(self):
        await self.bot.close()

daily_bot = DailyReportBot()
