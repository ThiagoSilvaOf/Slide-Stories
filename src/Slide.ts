import Timeout from "./Timeout.js";

export default class Slide {
  public container;
  public slides;
  public controls;
  public time;
  public index;
  public slide;
  public timeout:Timeout | null;

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
  
    this.timeout = null;
    this.index = 0;
    this.slide = this.slides[this.index]

    this.init();

  }

  hide(el:Element){
    el.classList.remove("active");
  }

  show(index:number){
    this.index = index;
    this.slide = this.slides[this.index]
    this.slides.forEach(slide => this.hide(slide));
    this.slide.classList.add("active");
    this.auto(this.time);
  }

  auto(time:number){
  this.timeout?.clear()
   this.timeout = new Timeout(() => this.next(), time);
  }

  prev(){
    const prev = this.index - 1;
    if(prev >= 0){
      this.show(this.index - 1) ;
    }
  }

  next(){
    const next = this.index + 1;
    if(next < this.slides.length){
      this.show(this.index + 1);
    }
  }

  private addControls(){
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Slide Anterior";
    this.controls.appendChild(prevButton);
    nextButton.innerText = "Próximo Slide"
    this.controls.appendChild(nextButton);
    nextButton.addEventListener("pointerup", () => this.next())
    prevButton.addEventListener("pointerup", () => this.prev())
  }

  private init(){
    this.addControls()
    this.show(this.index)

  }
}
