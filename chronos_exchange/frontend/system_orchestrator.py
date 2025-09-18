import asyncio
import sys
import os
from telegram_orchestrator.reports.daily_bot import daily_bot
from agentic_evolution.evolution_engine import evolution_engine

async def main():
    print("🚀 Запуск системы Цифра + Chronos...")
    
    # Запуск Telegram бота
    bot_task = asyncio.create_task(daily_bot.start_bot())
    
    # Запуск эволюционного движка
    evolution_task = asyncio.create_task(evolution_engine.evolution_loop())
    
    # Запуск API и фронтенда через Docker (предполагается, что они уже запущены через docker-compose)
    print("🌐 API доступен на http://localhost:8000")
    print("🌌 Фронтенд доступен на http://localhost:3000")
    
    await asyncio.gather(bot_task, evolution_task)

if __name__ == "__main__":
    asyncio.run(main())
