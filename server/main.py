# server/main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# --- 1. 配置 CORS (跨域资源共享) ---
# 这非常重要！它允许你的前端(localhost:5173)访问这个后端(localhost:8000)
# 如果没有这段代码，浏览器会拦截请求。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源（开发阶段方便）
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义发送给后端的数据格式
class ChatRequest(BaseModel):
    message: str

# --- 2. 创建一个简单的测试接口 ---
@app.get("/")
def read_root():
    return {"status": "The Midnight Bar is Open!"}

# --- 3. 创建一个模拟聊天的接口 ---
@app.post("/chat")
async def chat(request: ChatRequest):
    # 暂时不接 Gemini，先模拟回复
    user_msg = request.message
    return {
        "reply": f"我是酒保。我听到了你说: '{user_msg}'。但我现在还只有鱼的记忆，没接上 Gemini 的大脑。",
        "audio": "这里以后会返回语音文件的地址"
    }

# 这里的代码意味着：
# 当你访问 "/"，它告诉你酒吧开门了。
# 当你发送文字到 "/chat"，它会重复你的话。