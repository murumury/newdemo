import { createPresence } from '@yomo/presence';

export function connect() {
  const presenceUrl = process.env.NEXT_PUBLIC_PRESENCE_URL;
if (!presenceUrl) {
    throw new Error('The NEXT_PUBLIC_PRESENCE_URL is not defined.');
}
  const id = Math.random().toString().substring(2, 10);
  const avatar = Math.random() > 0.5 ? `https://robohash.org/${id}` : void 0;
  const presencePromise = createPresence(presenceUrl,{
   
    publicKey: process.env.NEXT_PUBLIC_PRESENCE_PUBLIC_KEY,
    id,
  });
  return { id, avatar, presencePromise };
}
