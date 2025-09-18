import asyncio
import sys
import os

# Добавляем пути для импорта
sys.path.append('.')
sys.path.append('./telegram_orchestrator')
sys.path.append('./agentic_evolution')

try:
    from telegram_orchestrator.reports.daily_bot import daily_bot
    from agentic_evolution.evolution_engine import evolution_engine
except ImportError as e:
    print(f"Ошибка импорта: {e}")
    print("Создаем заглушки...")
    
    # Создаем заглушки если модули отсутствуют
    class DailyBotStub:
        async def start_bot(self):
            print("🤖 Telegram бот (заглушка) запущен")
    
    class EvolutionEngineStub:
        async def evolution_loop(self):
            print("⚙️ Эволюционный движок (заглушка) запущен")
            while True:
                await asyncio.sleep(300)
    
    daily_bot = DailyBotStub()
    evolution_engine = EvolutionEngineStub()

async def main():
    print("🚀 Запуск системы Цифра + Chronos...")
    
    # Запуск Telegram бота
    bot_task = asyncio.create_task(daily_bot.start_bot())
    
    # Запуск эволюционного движка
    evolution_task = asyncio.create_task(evolution_engine.evolution_loop())
    
    print("🌐 API доступен на http://localhost:8000")
    print("🌌 Фронтенд доступен на http://localhost:3000")
    print("📊 Мониторинг: http://localhost:3001")
    
    try:
        await asyncio.gather(bot_task, evolution_task)
    except asyncio.CancelledError:
        print("🛑 Система остановлена")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Остановка системы...")
