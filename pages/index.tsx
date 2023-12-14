import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import CursorChat from '@yomo/cursor-chat-react';
import { useEffect, useState } from 'react';
import { connect } from '@/utils/presence';
import { IPresence,IChannel } from '@yomo/presence';
import "@yomo/cursor-chat-react/dist/style.css"
import { createPresence } from '@yomo/presence';
import GroupHug from '@yomo/group-hug-react';
import { faker } from '@faker-js/faker';
import '@yomo/group-hug-react/dist/style.css';
import Dialog from './components/Dialog';
import ChatBox from './components/ChatBox';

export default function Home() {
  const [channel, setChannel] = useState<IChannel>();
  const [isDialogOpen, setDialogOpen] = useState(true);

  const closeDialog = () => setDialogOpen(false);
  const [presenceClient, setPresenceClient] =
    useState<Promise<IPresence> | null>(null);
  const [id, setId] = useState<string>('');
  useEffect(() => {
    (async () => {
      const { presencePromise, id } = connect();
      setPresenceClient(presencePromise);
      setId(id);
    })();
    return () => {
      setPresenceClient(null);
    };
    
  }, []);

  const [presence, setPresence] = useState<any>();
  const avatar = `https://robohash.org/${id}`;
  const randomName = faker.name.fullName();
  const colors = [
    '#FF38D1',
    '#8263FF',
    '#0095FF',
    '#00B874',
    '#FF3168',
    '#FFAB03',
  ];
  
  function getRandomColor() {
    const idx = Math.floor(Math.random() * colors.length);
    const color = colors[idx];
    return color;
  }  
  const color =getRandomColor() ;
  
  useEffect(() => {
    const presence = createPresence({
      url: 'https://prscd2.allegro.earth/v1',
      publicKey: 'EIHHOvhgKGPWPJfFpjKQMmKcshZtSpa6ezwp2dp',
      id,
      appId: 'demogrouphug',
    });
    setPresence(presence);
    setChannel(channel);
  }, [id]);
  useEffect(() => {
    const handleUnload = () => {
      channel?.leave();
    };
    
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      channel?.leave();
    };
  }, [channel]);
  return (
    <>
      <Head>
        <title>Presence demo</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{background: `url('./bg.svg')`}}>
    
      
      {/* <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
      </Dialog> */}
      <div className='text-black'>
      { <ChatBox channel={channel} userId={randomName} />}
