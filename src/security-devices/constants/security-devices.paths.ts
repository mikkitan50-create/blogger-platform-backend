import { API_PREFIX } from '../../core/constants/api.paths';

export const SECURITY_DEVICES_PATH = `${API_PREFIX}/security/devices`;

export const SECURITY_DEVICES_ROUTES = {
  ROOT: '',
  BY_DEVICE_ID: '/:deviceId',
} as const;