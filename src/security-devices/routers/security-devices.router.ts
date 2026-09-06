import { Router } from 'express';
import { SECURITY_DEVICES_ROUTES } from '../constants/security-devices.paths';
import { refreshTokenGuardMiddleware } from '../../auth/middlewares/refresh-token-guard.middleware';
import { getDevicesHandler } from '../handlers/get-devices.handler';
import { terminateAllExceptCurrentHandler } from '../handlers/terminate-all-except-current.handler';
import { terminateDeviceHandler } from '../handlers/terminate-device.handler';

export const securityDevicesRouter = Router({});

securityDevicesRouter.get(
  SECURITY_DEVICES_ROUTES.ROOT,
  refreshTokenGuardMiddleware,
  getDevicesHandler,
);

securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTES.ROOT,
  refreshTokenGuardMiddleware,
  terminateAllExceptCurrentHandler,
);

securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTES.BY_DEVICE_ID,
  refreshTokenGuardMiddleware,
  terminateDeviceHandler,
);