/**
 * Window 제어 API 래퍼
 * 핀(Always-on-Top), 최소화, 닫기, 투명도 제어
 */
import { CHANNELS } from '../constants/channels';
import { getAPI } from './base';

export const pinWindow = () => getAPI().invoke(CHANNELS.WINDOW_PIN);
export const unpinWindow = () => getAPI().invoke(CHANNELS.WINDOW_UNPIN);
export const minimizeWindow = () => getAPI().invoke(CHANNELS.WINDOW_MINIMIZE);
export const closeWindow = () => getAPI().invoke(CHANNELS.WINDOW_CLOSE);
export const setOpacity = (val) => getAPI().invoke(CHANNELS.WINDOW_OPACITY, val);
