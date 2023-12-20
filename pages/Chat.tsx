import React, { useState, useEffect } from 'react';
import { IPresence,IChannel, createPresence, JsonSerializable } from '@yomo/presence';
import Head from 'next/head';
import styles from '@/styles/Chat.module.css';

interface Message {
    id: string;
    message: string;
  }
export default  function Chat ( ){
    function isMessage(data: any): data is Message {
        return typeof data === 'object' && data !== null && 'id' in data && 'message' in data;
      }


    const [messages, setMessages] = useState<Array<{
        id: string,
        message: string,
        peerId?: string,
        peerMessage?: string
      }>>([]);    const [newMessage, setNewMessage] = useState('');
    const [connected, setConnected] = useState(false);
   // const [channel, setChannel] = useState<IChannel>();
    const [presence, setPresence] = useState<any>();
    const [channel, setChannel] = useState<IChannel | null>(null);
    const [presenceClient, setPresenceClient] =
      useState<Promise<IPresence> | null>(null);

     
// create an instance.
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
          // 假设这是您订阅消息的方法
newChannel.subscribe('message', (data: JsonSerializable) => {
    // 使用类型守卫来检查 data 是否为 Message 类型
    if (isMessage(data)) {
        const payload: Message = data; // 这里不再需要断言
      // 假设 peerState 也是 Message 类型，并且您已经有了 peerState 的值
      const peerState: Message = { id: 'some-id', message: 'some-message' }; // 这应该是您从其他地方获得的实际值
  
      setMessages(prevMsgs => [...prevMsgs, { ...payload, peerId: peerState.id }]);
    } else {
      // 如果 data 不是 Message 类型，您可以决定如何处理这种情况
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
    // 如果有任何错误，记录它
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
      };
      
      if (channel) {
        channel.broadcast('message', messageToSend as unknown as JsonSerializable);
        // 更新自己的页面
setMessages(prevMsgs => [...prevMsgs, messageToSend]);
setNewMessage('');      }
    }
  };


    return(
        <>
        <Head>
        <title>Presence demo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{background: `url('./bg.svg')`}}>
        <div 
       // className={styles.chatbox}
        >
        <div>
            <div //className={styles.chatboxHistory}
            >
          {messages.map((msg, index) => (
            <p key={index}>
              {msg.message}
            </p>
          ))}</div>
          <div         // className={styles.chatboxInput}
>
          <textarea
         // className={styles.chatboxInput}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="输入消息..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            required
          />
          </div>
        </div>
        <button onClick={sendMessage}>发送</button>

      </div>
      </main>
      </>
    )
}