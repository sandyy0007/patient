import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Phone } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const ChatModal = ({ isOpen, onClose, doctorId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const roomId = doctorId ? `${localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user')).id}_${doctorId}`.split('_').sort().join('_') : null;

  useEffect(() => {
    if (!isOpen || !roomId) return;

    setLoading(true);
    // Load messages
    axios.get(`/api/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setMessages(res.data))
    .finally(() => setLoading(false));

    // Socket
    const newSocket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });
    newSocket.emit('joinRoom', roomId);
    setSocket(newSocket);

    newSocket.on('newMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      newSocket.close();
    };
  }, [isOpen, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !roomId || !doctorId) return;

    const messageData = {
      receiverId: doctorId,
      content: newMessage,
      roomId
    };

    try {
      const res = await axios.post('/api/messages', messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      socket.emit('sendMessage', res.data);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-morphism w-full max-w-4xl h-[80vh] max-h-[600px] flex flex-col rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Doctor Chat</h3>
              <p className="text-sm text-gray-500">Secure messaging with your doctor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h4>
              <p className="text-gray-500">Start the conversation</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message._id} className={`flex ${message.sender._id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow ${
                  message.sender._id === localStorage.getItem('userId') 
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white' 
                    : 'bg-white/70 border border-gray-200 backdrop-blur-sm'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 opacity-75 ${
                    message.sender._id === localStorage.getItem('userId') ? 'text-teal-100' : 'text-gray-500'
                  }`}>
                    {format(new Date(message.createdAt), 'hh:mm a')}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 bg-white/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none resize-none text-lg placeholder-gray-500"
              disabled={!roomId}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !roomId}
              className="w-14 h-14 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg hover:shadow-xl p-3 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Send className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${newMessage.trim() ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </div>
          {!roomId && (
            <p className="text-xs text-gray-500 mt-2 text-center">Select a doctor to start messaging</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

