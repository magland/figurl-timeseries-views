import { useUrlState } from '@figurl/interface'
import React, { FunctionComponent, PropsWithChildren, useEffect, useMemo, useReducer, useRef } from 'react'
import RecordingSelectionContext, { recordingSelectionReducer, defaultRecordingSelection } from './RecordingSelectionContext'

const SetupRecordingSelection: FunctionComponent<PropsWithChildren> = (props) => {
	const [recordingSelection, recordingSelectionDispatch] = useReducer(recordingSelectionReducer, defaultRecordingSelection)
	const value = useMemo(() => (
		{recordingSelection, recordingSelectionDispatch}
	), [recordingSelection, recordingSelectionDispatch])

	const {urlState} = useUrlState()
	const firstUrlState = useRef(true)
	useEffect(() => {
		if (!firstUrlState.current) return
		firstUrlState.current = true
		if (urlState.timeRange) {
			const tr = urlState.timeRange as [number, number]
			recordingSelectionDispatch({type: 'setVisibleTimeRange', startTimeSec: tr[0], endTimeSec: tr[1]})
		}
	}, [urlState])
    return (
        <RecordingSelectionContext.Provider value={value}>
            {props.children}
        </RecordingSelectionContext.Provider>
    )
}

export default SetupRecordingSelection
