import { Injectable } from '@angular/core';
import { AbstractEventListenerService } from 'src/app/services/event-listeners/abstract-event-listener.service';

@Injectable()
export class KeyboardListenerService extends AbstractEventListenerService<KeyboardEvent> {
  static getIdentifier(key: string, ctrlKey: boolean = false, shiftKey: boolean = false, type: string = 'keydown'): string {
    let identifier = '';

    identifier += ctrlKey ? 'ctrl_' : '';
    identifier += shiftKey ? 'shift_' : '';
    identifier += key.toLowerCase();
    identifier += `_${type}`;

    return identifier;
  }

  getIdentifierFromEvent(event: KeyboardEvent): string {
    const { ctrlKey, shiftKey, type, key } = event;

    return KeyboardListenerService.getIdentifier(key, ctrlKey, shiftKey, type);
  }
}
