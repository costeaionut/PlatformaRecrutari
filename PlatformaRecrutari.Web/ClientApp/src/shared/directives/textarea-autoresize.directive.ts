import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnInit,
} from "@angular/core";

@Directive({
  selector: "[appTextareaAutoresize]",
})
export class TextareaAutoresizeDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.resize();
  }

  @HostListener(":click")
  onClick() {
    this.resize();
  }

  @HostListener(":input")
  onInput() {
    this.resize();
  }

  resize() {
    this.elementRef.nativeElement.style.height = "0";
    this.elementRef.nativeElement.style.height =
      this.elementRef.nativeElement.scrollHeight + "px";
  }
}
