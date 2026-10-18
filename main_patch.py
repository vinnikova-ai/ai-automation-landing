# ===== main.py: что изменить =====
# 1) Импорты (HTMLTemplateResponse в FastAPI не существует — это был ImportError):
import logging
from fastapi import Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

# 2) УДАЛИТЕ старый @app.get("/"), который отдавал index.html,
#    иначе он перехватит корень раньше лендинга.

# 3) Роуты (templates и app.mount("/static", ...) у вас уже должны быть):
@app.get("/", response_class=HTMLResponse)
async def read_landing(request: Request):
    return templates.TemplateResponse(request, "landing.html")

@app.get("/dashboard", response_class=HTMLResponse)
async def read_dashboard(request: Request):
    # Меняется только адрес. Проверку initData не трогаем: она живёт в API-эндпоинтах.
    return templates.TemplateResponse(request, "index.html")

# 4) Приёмник формы лид-магнита (пока только логирует; хранение/отправку гайда подключите сами)
class Lead(BaseModel):
    name: str
    telegram: str

@app.post("/api/lead")
async def create_lead(lead: Lead):
    logging.info("LEAD name=%s telegram=%s", lead.name, lead.telegram)
    return {"ok": True}

# ===== bot.py: кнопка Web App =====
# from aiogram.types import WebAppInfo
# WebAppInfo(url=f"{BASE_URL}/dashboard")   # BASE_URL = https://ваш-домен, без хвостового /
# Если Web App задан ещё и через меню-кнопку в @BotFather, обновите URL и там.
