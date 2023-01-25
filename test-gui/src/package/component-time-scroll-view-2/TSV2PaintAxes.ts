import { TimeTick } from "./timeTicks";
import { TSV2AxesLayerProps } from "./TSV2AxesLayer";

export const paintAxes = (context: CanvasRenderingContext2D, props: TSV2AxesLayerProps) => {
    const {width, height, margins, timeTicks, gridlineOpts} = props
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    const xAxisVerticalPosition = height - margins.bottom
    paintTimeTicks(context, timeTicks, xAxisVerticalPosition, margins.top, {hideGridlines: gridlineOpts?.hideX})
    context.strokeStyle = 'black'
    drawLine(context, margins.left, xAxisVerticalPosition, width - margins.right, xAxisVerticalPosition)
}

const paintTimeTicks = (context: CanvasRenderingContext2D, timeTicks: TimeTick[], xAxisPixelHeight: number, plotTopPixelHeight: number, o: {hideGridlines?: boolean}) => {
    const hideTimeAxis = false
    if (!timeTicks || timeTicks.length === 0) return
    // Grid line length: if time axis is shown, grid lines extends 5 pixels below it. Otherwise they should stop at the edge of the plotting space.
    const labelOffsetFromGridline = 2
    const gridlineBottomEdge = xAxisPixelHeight + (hideTimeAxis ? 0 : + 5)
    context.textAlign = 'center'
    context.textBaseline = 'top'
    timeTicks.forEach(tick => {
        context.strokeStyle = tick.major ? 'gray' : 'lightgray'
        const topPixel = !o.hideGridlines ? plotTopPixelHeight : xAxisPixelHeight
        drawLine(context, tick.pixelXposition, gridlineBottomEdge, tick.pixelXposition, topPixel)
        if (!hideTimeAxis) {
            context.fillStyle = tick.major ? 'black' : 'gray'
            context.fillText(tick.label, tick.pixelXposition, gridlineBottomEdge + labelOffsetFromGridline)
        }
    })
}

const drawLine = (context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
}