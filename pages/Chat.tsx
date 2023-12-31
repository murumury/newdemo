import React, { useState, useEffect, useRef } from 'react';
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
initialUserAvatar:string;
}
export async function getServerSideProps() {
// 在服务器端生成随机name
const randomName = faker.name.fullName();
const randomAvatar = faker.image.avatar();



// 将初始用户名作为prop传递给组件
return { props: { initialUserName: randomName, initialUserAvatar: randomAvatar} }
}
export default function Chat ({ initialUserName,initialUserAvatar }: ChatProps ){
function isMessage(data: any): data is Message {
return typeof data === 'object' && data !== null && 'id' in data && 'message' in data &&'userName' in data;
}


  const randomName = faker.name.fullName();
  const [userName, setUserName] = useState(initialUserName); 
const [userAvatar, setUserAvatar] = useState(initialUserAvatar);
  const myName = userName
const [messages, setMessages] = useState<Array<{
    id: string,
    message: string,
    userName: string,
    peerId?: string,
    peerMessage?: string
  }>>([]);    
const [newMessage, setNewMessage] = useState('');
const [channel, setChannel] = useState<IChannel | null>(null);
const id = useRef<string>((new Date).valueOf().toString());
const [p, setP] = useState<Promise<IPresence> | null>(null);
 
useEffect(() => {
let isSubscribed = true; // 用于跟踪组件挂载状态


// 创建实时通讯客户端
createPresence('https://prscd2.allegro.earth/v1', {
  publicKey: 'EIHHOvhgKGPWPJfFpjKQMmKcshZtSpa6ezwp2dp',
  id: 'user-client-id',
  debug: true,
  
}).then(async (presence) => {
  console.log('Presence: ', presence);
  setP(Promise.resolve(presence));
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
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-24 px-6 py-2 bg-white border border-white rounded-full shadow-md">
    <span className="text-gray-700">Your name: <strong>{myName}</strong></span>
  </div>     
      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-lg p-4 m-4 w-2/3 md:max-w-2xl">{}
        <div className="overflow-hidden rounded-lg">
          <div className="overflow-y-auto h-80 bg-gray-200 p-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.userName === myName ? 'items-end' : 'items-start'}`}>
                {msg.userName !== myName && (
                  <span className="text-xs text-gray-600">{msg.userName}</span>
                )}
                <div className={`rounded-lg px-4 py-2 my-1 ${msg.userName === myName ? 'bg-green-500 text-white' : 'bg-white text-black dark:text-black shadow'}`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      
        <div > 
        {p && (
    <GroupHug
        presence={p}
        channel="chat-channel"
        id={id.current}
        name={initialUserName}
        avatar={userAvatar}
        overlapping={true}
    />
)}
</div>
        {/* Message Input and Send Button */}
        <div className="mt-4 flex items-center">
          <textarea
            className="flex-1 p-2 resize-none border rounded focus:outline-none focus:ring focus:ring-green-400 bg-white dark:bg-#ffffff-800"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Please enter a message..."
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // 阻止在文本框中插入换行符
                  sendMessage(); 
                }
              }}           
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