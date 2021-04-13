import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {
    constructor(
        private notificationManager: ToastrService
    ) {
    }

    showSuccessNotification(message: string) {
        this.notificationManager.success(message, 'Success!');
    }

    showErrorNotification(message: string) {
        this.notificationManager.error(message, 'Error!');
    }

    showInfoNotification(message: string) {
        this.notificationManager.info(message, 'Info!');
    }

    showWarningNotification(message: string) {
        this.notificationManager.warning(message, 'Warning!');
    }
}
