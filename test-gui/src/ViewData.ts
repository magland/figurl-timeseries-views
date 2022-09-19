import { isOneOf } from '@figurl/core-utils'
import { TimeseriesGraphViewData, isTimeseriesGraphViewData } from './package/view-timeseries-graph'
import { AnnotationsViewData, isAnnotationsViewData } from './package/view-annotations'
import { isLiveTracesViewData, LiveTracesViewData } from './package/view-live-traces'
import { isRawTracesViewData, RawTracesViewData } from './package/view-raw-traces'
import { isMainLayoutViewData, MainLayoutViewData } from '@figurl/core-views'

export type ViewData =
    TimeseriesGraphViewData |
    AnnotationsViewData |
    LiveTracesViewData |
    RawTracesViewData |
    MainLayoutViewData
    

export const isViewData = (x: any): x is ViewData => {
    return isOneOf([
        isTimeseriesGraphViewData,
        isAnnotationsViewData,
        isLiveTracesViewData,
        isRawTracesViewData,
        isMainLayoutViewData
    ])(x)
}