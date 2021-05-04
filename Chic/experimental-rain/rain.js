var Crd = { x: 0, y: 0 };
document.addEventListener('mousemove', t => Crd = { x: t.pageX, y: t.pageY });
class DoublePlusGood {
    constructor(tar, bgUrl) {
        (async () => {
            this.dom = tar;
            this.renderedStyles = {
                tx: { previous: 0, current: 0, amt: 0.15 },
                ty: { previous: 0, current: 0, amt: 0.15 }
            };
            this.Rect = this.dom.getBoundingClientRect();
            this.bg = new PIXI.Application({ width: this.Rect.width, height: this.Rect.height });
            await PixiLoad(bgUrl);
            this.bg_sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[bgUrl].texture);
            this.bg_sprite.anchor.set(0.5, 0.5);
            this.bg_sprite.scale.set(Math.max(this.Rect.width / this.bg_sprite.texture.width, this.Rect.height / this.bg_sprite.texture.height), Math.max(this.Rect.width / this.bg_sprite.texture.width, this.Rect.height / this.bg_sprite.texture.height));
            this.bg_sprite.position.set(this.Rect.width / 2, this.Rect.height / 2);
            this.bg.stage.addChild(this.bg_sprite);
            this.bg.render();
            const canvas = document.querySelector("#canvas");
            canvas.width = this.Rect.width * 1.07;
            canvas.height = this.Rect.height * 1.07;
            this.RdFx = new RaindropFX({
                canvas: canvas,
                background: this.bg.view
            });
            // document.getElementById("root").appendChild(this.bg.view);//test
            this.RdFx.start();
            window.onresize = () => {
                this.Rect = this.dom.getBoundingClientRect();
                Crd.x = Math.min(Crd.x, this.Rect.width);
                Crd.y = Math.min(Crd.y, this.Rect.height);
                this.RdFx.resize(this.Rect.width * 1.07, this.Rect.height * 1.07);
                this.bg.renderer.resize(this.Rect.width * 1.07, this.Rect.height * 1.07);
                this.bg_sprite.scale.set(Math.max(this.Rect.width / this.bg_sprite.texture.width, this.Rect.height / this.bg_sprite.texture.height), Math.max(this.Rect.width / this.bg_sprite.texture.width, this.Rect.height / this.bg_sprite.texture.height));
            };
            gsap.to(this.dom, { duration: 0.9, ease: 'Power3.easeOut', opacity: 1 });
            this.render();
        })();
    }
    render() {
        this.renderedStyles.tx.current = -Crd.x * 0.07;
        this.renderedStyles.ty.current = -Crd.y * 0.07;
        for (const key in this.renderedStyles)
            this.renderedStyles[key].previous = (1 - this.renderedStyles[key].amt) * this.renderedStyles[key].previous + this.renderedStyles[key].amt * this.renderedStyles[key].current;
        this.dom.style.transform = `translateX(${(this.renderedStyles.tx.previous)}px) translateY(${this.renderedStyles.ty.previous}px)`;
        this.bg_sprite.position.set(-this.renderedStyles.tx.previous + this.Rect.width / 2, -this.renderedStyles.ty.previous + this.Rect.height / 2);
        this.bg.render();
        this.RdFx.setBackground(this.bg.view);
        requestAnimationFrame(() => this.render());
    }
}
;
new DoublePlusGood(document.querySelector("#root"), "./84765992_p0.jpg");
function PixiLoad(url) {
    return new Promise((resolve) => {
        PIXI.Loader.shared.add(url).load(resolve);
    });
}
let FrameCount=0,LstTime=0;
function GetFPS(TimeStamp){
    FrameCount++;
    if(FrameCount==60){
        console.log(FrameCount*1000/(TimeStamp-LstTime));
        FrameCount=0;
        LstTime=TimeStamp;
    }
    requestAnimationFrame(GetFPS);
}
requestAnimationFrame(GetFPS);