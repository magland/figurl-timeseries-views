import { isEqualTo, validateObject } from "@figurl/core-utils"

export type PerformanceTestViewData = {
    type: 'PerformanceTest'
}

export const isPerformanceTestViewData = (x: any): x is PerformanceTestViewData => {
    return validateObject(x, {
        type: isEqualTo('PerformanceTest')
    })
}