</div>

        {presence && (
          <CursorChat
            presence={presence}
            id={id}
            avatar={avatar}
            name={randomName}
            color={color}
          />
        )}
        {presence ? (<div style={{
    position:'absolute',
    top:'40px',
    right:'40px'}}>
        <GroupHug
          presence={presence}
          id={id}
          avatar={avatar}
          name={randomName}
          avatarBorderColor={color}
        /></div>
      ) : null}
      <div 
    style={{
      position: 'fixed',
  top:'22px',
  left:'24px',
  color:'#25252500',
  display: 'inline-block',
fontSize: '14px',
backgroundColor:'#ffffff00',
borderRadius:'20px'}}>
    <div style={{marginRight:'0px',marginLeft:'0px'}}>
        <div>
        <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.3489 1.13008C24.9189 1.37008 25.2889 1.93008 25.2889 2.56008H25.2989V11.8401V17.4401C25.2989 18.3001 24.5989 19.0001 23.7389 19.0001H13.0389H1.4789C0.868897 19.0001 0.328897 18.6401 0.108897 18.0801C-0.111103 17.5101 0.018897 16.8801 0.458897 16.4601L12.0089 5.37008C12.4389 4.96008 13.0689 4.85008 13.6089 5.08008C14.1589 5.31008 14.5089 5.85008 14.5089 6.44008V9.24008L22.6589 1.43008C23.1089 1.00008 23.7689 0.88008 24.3489 1.13008ZM12.0389 16.5301V8.78008L3.9589 16.5301H6.9389C6.9889 16.4601 7.0489 16.3901 7.1189 16.3201L9.7189 13.8301C10.2189 13.3601 10.9989 13.3801 11.4689 13.8701C11.9389 14.3601 11.9189 15.1501 11.4289 15.6201L10.4789 16.5301H12.0389ZM14.5089 16.5301H22.8189V11.8401V4.70008L14.5089 12.6701V16.5301ZM113.309 4.42969C109.619 4.42969 106.619 7.42969 106.619 11.1297C106.619 14.8197 109.619 17.8297 113.309 17.8297C116.999 17.8297 119.999 14.8297 119.999 11.1297C119.999 7.43969 116.999 4.42969 113.309 4.42969ZM113.309 14.3597C111.529 14.3597 110.079 12.9097 110.079 11.1297C110.079 9.34969 111.529 7.89969 113.309 7.89969C115.089 7.89969 116.539 9.34969 116.539 11.1297C116.539 12.9097 115.089 14.3597 113.309 14.3597ZM49.3184 4.48047H53.0584V14.3205H57.8884V17.5405H49.3184V4.48047ZM59.5391 4.48047H63.2791V14.3205H68.1091V17.5405H59.5391V4.48047ZM73.5095 12.4805H77.8795V9.37047H73.5095V7.72047H78.2795V4.48047H69.7695V17.5405H78.3895V14.3205H73.5095V12.4805ZM100.429 4.49023C103.749 4.49023 105.479 5.75023 105.479 8.85023C105.479 10.9502 104.789 12.1802 103.209 12.7602L106.709 17.5402H102.289L99.5989 13.1602H98.8689V17.5402H95.1289V4.49023H100.429ZM98.8689 10.4802H99.7689C101.289 10.4802 101.799 10.0702 101.799 8.84023C101.799 7.64023 101.289 7.34023 99.7689 7.34023H98.8689V10.4802ZM89.1582 13.1004H86.5982V10.5804H93.2882V11.1404C93.2882 11.8304 93.1782 12.4904 92.9882 13.1104C92.1482 15.8504 89.5982 17.8404 86.5982 17.8404C82.9082 17.8404 79.9082 14.8304 79.9082 11.1404C79.9082 7.45043 82.9082 4.44043 86.5982 4.44043C87.9682 4.44043 89.2882 4.85043 90.4182 5.64043L88.4382 8.48043C87.8982 8.10043 87.2582 7.90043 86.5982 7.90043C84.8182 7.90043 83.3682 9.35043 83.3682 11.1304C83.3682 12.9104 84.8182 14.3604 86.5982 14.3604C87.6382 14.3604 88.5682 13.8704 89.1582 13.1004ZM39.028 4.44043L32.918 17.5404H36.618L37.468 15.7004H43.238L44.098 17.5404H47.798L41.638 4.44043H39.028ZM38.918 12.5704L40.368 9.47043L41.798 12.5704H38.918Z" fill="black"/>
</svg>


        </div>
      </div>      </div>
      <div style={{position:"absolute",bottom:"24px",display:'grid',alignItems:'center',justifyItems:'center'}}>
      <svg width="254" height="76" viewBox="0 0 254 76" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_0_129)">
