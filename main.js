window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed')
    var canvas = document.getElementById("id_canvas1")
    var ctx = canvas.getContext("2d")
    var width
    var height
    var lastX,lastY
    var duration = 0
    var display_duration = 0

    var resize = function() {
        width = window.innerWidth
        height = window.innerHeight
        console.log("winWidth: "+width + " winHeight: "+height)
        canvas.width = width
        canvas.height = height
    }
    window.onresize = resize
    resize()

    var state = {
        x: (width / 2), y: (height / 2),
        pressedKeys: {
            left: false,
            right: false,
            up: false,
            down: false
        },
        touchStatus: {
            isTouch: false,
            isMove: false,
		}
    }


    function update(progress) {
        let time = Math.round((progress/1000) * 1000)/1000      //有効数字3桁 四捨五入 [ms]→[s]
        console.log("X: " + state.x + " Y: " + state.y)
        console.log("lastX: " + lastX + " lastY: " + lastY)
        // console.log("vx: " + state.touchStatus.movementX + " vy: " + state.touchStatus.movementY)
        background_color = "rgb(117, 137, 179)"
        
        let velocity = velocity_calculation(lastX, lastY, state.x, state.y, time)
        console.log("velocity: " + Math.round(velocity)*100/100)
        lastX = state.x;
        lastY = state.y;

        if(state.touchStatus.isTouch) {
            duration += time
            display_duration = Math.round(duration * 100)/100
        }
        else    duration = 0
        console.log("duration: " + Math.round(duration * 100)/100 + "[s]")
    }

    function draw() {
        ctx.fillStyle = background_color		// 背景色を設定
        ctx.fillRect(0,0,width,height)			// 塗りつぶし

        ctx.fillStyle = "rgb(241, 243, 247)"
        ctx.textAlign = "center"
        ctx.font = "120px 'Verdana'"
        ctx.fillText(display_duration + "[s]",width/2,height/2)
    }

    function loop(timestamp) {
        var progress = timestamp - lastRender
        // console.log("Time[s]: " + Math.round((timestamp/1000) * 1000)/1000)

        update(progress)
        draw()

        lastRender = timestamp
        window.requestAnimationFrame(loop)
    }
    var lastRender = 0
    window.requestAnimationFrame(loop)

    function velocity_calculation(lastX, lastY, nowX, nowY, progress) {
        let distance = Math.sqrt((lastX-nowX)**2 + (lastY-nowY)**2)
        distance = Math.round(distance * 1000)/1000       //有効数字3桁 四捨五入
        let velocity = distance / progress
        return velocity
    }

    function set_event_listener(canvas){
        canvas.addEventListener('mousemove', ev =>{
			callback.move(ev, ev.clientX, ev.clientY)
		})
		canvas.addEventListener('touchmove', ev =>{
			callback.move(ev, ev.changedTouches[0].clientX, ev.changedTouches[0].clientY)
		})
		canvas.addEventListener('mousedown', ev =>{
			callback.down(ev, ev.clientX, ev.clientY)
		})
		canvas.addEventListener('touchstart', ev =>{
			callback.down(ev, ev.changedTouches[0].clientX, ev.changedTouches[0].clientY)
		})
		canvas.addEventListener('mouseup', ev =>{
			callback.up(ev, ev.clientX, ev.clientY)
		})
		canvas.addEventListener('touchend', ev =>{
			callback.up(ev, ev.changedTouches[0].clientX, ev.changedTouches[0].clientY)
		})
    }
    var callback ={
        down(canvas, cx, cy){
            // console.log("down")
            canvas.preventDefault()
            state.x = cx
            state.y = cy
            state.touchStatus.isTouch = true;
        },
        up(canvas, cx, cy){
            // console.log("up")
            canvas.preventDefault()
            state.x = cx
            state.y = cy
            state.touchStatus.isTouch = false
            state.touchStatus.isMove = false
        },
        move(canvas, cx, cy){
            // console.log("move")
            canvas.preventDefault()
            state.x = cx
            state.y = cy
            state.touchStatus.isMove = true
        },
    }
    set_event_listener(canvas)

})