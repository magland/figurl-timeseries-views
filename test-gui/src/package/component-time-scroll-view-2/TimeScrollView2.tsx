import { Splitter } from '@figurl/core-views';
import React, { FunctionComponent, useEffect, useMemo, useRef } from 'react';
import { DefaultToolbarWidth } from '../component-time-scroll-view';
import useActionToolbar from '../component-time-scroll-view/TimeScrollViewActionsToolbar';
import useTimeScrollEventHandlers, { suppressWheelScroll } from '../component-time-scroll-view/TimeScrollViewInteractions/TimeScrollViewEventHandlers';
import useTimeScrollZoom from '../component-time-scroll-view/TimeScrollViewInteractions/useTimeScrollZoom';
import { useTimeRange, useTimeseriesSelection } from '../context-timeseries-selection';
import { ViewToolbar } from '../ViewToolbar';
import { useTimeTicks } from './timeTicks';
import TSV2AxesLayer from './TSV2AxesLayer';
import TSV2CursorLayer from './TSV2CursorLayer';

type Props = {
    width: number
    height: number
    onCanvasElement: (elmt: HTMLCanvasElement) => void
    gridlineOpts?: {hideX: boolean, hideY: boolean}
    onKeyDown?: (e: React.KeyboardEvent) => void
    hideToolbar?: boolean
}

const defaultMargins = {
    left: 30,
    right: 20,
    top: 20,
    bottom: 50
}

export const useTimeScrollView2 = ({width, height, hideToolbar}: {width: number, height: number, hideToolbar?: boolean}) => {
    const margins = useMemo(() => (
        defaultMargins
    ), [])
    const toolbarWidth = hideToolbar ? 0 : DefaultToolbarWidth
    const canvasWidth = width - toolbarWidth
    const canvasHeight = height
    return {
        margins,
        canvasWidth,
        canvasHeight,
        toolbarWidth
    }
}

const TimeScrollView2: FunctionComponent<Props> = ({width, height, onCanvasElement, gridlineOpts, onKeyDown, hideToolbar}) => {
    const { visibleStartTimeSec, visibleEndTimeSec, zoomTimeseriesSelection } = useTimeRange()
    const {currentTime, currentTimeInterval } = useTimeseriesSelection()
    const timeRange = useMemo(() => (
        [visibleStartTimeSec, visibleEndTimeSec] as [number, number]
    ), [visibleStartTimeSec, visibleEndTimeSec])

    const {margins, canvasWidth, canvasHeight, toolbarWidth} = useTimeScrollView2({width, height, hideToolbar})

    const timeToPixel = useMemo(() => {
        if ((visibleStartTimeSec === undefined) || (visibleEndTimeSec === undefined)) return () => (0)
        if (visibleEndTimeSec <= visibleStartTimeSec) return () => (0)
        return (t: number) => (
            margins.left + (t - visibleStartTimeSec) / (visibleEndTimeSec - visibleStartTimeSec) * (canvasWidth - margins.left - margins.right)
        )
    }, [canvasWidth, visibleStartTimeSec, visibleEndTimeSec, margins])

    const timeTicks = useTimeTicks(canvasWidth, visibleStartTimeSec, visibleEndTimeSec, timeToPixel)

    const axesLayer = useMemo(() => {
        return (
            <TSV2AxesLayer
                width={canvasWidth}
                height={canvasHeight}
                timeRange={timeRange}
                margins={margins}
                timeTicks={timeTicks}
                gridlineOpts={gridlineOpts}
            />)
    }, [gridlineOpts, canvasWidth, canvasHeight, timeRange, margins, timeTicks])

    const currentTimePixels = useMemo(() => (currentTime !== undefined ? timeToPixel(currentTime) : undefined), [currentTime, timeToPixel])
    const currentTimeIntervalPixels = useMemo(() => (currentTimeInterval !== undefined ? [timeToPixel(currentTimeInterval[0]), timeToPixel(currentTimeInterval[1])] as [number, number] : undefined), [currentTimeInterval, timeToPixel])

    const cursorLayer = useMemo(() => {
        return (
            <TSV2CursorLayer
                width={canvasWidth}
                height={canvasHeight}
                timeRange={timeRange}
                margins={margins}
                currentTimePixels={currentTimePixels}
                currentTimeIntervalPixels={currentTimeIntervalPixels}
            />
        )
    }, [canvasWidth, canvasHeight, timeRange, margins, currentTimePixels, currentTimeIntervalPixels])

    const divRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => suppressWheelScroll(divRef), [divRef])
    const panelWidthSeconds = (visibleEndTimeSec ?? 0) - (visibleStartTimeSec ?? 0)
    const handleWheel = useTimeScrollZoom(divRef, zoomTimeseriesSelection)
    const {handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseMove} = useTimeScrollEventHandlers(margins.left, canvasWidth - margins.left - margins.right, panelWidthSeconds, divRef)

    const content = useMemo(() => {
        return (
            <div
                style={{
                    position: 'relative',
                    width: canvasWidth,
                    height: canvasHeight
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseLeave}
                tabIndex={0}
                onKeyDown={onKeyDown}
            >
                {axesLayer}
                {cursorLayer}
                <canvas
                    ref={onCanvasElement}
                    width={canvasWidth}
                    height={canvasHeight}
                />
            </div>
        )
    }, [onCanvasElement, axesLayer, cursorLayer, canvasWidth, canvasHeight, onKeyDown, handleWheel, handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave])
    
    const timeControlActions = useActionToolbar()

    if (hideToolbar) {
        return (
            <div ref={divRef}>
                {content}
            </div>
        )
    }

    return (
        <Splitter
            ref={divRef}
            width={width}
            height={height}
            initialPosition={toolbarWidth}
            adjustable={false}
        >
            <ViewToolbar
                width={toolbarWidth}
                height={height}
                customActions={timeControlActions}
            />
            {content}
        </Splitter>
    )
}

export default TimeScrollView2