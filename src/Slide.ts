import Timeout from "./Timeout.js";

export default class Slide {
  public container;
  public slides;
  public controls;
  public time;
  public index;
  public slide;
  public timeout:Timeout | null;
  pausedTimeout: Timeout | null;
  public paused:boolean;
  public thumbItems:HTMLElement[] | null;
  public thumb:HTMLElement | null;

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
    this.pausedTimeout = null;
    this.index = Number(localStorage.getItem("activeSlide"));
    this.slide = this.slides[this.index]
    this.paused = false;
    this.thumbItems = null;
    this.thumb = null

    this.init();    
  }

  hide(el:Element){
    el.classList.remove("active");
    if(el instanceof HTMLVideoElement){
      el.currentTime = 0;
      el.pause();
    }
  }

  show(index:number){
    this.index = index;
    this.slide = this.slides[this.index]
    localStorage.setItem("activeSlide", String(this.index));

    if(this.thumbItems){
      this.thumb = this.thumbItems[this.index]; 
      this.thumbItems.forEach(el => el.classList.remove("active"));
      this.thumb.classList.add("active");
    }

    this.slides.forEach(slide => this.hide(slide));
    this.slide.classList.add("active");
    if(this.slide instanceof HTMLVideoElement){
      this.autoVideo(this.slide)
    }else{
      this.auto(this.time);
    }
  }

  autoVideo(video:HTMLVideoElement){
    video.muted = true;
    video.play();
    let firstPlay = true
    video.addEventListener("playing", () => {
      if(firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
     
  }

  auto(time:number){
   this.timeout?.clear()
   this.timeout = new Timeout(() => this.next(), time);
   if(this.thumb) this.thumb.style.animationDuration = `${time}ms`;
  }

  prev(){
    if(this.paused) return;
    const prev = this.index - 1;
    if(prev >= 0){
      this.show(prev) ;
    }
  }

  next(){
    if(this.paused) return;
    const next = this.index + 1;
    if(next < this.slides.length){
      this.show(next);
    }else{
      this.show(0);
    }
  }

  pause(){
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true
      if(this.slide instanceof HTMLVideoElement){
        this.slide.pause();
      }
      if(this.thumbItems) this.thumbItems.forEach(el => el.classList.add("paused"))
    },300)
  }

  continue(){
    this.pausedTimeout?.clear();
    if(this.paused){
      this.paused = false;
      this.timeout?.continue();
      if(this.slide instanceof HTMLVideoElement){
        this.slide.play();
      }
      if(this.thumbItems) this.thumbItems.forEach(el => el.classList.remove("paused"))
    }
    
  }

  private addControls(){
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Slide Anterior";
    this.controls.appendChild(prevButton);
    nextButton.innerText = "Próximo Slide"
    this.controls.appendChild(nextButton);

    this.controls.addEventListener("pointerdown", () => this.pause())
    this.controls.addEventListener("pointerup", () => this.continue())

    nextButton.addEventListener("pointerup", () => this.next())
    prevButton.addEventListener("pointerup", () => this.prev())
  }

  private addThumbItems(){
    const thumbContainer = document.createElement("div");
    thumbContainer.id = "slide-thumb";
    for (let i = 0; i < this.slides.length; i++) {
      thumbContainer.innerHTML += `
        <span>
          <span class="thumb-item"></span>
        </span>
      `
    }

    this.controls.appendChild(thumbContainer);
    this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"))
  }

  private init(){
    this.addControls()
    this.addThumbItems();
    this.show(this.index)

  }
}
