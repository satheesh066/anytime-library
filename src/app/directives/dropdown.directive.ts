import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[appDropdown]'
})
export class DropDownDirective {
    @HostBinding('class.open') isOpen = false;
    
    constructor(private _el: ElementRef) { 
    }

    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
        if(this.isOpen) {
            this._el.nativeElement.querySelector('.dropdown-menu').classList.add('show');
        } else {
            this._el.nativeElement.querySelector('.dropdown-menu').classList.remove('show');
        }
    }

    @HostListener('document:click', ['$event.target']) close (targetElement: any) {
        let inside: boolean = this._el.nativeElement.contains(targetElement);
        if(!inside) {
            this.isOpen = false;
            this._el.nativeElement.querySelector('.dropdown-menu').classList.remove('show');
        }
    }
}
