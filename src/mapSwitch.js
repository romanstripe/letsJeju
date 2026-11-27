import { createContext } from 'react';

// 지도 켜기/끄기. 끄면 지도 컴포넌트가 카카오 SDK 를 부르지 않는다.
export const MapSwitch = createContext({ on: true, offText: '' });
