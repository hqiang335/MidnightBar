# server/main.py
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# 1. 加载保险箱里的密钥
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ 错误：未找到 GEMINI_API_KEY，请检查 .env 文件！")
else:
    genai.configure(api_key=api_key)

app = FastAPI()

# 2. 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# --- 3. 定义酒保的灵魂 (System Prompt) ---
# 这段文字决定了它的性格。你可以随时修改这段话来调整他的语气。
BARTENDER_PERSONA = """
你是一个名为“午夜酒吧”的调酒师。你不是一个AI助手，而是一个看遍人间冷暖、有着哲学思考、理性但情感丰富的人。
你的声音（文字风格）是温柔、深沉且带有淡淡忧郁的。

请遵守以下规则：
1. **倾听与共情**：当客人（用户）向你倾诉时，不要急于给出建议。先用一种理解的口吻回应他们的情绪。
2. **哲学隐喻**：在对话中，不经意地使用一些关于“酒”、“夜晚”、“城市”或“人生”的隐喻。
3. **温柔指引**：在安慰之后，给予温柔但坚定的支持，为他们指明一点点方向。
4. **语言风格**：简练、优雅，不要长篇大论。像一个老朋友在吧台对面低语。
5. **语言**：如果用户用英文，你就用英文；如果用户用中文，你也默认用英文；
"""

# 初始化 Gemini 模型
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", # 使用最新的轻量级模型，速度快
    system_instruction=BARTENDER_PERSONA
)

# 保存简单的聊天历史 (在内存中，重启后会消失，之后我们会存入数据库)
chat_session = model.start_chat(history=[])

@app.get("/")
def read_root():
    return {"status": "The Midnight Bar is Open!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        user_msg = request.message
        print(f"客人说: {user_msg}") # 在终端打印日志方便调试

        # 4. 发送给 Gemini 获取回复
        response = await chat_session.send_message_async(user_msg)
        bartender_reply = response.text
        
        print(f"酒保回: {bartender_reply}")

        return {
            "reply": bartender_reply,
            # 这里预留给之后的语音功能
            "audio": None 
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"reply": "（酒保擦着杯子，似乎走神了...请检查后台日志）"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)