<rect x="24" y="16" width="84" height="36" rx="6" fill="white" shape-rendering="crispEdges"/>
<path d="M41.1327 39.14C40.5914 39.14 40.0874 39.0653 39.6207 38.916C39.1541 38.7573 38.7434 38.5007 38.3887 38.146C38.0434 37.7913 37.7681 37.3247 37.5627 36.746C37.3667 36.158 37.2687 35.43 37.2687 34.562V33.82C37.2687 32.9707 37.3714 32.2567 37.5767 31.678C37.7821 31.09 38.0621 30.6187 38.4167 30.264C38.7714 29.9093 39.1774 29.6527 39.6347 29.494C40.1014 29.3353 40.6007 29.256 41.1327 29.256H41.3147C41.8001 29.256 42.2621 29.3213 42.7007 29.452C43.1487 29.5827 43.5407 29.7973 43.8767 30.096C44.2127 30.3947 44.4787 30.7867 44.6747 31.272C44.8801 31.7573 44.9827 32.3547 44.9827 33.064H43.5687C43.5687 32.364 43.4614 31.8273 43.2467 31.454C43.0414 31.0713 42.7614 30.8053 42.4067 30.656C42.0521 30.5067 41.6507 30.432 41.2027 30.432C40.8574 30.432 40.5401 30.4833 40.2507 30.586C39.9614 30.6793 39.7094 30.8427 39.4947 31.076C39.2801 31.3093 39.1121 31.6267 38.9907 32.028C38.8787 32.42 38.8227 32.9147 38.8227 33.512V34.884C38.8227 35.6773 38.9207 36.298 39.1167 36.746C39.3221 37.194 39.6021 37.5113 39.9567 37.698C40.3114 37.8753 40.7221 37.964 41.1887 37.964C41.6554 37.964 42.0707 37.8893 42.4347 37.74C42.7987 37.5907 43.0834 37.3293 43.2887 36.956C43.5034 36.5733 43.6107 36.0367 43.6107 35.346H44.9827C44.9827 36.018 44.8847 36.5967 44.6887 37.082C44.4927 37.5673 44.2221 37.9593 43.8767 38.258C43.5407 38.5567 43.1487 38.7807 42.7007 38.93C42.2621 39.07 41.7954 39.14 41.3007 39.14H41.1327ZM46.8716 39V28.92H48.2716V32.798C48.5236 32.434 48.8456 32.1633 49.2376 31.986C49.639 31.7993 50.0496 31.706 50.4696 31.706C50.955 31.706 51.3843 31.7993 51.7576 31.986C52.131 32.1727 52.425 32.4527 52.6396 32.826C52.8636 33.19 52.9756 33.6473 52.9756 34.198V39H51.5756V34.436C51.5756 33.848 51.4356 33.428 51.1556 33.176C50.885 32.9147 50.5023 32.784 50.0076 32.784C49.6903 32.784 49.3963 32.8633 49.1256 33.022C48.8643 33.1807 48.6543 33.3953 48.4956 33.666C48.3463 33.9273 48.2716 34.2307 48.2716 34.576V39H46.8716ZM57.0455 39.14C56.6628 39.14 56.2941 39.0793 55.9395 38.958C55.5941 38.8367 55.3095 38.6313 55.0855 38.342C54.8708 38.0433 54.7635 37.642 54.7635 37.138C54.7635 36.6247 54.8755 36.214 55.0995 35.906C55.3328 35.5887 55.6595 35.346 56.0795 35.178C56.5088 35.01 57.0175 34.898 57.6055 34.842C58.2028 34.786 58.8561 34.758 59.5655 34.758V34.03C59.5655 33.526 59.4395 33.176 59.1875 32.98C58.9448 32.7747 58.5575 32.672 58.0255 32.672C57.5775 32.672 57.1901 32.77 56.8635 32.966C56.5368 33.1527 56.3735 33.4513 56.3735 33.862V34.03H55.0155C55.0061 33.9833 55.0015 33.9367 55.0015 33.89C55.0015 33.834 55.0015 33.778 55.0015 33.722C55.0015 33.3113 55.1275 32.9567 55.3795 32.658C55.6408 32.35 55.9908 32.1167 56.4295 31.958C56.8775 31.79 57.3861 31.706 57.9555 31.706H58.1515C59.0941 31.706 59.7941 31.8927 60.2515 32.266C60.7181 32.6393 60.9515 33.176 60.9515 33.876V37.67C60.9515 37.838 60.9888 37.9593 61.0635 38.034C61.1381 38.1087 61.2268 38.146 61.3295 38.146C61.4321 38.146 61.5395 38.1273 61.6515 38.09C61.7728 38.0527 61.8801 38.006 61.9735 37.95V38.846C61.8521 38.9393 61.7028 39.0093 61.5255 39.056C61.3481 39.112 61.1381 39.14 60.8955 39.14C60.5968 39.14 60.3541 39.084 60.1675 38.972C59.9901 38.8507 59.8595 38.692 59.7755 38.496C59.6915 38.3 59.6401 38.0807 59.6215 37.838C59.3508 38.258 58.9961 38.58 58.5575 38.804C58.1281 39.028 57.6241 39.14 57.0455 39.14ZM57.6055 38.146C57.9321 38.146 58.2448 38.076 58.5435 37.936C58.8421 37.7867 59.0848 37.5627 59.2715 37.264C59.4675 36.9653 59.5655 36.592 59.5655 36.144V35.612C58.8655 35.612 58.2635 35.6493 57.7595 35.724C57.2555 35.7893 56.8681 35.92 56.5975 36.116C56.3361 36.312 56.2055 36.6153 56.2055 37.026C56.2055 37.418 56.3221 37.7027 56.5555 37.88C56.7888 38.0573 57.1388 38.146 57.6055 38.146ZM65.6236 39.14C65.2783 39.14 64.9656 39.084 64.6856 38.972C64.415 38.86 64.2003 38.6827 64.0416 38.44C63.8923 38.188 63.8176 37.8567 63.8176 37.446V32.938H63.0336V31.846H63.8596L64.3496 29.564H65.2176V31.846H66.8836V32.938H65.2176V37.194C65.2176 37.6047 65.3016 37.866 65.4696 37.978C65.6376 38.09 65.8196 38.146 66.0156 38.146C66.1183 38.146 66.2583 38.1227 66.4356 38.076C66.6223 38.0293 66.7716 37.9827 66.8836 37.936V38.874C66.781 38.93 66.655 38.9767 66.5056 39.014C66.3656 39.0607 66.2163 39.0933 66.0576 39.112C65.9083 39.1307 65.7636 39.14 65.6236 39.14Z" fill="black"/>
<path d="M87.75 28H88.75L84.25 40H83.25L87.75 28Z" fill="#666666"/>
<rect x="76.5" y="24.5" width="19" height="19" rx="5.5" stroke="#D4D5D7"/>
</g>
<g filter="url(#filter1_d_0_129)">
<rect x="116" y="16" width="114" height="36" rx="6" fill="white" shape-rendering="crispEdges"/>
<path d="M129.657 39V29.396H136.013L135.831 30.572H131.141V33.512H135.383V34.688H131.141V37.824H135.915L136.111 39H129.657ZM140.238 39.14C139.744 39.14 139.314 39.0793 138.95 38.958C138.586 38.8367 138.283 38.678 138.04 38.482C137.798 38.2767 137.616 38.0527 137.494 37.81C137.373 37.558 137.312 37.3107 137.312 37.068C137.312 37.012 137.312 36.9653 137.312 36.928C137.312 36.8813 137.317 36.8253 137.326 36.76H138.558C138.549 36.788 138.544 36.816 138.544 36.844C138.544 36.8627 138.544 36.886 138.544 36.914C138.544 37.1847 138.628 37.4133 138.796 37.6C138.974 37.7773 139.207 37.9127 139.496 38.006C139.795 38.0993 140.131 38.146 140.504 38.146C140.822 38.146 141.111 38.104 141.372 38.02C141.643 37.936 141.853 37.8147 142.002 37.656C142.161 37.488 142.24 37.292 142.24 37.068C142.24 36.8067 142.156 36.606 141.988 36.466C141.82 36.3167 141.596 36.2047 141.316 36.13C141.036 36.046 140.728 35.976 140.392 35.92C140.066 35.8547 139.73 35.7847 139.384 35.71C139.048 35.626 138.74 35.514 138.46 35.374C138.18 35.234 137.956 35.0427 137.788 34.8C137.62 34.548 137.536 34.2167 137.536 33.806C137.536 33.4887 137.606 33.1993 137.746 32.938C137.886 32.6767 138.087 32.4573 138.348 32.28C138.61 32.0933 138.918 31.9533 139.272 31.86C139.636 31.7573 140.033 31.706 140.462 31.706H140.644C141.055 31.706 141.428 31.762 141.764 31.874C142.1 31.9767 142.39 32.1213 142.632 32.308C142.875 32.4853 143.057 32.6907 143.178 32.924C143.309 33.148 143.374 33.386 143.374 33.638C143.374 33.6847 143.37 33.736 143.36 33.792C143.36 33.8387 143.36 33.8713 143.36 33.89H142.128V33.736C142.128 33.6427 142.105 33.54 142.058 33.428C142.021 33.3067 141.937 33.1947 141.806 33.092C141.685 32.98 141.512 32.8867 141.288 32.812C141.074 32.7373 140.794 32.7 140.448 32.7C140.122 32.7 139.851 32.7327 139.636 32.798C139.422 32.8633 139.254 32.9473 139.132 33.05C139.02 33.1527 138.941 33.26 138.894 33.372C138.848 33.484 138.824 33.5867 138.824 33.68C138.824 33.904 138.908 34.086 139.076 34.226C139.244 34.3567 139.468 34.4593 139.748 34.534C140.028 34.6087 140.336 34.674 140.672 34.73C141.018 34.786 141.358 34.856 141.694 34.94C142.03 35.0147 142.338 35.1267 142.618 35.276C142.898 35.416 143.122 35.612 143.29 35.864C143.458 36.116 143.542 36.4427 143.542 36.844C143.542 37.264 143.463 37.6233 143.304 37.922C143.146 38.2113 142.926 38.4447 142.646 38.622C142.366 38.7993 142.044 38.93 141.68 39.014C141.316 39.098 140.929 39.14 140.518 39.14H140.238ZM148.134 39.14C147.537 39.14 147.005 38.9953 146.538 38.706C146.072 38.4073 145.703 37.992 145.432 37.46C145.171 36.928 145.04 36.3027 145.04 35.584V35.248C145.04 34.7067 145.12 34.2213 145.278 33.792C145.446 33.3533 145.67 32.98 145.95 32.672C146.24 32.3547 146.576 32.1167 146.958 31.958C147.35 31.79 147.77 31.706 148.218 31.706H148.372C148.96 31.706 149.474 31.8273 149.912 32.07C150.351 32.3033 150.692 32.6393 150.934 33.078C151.186 33.5073 151.312 34.03 151.312 34.646H150.066C150.066 34.2073 149.992 33.8433 149.842 33.554C149.693 33.2647 149.488 33.05 149.226 32.91C148.965 32.77 148.671 32.7 148.344 32.7C147.812 32.7 147.369 32.882 147.014 33.246C146.669 33.61 146.496 34.1607 146.496 34.898V35.92C146.496 36.6573 146.669 37.2127 147.014 37.586C147.36 37.9593 147.808 38.146 148.358 38.146C148.704 38.146 149.007 38.0807 149.268 37.95C149.53 37.81 149.735 37.6 149.884 37.32C150.034 37.0307 150.108 36.6573 150.108 36.2H151.312C151.312 36.8253 151.177 37.3573 150.906 37.796C150.645 38.2347 150.286 38.5707 149.828 38.804C149.38 39.028 148.872 39.14 148.302 39.14H148.134ZM154.948 39.14C154.565 39.14 154.196 39.0793 153.842 38.958C153.496 38.8367 153.212 38.6313 152.988 38.342C152.773 38.0433 152.666 37.642 152.666 37.138C152.666 36.6247 152.778 36.214 153.002 35.906C153.235 35.5887 153.562 35.346 153.982 35.178C154.411 35.01 154.92 34.898 155.508 34.842C156.105 34.786 156.758 34.758 157.468 34.758V34.03C157.468 33.526 157.342 33.176 157.09 32.98C156.847 32.7747 156.46 32.672 155.928 32.672C155.48 32.672 155.092 32.77 154.766 32.966C154.439 33.1527 154.276 33.4513 154.276 33.862V34.03H152.918C152.908 33.9833 152.904 33.9367 152.904 33.89C152.904 33.834 152.904 33.778 152.904 33.722C152.904 33.3113 153.03 32.9567 153.282 32.658C153.543 32.35 153.893 32.1167 154.332 31.958C154.78 31.79 155.288 31.706 155.858 31.706H156.054C156.996 31.706 157.696 31.8927 158.154 32.266C158.62 32.6393 158.854 33.176 158.854 33.876V37.67C158.854 37.838 158.891 37.9593 158.966 38.034C159.04 38.1087 159.129 38.146 159.232 38.146C159.334 38.146 159.442 38.1273 159.554 38.09C159.675 38.0527 159.782 38.006 159.876 37.95V38.846C159.754 38.9393 159.605 39.0093 159.428 39.056C159.25 39.112 159.04 39.14 158.798 39.14C158.499 39.14 158.256 39.084 158.07 38.972C157.892 38.8507 157.762 38.692 157.678 38.496C157.594 38.3 157.542 38.0807 157.524 37.838C157.253 38.258 156.898 38.58 156.46 38.804C156.03 39.028 155.526 39.14 154.948 39.14ZM155.508 38.146C155.834 38.146 156.147 38.076 156.446 37.936C156.744 37.7867 156.987 37.5627 157.174 37.264C157.37 36.9653 157.468 36.592 157.468 36.144V35.612C156.768 35.612 156.166 35.6493 155.662 35.724C155.158 35.7893 154.77 35.92 154.5 36.116C154.238 36.312 154.108 36.6153 154.108 37.026C154.108 37.418 154.224 37.7027 154.458 37.88C154.691 38.0573 155.041 38.146 155.508 38.146ZM161.467 41.534V31.846H162.517L162.713 32.84C162.946 32.4853 163.25 32.21 163.623 32.014C163.996 31.8087 164.43 31.706 164.925 31.706C165.466 31.706 165.952 31.8273 166.381 32.07C166.82 32.3033 167.17 32.686 167.431 33.218C167.692 33.75 167.823 34.45 167.823 35.318V35.584C167.823 36.3493 167.692 36.998 167.431 37.53C167.179 38.062 166.838 38.4633 166.409 38.734C165.989 39.0047 165.522 39.14 165.009 39.14C164.505 39.14 164.071 39.042 163.707 38.846C163.352 38.65 163.072 38.398 162.867 38.09V41.534H161.467ZM164.631 38.132C164.958 38.132 165.252 38.048 165.513 37.88C165.774 37.712 165.98 37.46 166.129 37.124C166.278 36.788 166.353 36.3727 166.353 35.878V35.094C166.353 34.5153 166.278 34.0533 166.129 33.708C165.98 33.3533 165.774 33.0967 165.513 32.938C165.252 32.7793 164.958 32.7 164.631 32.7C164.314 32.7 164.02 32.7793 163.749 32.938C163.478 33.0873 163.259 33.3347 163.091 33.68C162.932 34.0253 162.853 34.492 162.853 35.08V35.878C162.853 36.382 162.932 36.802 163.091 37.138C163.25 37.474 163.464 37.726 163.735 37.894C164.006 38.0527 164.304 38.132 164.631 38.132ZM172.609 39.14C171.974 39.14 171.414 39.0047 170.929 38.734C170.453 38.454 170.08 38.048 169.809 37.516C169.538 36.9747 169.403 36.326 169.403 35.57V35.276C169.403 34.5107 169.543 33.862 169.823 33.33C170.112 32.798 170.504 32.3967 170.999 32.126C171.494 31.846 172.058 31.706 172.693 31.706H172.847C173.426 31.706 173.939 31.8273 174.387 32.07C174.835 32.3127 175.18 32.658 175.423 33.106C175.675 33.554 175.801 34.086 175.801 34.702V35.598H170.859C170.859 36.13 170.929 36.5873 171.069 36.97C171.218 37.3527 171.428 37.6467 171.699 37.852C171.979 38.048 172.32 38.146 172.721 38.146C173.057 38.146 173.356 38.0807 173.617 37.95C173.878 37.8193 174.088 37.6187 174.247 37.348C174.406 37.0773 174.485 36.7413 174.485 36.34H175.801C175.801 36.9093 175.666 37.404 175.395 37.824C175.124 38.244 174.756 38.5707 174.289 38.804C173.832 39.028 173.314 39.14 172.735 39.14H172.609ZM170.873 34.758H174.429C174.429 34.058 174.275 33.54 173.967 33.204C173.668 32.868 173.248 32.7 172.707 32.7C172.212 32.7 171.788 32.8727 171.433 33.218C171.088 33.5633 170.901 34.0767 170.873 34.758Z" fill="black"/>
<path d="M192.55 38V29.768H197.878L197.734 30.632H193.618V33.368H197.326V34.232H193.618V37.136H197.818L197.974 38H192.55ZM201.584 38.12C201.144 38.12 200.768 38.068 200.456 37.964C200.144 37.852 199.888 37.708 199.688 37.532C199.488 37.356 199.34 37.168 199.244 36.968C199.156 36.76 199.112 36.56 199.112 36.368C199.112 36.312 199.112 36.268 199.112 36.236C199.112 36.204 199.116 36.156 199.124 36.092H200.024C200.016 36.116 200.012 36.14 200.012 36.164C200.012 36.188 200.012 36.212 200.012 36.236C200.012 36.484 200.088 36.692 200.24 36.86C200.392 37.028 200.6 37.156 200.864 37.244C201.136 37.324 201.444 37.364 201.788 37.364C202.1 37.364 202.372 37.324 202.604 37.244C202.844 37.156 203.032 37.036 203.168 36.884C203.304 36.732 203.372 36.552 203.372 36.344C203.372 36.104 203.296 35.92 203.144 35.792C203 35.656 202.808 35.552 202.568 35.48C202.328 35.4 202.06 35.336 201.764 35.288C201.476 35.232 201.184 35.172 200.888 35.108C200.6 35.036 200.336 34.944 200.096 34.832C199.856 34.712 199.66 34.548 199.508 34.34C199.364 34.132 199.292 33.856 199.292 33.512C199.292 33.248 199.348 33.008 199.46 32.792C199.572 32.576 199.732 32.392 199.94 32.24C200.156 32.08 200.416 31.96 200.72 31.88C201.024 31.792 201.368 31.748 201.752 31.748H201.872C202.24 31.748 202.568 31.796 202.856 31.892C203.144 31.988 203.384 32.116 203.576 32.276C203.768 32.436 203.916 32.616 204.02 32.816C204.124 33.008 204.176 33.204 204.176 33.404C204.176 33.436 204.172 33.476 204.164 33.524C204.164 33.564 204.164 33.588 204.164 33.596H203.252V33.464C203.252 33.384 203.232 33.292 203.192 33.188C203.16 33.084 203.092 32.98 202.988 32.876C202.884 32.764 202.728 32.672 202.52 32.6C202.32 32.528 202.052 32.492 201.716 32.492C201.396 32.492 201.136 32.528 200.936 32.6C200.744 32.664 200.596 32.748 200.492 32.852C200.388 32.948 200.316 33.048 200.276 33.152C200.244 33.256 200.228 33.348 200.228 33.428C200.228 33.636 200.3 33.8 200.444 33.92C200.596 34.04 200.792 34.136 201.032 34.208C201.28 34.28 201.548 34.344 201.836 34.4C202.132 34.448 202.424 34.508 202.712 34.58C203 34.644 203.264 34.74 203.504 34.868C203.752 34.988 203.948 35.152 204.092 35.36C204.244 35.568 204.32 35.84 204.32 36.176C204.32 36.536 204.252 36.84 204.116 37.088C203.988 37.336 203.804 37.536 203.564 37.688C203.332 37.832 203.06 37.94 202.748 38.012C202.444 38.084 202.116 38.12 201.764 38.12H201.584ZM208.317 38.12C207.813 38.12 207.365 37.996 206.973 37.748C206.581 37.5 206.273 37.148 206.049 36.692C205.825 36.228 205.713 35.684 205.713 35.06V34.808C205.713 34.328 205.781 33.904 205.917 33.536C206.053 33.16 206.241 32.84 206.481 32.576C206.721 32.304 207.001 32.1 207.321 31.964C207.649 31.82 208.001 31.748 208.377 31.748H208.485C208.965 31.748 209.389 31.848 209.757 32.048C210.133 32.248 210.425 32.536 210.633 32.912C210.849 33.28 210.957 33.728 210.957 34.256H210.033C210.033 33.856 209.961 33.528 209.817 33.272C209.681 33.008 209.493 32.812 209.253 32.684C209.021 32.556 208.753 32.492 208.449 32.492C207.969 32.492 207.565 32.664 207.237 33.008C206.917 33.352 206.757 33.876 206.757 34.58V35.264C206.757 35.968 206.917 36.496 207.237 36.848C207.557 37.192 207.965 37.364 208.461 37.364C208.773 37.364 209.049 37.304 209.289 37.184C209.529 37.064 209.717 36.876 209.853 36.62C209.997 36.356 210.069 36.02 210.069 35.612H210.957C210.957 36.14 210.845 36.592 210.621 36.968C210.397 37.344 210.093 37.632 209.709 37.832C209.333 38.024 208.905 38.12 208.425 38.12H208.317Z" fill="#666666"/>
<rect x="185.5" y="24.5" width="32" height="19" rx="5.5" stroke="#D4D5D7"/>
</g>
<defs>
<filter id="filter0_d_0_129" x="0" y="0" width="132" height="84" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feGaussianBlur stdDeviation="12"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_129"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_129" result="shape"/>
</filter>
<filter id="filter1_d_0_129" x="92" y="0" width="162" height="84" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feGaussianBlur stdDeviation="12"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_129"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_129" result="shape"/>
</filter>
</defs>
</svg>


      </div>

      </main>
    </>
  );
}

