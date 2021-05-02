const canvas = document.querySelector("#canvas");
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width*1.07;
canvas.height = rect.height*1.07;
const raindropFx = new RaindropFX({
    canvas: canvas,
    background: "./84765992_p0.jpg"
});
raindropFx.start();
window.onresize = ()=>{
    const rect = canvas.getBoundingClientRect();
    raindropFx.resize(rect.width*1.05, rect.height*1.05);
}
let Crd={x:0,y:0}
document.addEventListener('mousemove',t=>Crd={x:t.pageX,y:t.pageY})
class Cursor{
    constructor(tar){
        this.dom=tar;
        this.renderedStyles={
            tx:{previous:0,current:0,amt:0.15},
            ty:{previous:0,current:0,amt:0.15}
        }
        this.MVEv=()=>{
            // this.renderedStyles.tx.previous=this.renderedStyles.tx.current=Crd.x;
            // this.renderedStyles.ty.previous=this.renderedStyles.ty.current=Crd.y;
            gsap.to(this.dom,{duration:0.9,ease:'Power3.easeOut',opacity:1});
            requestAnimationFrame(()=>this.render())
            document.removeEventListener('mousemove',this.MVEv);
        }
        document.addEventListener('mousemove',this.MVEv);
    }
    render(){
        this.renderedStyles.tx.current=-Crd.x*0.07;
        this.renderedStyles.ty.current=-Crd.y*0.07;
        for(const key in this.renderedStyles)
            this.renderedStyles[key].previous=(1-this.renderedStyles[key].amt)*this.renderedStyles[key].previous+this.renderedStyles[key].amt*this.renderedStyles[key].current;
        this.dom.style.transform=`translateX(${(this.renderedStyles.tx.previous)}px) translateY(${this.renderedStyles.ty.previous}px)`;
        requestAnimationFrame(() => this.render());
    }
};
new Cursor(document.querySelector("#root"));