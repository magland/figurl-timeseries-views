import { ViewComponentProps } from "@figurl/core-views"
import { FunctionComponent } from "react"
import { AnnotationsView, isAnnotationsViewData } from "./view-annotations"
import { isLiveTracesViewData, LiveTracesView } from "./view-live-traces"
import { isRawTracesViewData, RawTracesView } from "./view-raw-traces"
import { isTimeseriesGraphViewData, TimeseriesGraphView } from "./view-timeseries-graph"

const loadView = (o: {data: any, width: number, height: number, opts: any, ViewComponent: FunctionComponent<ViewComponentProps>}) => {
    const {data, width, height} = o
    if (isAnnotationsViewData(data)) {
        return <AnnotationsView data={data} width={width} height={height} />
    }
    else if (isLiveTracesViewData(data)) {
        return <LiveTracesView data={data} width={width} height={height} />
    }
    else if (isRawTracesViewData(data)) {
        return <RawTracesView data={data} width={width} height={height} />
    }
    else if (isTimeseriesGraphViewData(data)) {
        return <TimeseriesGraphView data={data} width={width} height={height} />
    }
    else return undefined
}

export default loadView