/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective {

  @Input('header') header: any;
  private lastY = 0;

  constructor(private renderer: Renderer2, private domCtrl: DomController) { }
  
  ngOnInit(): void {
    this.header = this.header.el;
    this.domCtrl.write(() => {
        this.renderer.setStyle(this.header, 'transition', 'margin-top 700ms');
    });
  } 

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    if ($event.detail.scrollTop > this.lastY) {
        this.domCtrl.write(() => {
            this.renderer.setStyle(this.header, 'margin-top', `-${ this.header.clientHeight }px`);
        });
    } else if($event.detail.currentX === 0 && $event.detail.currentY === 0) {
        this.domCtrl.write(() => {
            this.renderer.setStyle(this.header, 'margin-top', '0');
        });
    }
    this.lastY = $event.detail.scrollTop;
  }

}
