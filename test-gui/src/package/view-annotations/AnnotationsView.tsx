import { Button } from '@material-ui/core';
import { Hyperlink } from '@figurl/core-views';
import { NiceTable } from '@figurl/core-views';
import { NiceTableColumn, NiceTableRow } from '@figurl/core-views';
import { useAnnotations } from '../context-annotations';
import { useRecordingSelection } from '../context-recording-selection';
import { useUrlState } from '@figurl/interface';
import { storeFileData } from '@figurl/interface';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { AnnotationsViewData } from './AnnotationsViewData';
import EditableTextField from './EditableTextField';

type Props = {
    data: AnnotationsViewData
    width: number
    height: number
}

const timepointColumns: NiceTableColumn[] = [
    {
        key: 'label',
        label: 'Label'
    },
    {
        key: 'time',
        label: 'Time'
    }
]

const timeIntervalColumns: NiceTableColumn[] = [
    {
        key: 'label',
        label: 'Label'
    },
    {
        key: 'interval',
        label: 'Interval'
    }
]

const AnnotationsView: FunctionComponent<Props> = ({data, width, height}) => {
    const {recordingSelection, recordingSelectionDispatch} = useRecordingSelection()
    const {focusTimeSeconds, focusTimeIntervalSeconds} = recordingSelection
    const {annotations, addAnnotation, removeAnnotation, setAnnotationLabel} = useAnnotations()
    const [saveEnabled, setSaveEnabled] = useState(true)

    const timepointRows: NiceTableRow[] = useMemo(() => {
        return annotations.filter(a => (a.type === 'timepoint')).map((x, i) => {
            if (x.type !== 'timepoint') throw Error('Unexpected')
            return {
                key: x.annotationId,
                columnValues: {
                    label: {
                        element: <EditableTextField onChange={newLabel => setAnnotationLabel(x.annotationId, newLabel)} value={x.label} />
                    },
                    time: {
                        element: <Hyperlink onClick={() => recordingSelectionDispatch({type: 'setFocusTime', focusTimeSec: x.timeSec, autoScrollVisibleTimeRange: true})}>{x.timeSec}</Hyperlink>
                    }
                }
            }
        })
    }, [annotations, recordingSelectionDispatch, setAnnotationLabel])

    const timeIntervalRows: NiceTableRow[] = useMemo(() => {
        return annotations.filter(a => (a.type === 'time-interval')).map((x, i) => {
            if (x.type !== 'time-interval') throw Error('Unexpected')
            return {
                key: x.annotationId,
                columnValues: {
                    label: {
                        element: <EditableTextField onChange={newLabel => setAnnotationLabel(x.annotationId, newLabel)} value={x.label} />
                    },
                    interval: {
                        element: <Hyperlink onClick={() => recordingSelectionDispatch({type: 'setFocusTimeInterval', focusTimeIntervalSec: x.timeIntervalSec, autoScrollVisibleTimeRange: true})}>{formatTimeInterval(x.timeIntervalSec)}</Hyperlink>
                    }
                }
            }
        })
    }, [annotations, recordingSelectionDispatch, setAnnotationLabel])

    const handleAddTimepoint = useCallback(() => {
        focusTimeSeconds !== undefined && addAnnotation({type: 'timepoint', annotationId: '', label: ``, timeSec: focusTimeSeconds})
    }, [focusTimeSeconds, addAnnotation])

    const handleAddTimeInterval = useCallback(() => {
        focusTimeIntervalSeconds !== undefined && addAnnotation({type: 'time-interval', annotationId: '', label: ``, timeIntervalSec: focusTimeIntervalSeconds})
    }, [focusTimeIntervalSeconds, addAnnotation])

    const handleDelete = useCallback((annotationId: string) => {
        removeAnnotation(annotationId)
    }, [removeAnnotation])

    const {updateUrlState} = useUrlState()

    const handleSave = useCallback(() => {
        const savedTimesJson = JSONStringifyDeterministic({annotations})
        setSaveEnabled(false)
        storeFileData(savedTimesJson).then((uri) => {
            setSaveEnabled(true)
            updateUrlState({annotations: uri})
        }).catch((err: Error) => {
            console.warn(err)
            alert(`Problem saving annotations: ${err.message}`)
        }).finally(() => {
            setSaveEnabled(true)
        })
    }, [annotations, updateUrlState])

    return (
        <div style={{margin: 20}}>
            <h3>Annotations</h3>
            <hr />

            <h4>Timepoints</h4>
            Selected (sec): {focusTimeSeconds !== undefined ? focusTimeSeconds.toFixed(7) : 'undefined'}
            <Button disabled={focusTimeSeconds === undefined} onClick={handleAddTimepoint}>Add timepoint</Button>
            <div style={{overflowY: 'auto', height: 160}}>
                <NiceTable
                    rows={timepointRows}
                    columns={timepointColumns}
                    onDeleteRow={handleDelete}
                />
            </div>
            <hr />

            <h4>Time intervals</h4>
            <pre>(Use shift+click)</pre>
            Selected (sec): {focusTimeIntervalSeconds !== undefined ? formatTimeInterval(focusTimeIntervalSeconds) : 'undefined'}
            <Button disabled={focusTimeIntervalSeconds === undefined} onClick={handleAddTimeInterval}>Add time interval</Button>
            <div style={{overflowY: 'auto', height: 160}}>
                <NiceTable
                    rows={timeIntervalRows}
                    columns={timeIntervalColumns}
                    onDeleteRow={handleDelete}
                />
            </div>
            <hr />

            <Button disabled={!saveEnabled} onClick={handleSave}>Save annotations</Button>
        </div>
    )
}

const formatTimeInterval = (x: [number, number]) => {
    return `[${x[0].toFixed(7)}, ${x[1].toFixed(7)}]`
}

// Thanks: https://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify
export const JSONStringifyDeterministic = ( obj: Object, space: string | number | undefined =undefined ) => {
    var allKeys: string[] = [];
    JSON.stringify( obj, function( key, value ){ allKeys.push( key ); return value; } )
    allKeys.sort();
    return JSON.stringify( obj, allKeys, space );
}

export default AnnotationsView