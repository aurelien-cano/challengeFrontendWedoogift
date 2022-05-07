import {Component, EventEmitter, Output} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-prompt',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalPromptComponent {
    private _proposedFloor!: number;
    private _proposedCeil!: number;

    @Output() selectedData: EventEmitter<number> = new EventEmitter();

    constructor(public activeModal: NgbActiveModal) {}

    initModale(floorValue: number, ceilValue: number) {
        this.proposedFloor = floorValue;
        this.proposedCeil = ceilValue;
    }

    sendResponseToParent(chosenValue: number) {
        console.log('chosen value: ', chosenValue);
        this.selectedData.emit(chosenValue);
        this.activeModal.close();
    }

    get proposedFloor(): number {
        return this._proposedFloor;
    }

    set proposedFloor(proposedFloor: number) {
        this._proposedFloor = proposedFloor;
    }

    get proposedCeil(): number {
        return this._proposedCeil;
    }

    set proposedCeil(proposedCeil: number) {
        this._proposedCeil = proposedCeil;
    }
}