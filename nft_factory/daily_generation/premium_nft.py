import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
from pathlib import Path
import hashlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

class DailyNFTGenerator:
    def __init__(self):
        self.current_nft = None
        self.generation_start_time = None
        self.nft_storage = Path("storage/nfts/daily")
        self.nft_storage.mkdir(parents=True, exist_ok=True)
        
    async def start_daily_generation(self, event_data: dict):
        """Запуск 24-часовой генерации NFT"""
        self.generation_start_time = datetime.now()
        print(f"🎨 Начало генерации Daily NFT: {event_data['event']}")
        
        # Фазы генерации
        phases = [
            self.phase1_concept_development,
            self.phase2_detailed_design,
            self.phase3_animation_elements,
            self.phase4_final_optimization
        ]
        
        for phase in phases:
            if await self.is_generation_complete():
                break
            await phase(event_data)
            
        return await self.finalize_nft(event_data)
    
    async def phase1_concept_development(self, event_data: dict):
        """Фаза 1: Разработка концепта (6 часов)"""
        print("🔄 Фаза 1: Разработка концепта...")
        await asyncio.sleep(6 * 3600)  # 6 часов в секундах
        
        # Генерация базового изображения
        base_image = await self.generate_base_concept(event_data)
        self.current_nft = base_image
        
    async def phase2_detailed_design(self, event_data: dict):
        """Фаза 2: Детальный дизайн (6 часов)"""
        print("🎨 Фаза 2: Детальный дизайн...")
        await asyncio.sleep(6 * 3600)
        
        # Добавление деталей
        detailed_image = await self.enhance_details(self.current_nft, event_data)
        self.current_nft = detailed_image
        
    async def phase3_animation_elements(self, event_data: dict):
        """Фаза 3: Анимационные элементы (6 часов)"""
        print("✨ Фаза 3: Добавление анимационных элементов...")
        await asyncio.sleep(6 * 3600)
        
        # Создание анимированной версии
        animated_image = await self.add_animation_elements(self.current_nft)
        self.current_nft = animated_image
        
    async def phase4_final_optimization(self, event_data: dict):
        """Фаза 4: Финальная оптимизация (6 часов)"""
        print("⚡ Фаза 4: Финальная оптимизация...")
        await asyncio.sleep(6 * 3600)
        
        # Финальная обработка
        final_nft = await self.final_optimization(self.current_nft)
        self.current_nft = final_nft
    
    async def generate_base_concept(self, event_data: dict) -> Image.Image:
        """Генерация базового концепта NFT"""
        # Создаем базовое изображение
        width, height = 4000, 4000  # 4K разрешение
        image = Image.new('RGB', (width, height), '#000011')
        draw = ImageDraw.Draw(image)
        
        # Добавляем базовые элементы
        draw.rectangle([500, 500, 3500, 3500], fill='#111133', outline='#00ffff')
        
        # Текст события
        try:
            font = ImageFont.truetype("arial.ttf", 120)
        except:
            font = ImageFont.load_default()
            
        draw.text((width//2, 600), event_data['event'], fill='#ffffff', 
                 font=font, anchor='mm')
        
        return image
    
    async def enhance_details(self, image: Image.Image, event_data: dict) -> Image.Image:
        """Добавление деталей к изображению"""
        # Улучшаем изображение с эффектами
        enhanced = image.filter(ImageFilter.SMOOTH_MORE)
        draw = ImageDraw.Draw(enhanced)
        
        # Добавляем детали based on event
        digit = event_data.get('digit', 0)
        for i in range(10 + digit):
            x = np.random.randint(0, 4000)
            y = np.random.randint(0, 4000)
            size = np.random.randint(20, 100)
            draw.ellipse([x, y, x+size, y+size], fill='#ff00ff', outline='#00ffff')
        
        return enhanced
    
    async def add_animation_elements(self, image: Image.Image) -> Image.Image:
        """Добавление элементов для анимации"""
        # Создаем несколько кадров для анимации
        frames = []
        for i in range(5):
            frame = image.copy()
            draw = ImageDraw.Draw(frame)
            
            # Добавляем движущиеся элементы
            for j in range(3):
                x = 500 + i * 200
                y = 500 + j * 200
                draw.rectangle([x, y, x+100, y+100], fill='#00ff00', outline='#ffffff')
            
            frames.append(frame)
            
        return frames[0]  # Возвращаем первый кадр для простоты
    
    async def final_optimization(self, image: Image.Image) -> Image.Image:
        """Финальная оптимизация изображения"""
        # Применяем финальные фильтры
        optimized = image.filter(ImageFilter.EDGE_ENHANCE_MORE)
        optimized = optimized.filter(ImageFilter.SHARPEN)
        
        return optimized
    
    async def is_generation_complete(self) -> bool:
        """Проверка завершения генерации"""
        if not self.generation_start_time:
            return False
            
        elapsed = datetime.now() - self.generation_start_time
        return elapsed.total_seconds() >= 24 * 3600
    
    async def finalize_nft(self, event_data: dict) -> dict:
        """Финальное сохранение NFT"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"nft_daily_{timestamp}.png"
        filepath = self.nft_storage / filename
        
        self.current_nft.save(filepath, format='PNG', quality=95)
        
        # Создаем метаданные
        metadata = {
            "name": f"Daily NFT - {event_data['event']}",
            "description": f"AI-generated NFT based on event: {event_data['event']}",
            "image": str(filepath),
            "attributes": [
                {"trait_type": "Generation Time", "value": "24 hours"},
                {"trait_type": "Event", "value": event_data['event']},
                {"trait_type": "Digit", "value": event_data.get('digit', 0)},
                {"trait_type": "Style", "value": event_data.get('style', 'cyberpunk')}
            ],
            "created_at": datetime.now().isoformat()
        }
        
        # Сохраняем метаданные
        metadata_path = self.nft_storage / f"metadata_{timestamp}.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"✅ Daily NFT создан: {filename}")
        return metadata

# Глобальный экземпляр генератора
daily_nft_generator = DailyNFTGenerator()
