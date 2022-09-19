import { useTimeRange } from '../context-recording-selection';
import { useMemo } from 'react';
import { TimeWidgetToolbarEntries } from '../component-time-scroll-view';
import { Divider, ToolbarItem } from '../ViewToolbar';

export type OptionalToolbarActions = {
    aboveDefault?: ToolbarItem[]
    belowDefault?: ToolbarItem[]
}

const useActionToolbar = (props: OptionalToolbarActions) => {
    const { aboveDefault, belowDefault } = props
    const { zoomRecordingSelection, panRecordingSelection } = useTimeRange()

    const timeControlActions = useMemo(() => {
        if (!zoomRecordingSelection || !panRecordingSelection) return []
        const preToolbarEntries = aboveDefault ? [...aboveDefault, Divider] : []
        const postToolbarEntries = belowDefault ? [Divider, ...belowDefault] : []
        const timeControls = TimeWidgetToolbarEntries({zoomRecordingSelection, panRecordingSelection})
        const actions: ToolbarItem[] = [
            ...preToolbarEntries,
            ...timeControls,
            ...postToolbarEntries
        ]
        return actions
    }, [zoomRecordingSelection, panRecordingSelection, aboveDefault, belowDefault])

    return timeControlActions
}

export default useActionToolbar