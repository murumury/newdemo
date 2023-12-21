import React, { useState, useEffect } from 'react';
import { IPresence,IChannel, createPresence, JsonSerializable } from '@yomo/presence';
import Head from 'next/head';
import styles from '@/styles/Chat.module.css';
import { faker } from '@faker-js/faker';
import GroupHug from "@yomo/group-hug-react";

interface Message {
id: string;
userName: string;
message: string;
}
interface ChatProps {
initialUserName: string;
}
export async function getServerSideProps() {
// 在服务器端生成随机名字
const randomName = faker.name.fullName();


// 将初始用户名作为prop传递给组件
return { props: { initialUserName: randomName } }
}
export default function Chat ({ initialUserName }: ChatProps ){
function isMessage(data: any): data is Message {
return typeof data === 'object' && data !== null && 'id' in data && 'message' in data &&'userName' in data;
}


  const randomName = faker.name.fullName();
  const [userName, setUserName] = useState(initialUserName); 

  const myName = userName
const [messages, setMessages] = useState<Array<{
    id: string,
    message: string,
    userName: string,
    peerId?: string,
    peerMessage?: string
  }>>([]);    
const [newMessage, setNewMessage] = useState('');
const [connected, setConnected] = useState(false);
const [channel, setChannel] = useState<IChannel | null>(null);

 
useEffect(() => {
let isSubscribed = true; // 用于跟踪组件挂载状态


// 创建实时通讯客户端
createPresence('https://prscd2.allegro.earth/v1', {
  publicKey: 'EIHHOvhgKGPWPJfFpjKQMmKcshZtSpa6ezwp2dp',
  id: 'user-client-id',
  debug: true,
  
}).then(async (presence) => {
  console.log('Presence: ', presence);
  setConnected(true);
  try {
    const newChannel = await presence.joinChannel('chat-channel', { id: 'user-client-id' });
    if (isSubscribed) {
      setChannel(newChannel);

      // 订阅消息
newChannel.subscribe('message', (data: JsonSerializable) => {
// 使用类型守卫来检查 data 是否为 Message 类型
if (isMessage(data)) {
const payload: Message = data;
const peerState: Message = { id: 'some-id', message: 'some-message',userName:'some-userName'};


  setMessages(prevMsgs => [...prevMsgs, { ...payload, peerId: peerState.id }]);
} else {
  // 如果 data 不是 Message 类型
  console.error('Data received is not a valid Message object:', data);
}
});
}
} catch (error) {
console.error('Failed to join channel:', error);
}
});


// 组件卸载时的清理函数
return () => {
  isSubscribed = false;
if (channel) {
try {
// 尝试退出频道
channel.leave();
} catch (error) {
console.error(error);
}
}
};
}, []);

const sendMessage = () => {
if (channel && newMessage.trim() !== '') {
const messageToSend: Message = {
id: 'user-client-id',
message: newMessage.trim(),
userName: myName,
};


  if (channel) {
    channel.broadcast('message', messageToSend as unknown as JsonSerializable);
    // 更新自己的页面
setMessages(prevMsgs => [...prevMsgs, messageToSend]);
setNewMessage(''); }
}
};


return(
    <>
    <Head>
      <title>Chat Demo</title>
      <meta name="description" content="Chat application interface" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-4" style={{ backgroundImage: `url('./bg.svg')` }}>
 
      {/* Displaying User's Name */}
      <span className="absolute top-4 left-5 text-gray-700">Your name: <strong>{myName}</strong></span>
      
      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-lg p-4 m-4 w-full max-w-lg"> {/* Adjusted max width here */}
        <div className="overflow-hidden rounded-lg">
          <div className="overflow-y-auto h-80 bg-gray-200 p-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.userName === myName ? 'items-end' : 'items-start'}`}>
                {msg.userName !== myName && (
                  <span className="text-xs text-gray-600">{msg.userName}</span>
                )}
                <div className={`rounded-lg px-4 py-2 my-1 ${msg.userName === myName ? 'bg-green-500 text-white' : 'bg-white shadow'}`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Message Input and Send Button */}
        <div className="mt-4 flex items-center">
          <textarea
            className="flex-1 p-2 resize-none border rounded focus:outline-none focus:ring focus:ring-green-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Please enter a message..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            required
          />
          <button 
            className="ml-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  </>
)
}