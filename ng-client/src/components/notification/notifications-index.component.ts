import { Component, OnInit, EventEmitter } from '@angular/core';
import { NotificationsSignalRService } from 'src/core/services/signal-r';
import { CommonStateService } from 'src/core/services';
import { NotificationModel } from 'src/models';

@Component({
    templateUrl: './notifications-index.component.html'
})
export class NotificationsIndexComponent {
    notifications: NotificationModel[];
    contract: string;
    contractFilter = false;

    constructor(
        private state: CommonStateService,
        private notificationsSignalR: NotificationsSignalRService
    ) {
        this.state.changeRoute('notifications');
        
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this.notificationsSignalR.allNotificationsReceive.subscribe((x: NotificationModel[]) => {
            if (!this.contractFilter) this.notifications = x;
        });

        this.notificationsSignalR.contractNotificationUpdate.subscribe((x: NotificationModel[]) => {
            if (this.contractFilter) this.notifications = x;
        });
    }

    subscribeToContract(hash: string) {
        this.contract = hash;
        this.notificationsSignalR.invokeOnServerEvent('TrackContract', hash);
        this.contractFilter = true;
    }

    unsubscribeToContract() {
        this.notificationsSignalR.invokeOnServerEvent('Unsubscribe', this.contract);
        this.contractFilter = false;
        this.contract = null;
    }
}
