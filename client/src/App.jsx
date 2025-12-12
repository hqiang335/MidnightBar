// src/App.jsx - 这一次，我们加上了交互功能
import React, { useState } from 'react';
import './App.css';
import ParticleSphere from './components/ParticleSphere';
import axios from 'axios'; // 引入通信工具

function App() {
  // 定义三个“状态”变量
  const [inputText, setInputText] = useState(""); // 1. 记录你输入了什么
  const [chatHistory, setChatHistory] = useState([]); // 2. 记录聊天记录
  const [isLoading, setIsLoading] = useState(false); // 3. 记录酒保是不是正在思考

  // --- 核心功能：发送消息给后端 ---
  const handleSend = async () => {
    if (!inputText.trim()) return; // 如果是空的就不发

    // 1. 先把你说的显示在屏幕上
    const newHistory = [...chatHistory, { role: 'user', content: inputText }];
    setChatHistory(newHistory);
    setIsLoading(true); // 开始转圈圈

    try {
      // 2. 向后端发请求 (这就是“握手”的那一刻！)
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: inputText
      });

      // 3. 收到后端的回复 (response.data.reply)
      setChatHistory([...newHistory, { role: 'bartender', content: response.data.reply }]);
      
    } catch (error) {
      console.error("出错了:", error);
      setChatHistory([...newHistory, { role: 'bartender', content: "（酒保似乎没听清...请检查后端是否开启）" }]);
    } finally {
      setIsLoading(false); // 结束转圈圈
      setInputText(""); // 清空输入框
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      background: 'radial-gradient(circle at center, #111118 0%, #000000 100%)',
      color: 'white',
      fontFamily: '"Songti SC", serif' 
    }}>
      
      {/* 标题区域 */}
      <div style={{ position: 'absolute', top: '20px', textAlign: 'center', zIndex: 10 }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '3px', textShadow: '0 0 10px #5e88fc' }}>The Midnight Bar</h1>
      </div>

      {/* 3D 粒子球 (作为背景氛围) */}
      <div style={{ position: 'absolute', top: '0', width: '100%', height: '100%', zIndex: 0, opacity: 0.6 }}>
        <ParticleSphere />
      </div>

      {/* 聊天记录显示区 */}
      <div style={{ 
        marginTop: '100px', 
        width: '80%', 
        maxWidth: '600px', 
        height: '60vh', 
        overflowY: 'auto', 
        zIndex: 10,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {chatHistory.map((msg, index) => (
          <div key={index} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'rgba(94, 136, 252, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            padding: '10px 15px',
            borderRadius: '10px',
            maxWidth: '80%'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginBottom: '5px', opacity: 0.7 }}>
              {msg.role === 'user' ? 'ME' : 'BARTENDER'}
            </span>
            {msg.content}
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div style={{ 
        position: 'absolute', 
        bottom: '40px', 
        width: '80%', 
        maxWidth: '600px', 
        zIndex: 10,
        display: 'flex',
        gap: '10px'
      }}>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="对酒保说点什么..."
          style={{
            flex: 1,
            padding: '15px',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          style={{
            padding: '15px 30px',
            borderRadius: '30px',
            border: 'none',
            background: isLoading ? '#333' : '#5e88fc',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? "..." : "发送"}
        </button>
      </div>

    </div>
  );
}

export default App;