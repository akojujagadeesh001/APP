import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function LiveChat({ bookingId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to Socket
    socketRef.current = io(import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000');
    
    // Join room
    socketRef.current.emit('join_booking', bookingId);
    
    // Listen for incoming
    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
      if (data.sender !== currentUser) {
        toast(`New message from ${data.sender}`, { icon: '💬' });
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [bookingId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msgData = {
        bookingId,
        sender: currentUser,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socketRef.current.emit('send_message', msgData);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F9F9FB] rounded-xl overflow-hidden border border-[#F2F2F7]">
      <div className="bg-white border-b border-[#F2F2F7] p-3 text-center">
        <h4 className="font-semibold text-sm text-gray-900">Live Chat</h4>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto min-h-[250px] max-h-[300px] flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center text-xs text-gray-400 mt-4 italic">Say hello to start the chat...</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex max-w-[85%] ${m.sender === currentUser ? 'self-end bg-[#0071E3] text-white rounded-t-xl rounded-bl-xl' : 'self-start bg-[#E5E5EA] text-gray-900 rounded-t-xl rounded-br-xl'} p-3 shadow-sm`}>
            <div>
              <div className={`text-[10px] font-bold mb-0.5 opacity-70 ${m.sender === currentUser ? 'text-blue-100' : 'text-gray-500'}`}>{m.sender}</div>
              <p className="text-sm font-medium">{m.text}</p>
              <div className={`text-[9px] mt-1 text-right opacity-60 ${m.sender === currentUser ? 'text-blue-100' : 'text-gray-500'}`}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-[#F2F2F7] flex gap-2">
        <input 
          type="text" 
          placeholder="Message..." 
          className="flex-1 apple-input py-2 text-sm"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit" disabled={!message.trim()} className="bg-[#0071E3] text-white p-2.5 rounded-full hover:bg-[#0077ED] disabled:opacity-50 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
