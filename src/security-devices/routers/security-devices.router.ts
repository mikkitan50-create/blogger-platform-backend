import { Router } from 'express';
import { SECURITY_DEVICES_ROUTES } from '../constants/security-devices.paths';
import { refreshTokenGuardMiddleware } from '../../auth/middlewares/refresh-token-guard.middleware';
import { container } from '../../composition/composition-root';
import { TYPES } from '../../composition/types';
import { SecurityDevicesController } from '../controllers/security-devices.controller';

const securityDevicesController = container.get<SecurityDevicesController>(TYPES.SecurityDevicesController);

export const securityDevicesRouter = Router({});

securityDevicesRouter.get(
  SECURITY_DEVICES_ROUTES.ROOT,
  refreshTokenGuardMiddleware,
  securityDevicesController.getDevices,
);

securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTES.ROOT,
  refreshTokenGuardMiddleware,
  securityDevicesController.terminateAllExceptCurrent,
);

securityDevicesRouter.delete(
  SECURITY_DEVICES_ROUTES.BY_DEVICE_ID,
  refreshTokenGuardMiddleware,
  securityDevicesController.terminateDevice,
);