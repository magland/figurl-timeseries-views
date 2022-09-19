import { MainLayoutView } from '@figurl/core-views';
import { FunctionComponent } from 'react';
import { TimeseriesGraphView } from './package';
import { ViewData } from './ViewData';

type Props = {
    data: ViewData
    opts: any
    width: number
    height: number
}

const View: FunctionComponent<Props> = ({data, width, height, opts}) => {
    if (data.type === 'TimeseriesGraph') {
        return <TimeseriesGraphView data={data} width={width} height={height} />
    }
    else if (data.type === 'MainLayout') {
        return <MainLayoutView data={data} ViewComponent={View} width={width} height={height} />
    }
    else {
        console.warn('Unsupported view data', data)
        return <div>Unsupported view data: {data['type']}</div>
    }
}

export default View