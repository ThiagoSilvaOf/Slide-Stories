export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    constructor(container, slides, controls, time = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.index = 0;
        this.slide = this.slides[this.index];
        this.init();
    }
    hide(el) {
        el.classList.remove("active");
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[this.index];
        this.slides.forEach(slide => this.hide(slide));
        this.slide.classList.add("active");
    }
    prev() {
        const prev = this.index - 1;
        if (prev >= 0) {
            this.show(this.index - 1);
        }
    }
    next() {
        const next = this.index + 1;
        if (next < this.slides.length) {
            this.show(this.index + 1);
        }
    }
    addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerText = "Slide Anterior";
        this.controls.appendChild(prevButton);
        nextButton.innerText = "Próximo Slide";
        this.controls.appendChild(nextButton);
        nextButton.addEventListener("pointerup", () => this.next());
        prevButton.addEventListener("pointerup", () => this.prev());
    }
    init() {
        this.addControls();
        this.show(this.index);
    }
}
//# sourceMappingURL=Slide.js.map