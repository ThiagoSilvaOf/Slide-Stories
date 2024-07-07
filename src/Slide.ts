export default class Slide {
  public container;
  public slides;
  public controls;
  public time;
  public index;
  public slide;

  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    time: number = 5000,
  ) {
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time; 
  
    this.index = 0;
    this.slide = this.slides[this.index]

    this.show(this.index)
  }

  hide(el:Element){
    el.classList.remove("active");
  }

  show(index:number){
    this.index = index;
    this.slide = this.slides[this.index]
    this.slides.forEach(slide => this.hide(slide));
    this.slide.classList.add("active")
  }
}
